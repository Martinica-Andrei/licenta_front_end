import React, { useEffect, useContext, useState, useRef } from "react";
import ModalBackground from "./ModalBackground";
import styles from '../css/UserRecommendationsModal.module.css'
import AuthContext from "../contexts/AuthContext";
import LessInfoBook from "./LessInfoBook";
import { getCSRFToken } from "../utils";
import {
    MODELS_API_USER_BOOK_RECOMMENDATIONS,
    MODELS_API_USER_BOOK_RECOMMENDATIONS_TRAIN_LOGGED_IN_USER,
    MODELS_API_USER_BOOK_RECOMMENDATIONS_TRAINING_STATUS,
    MODELS_API_BOOKS_RATE_URL
} from "../externApi";

const UserRecommendationsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [cannotTrainMessage, setCannotTrainMessage] = useState(null)
    const [displayTrainButton, setDisplayTrainButton] = useState(false)
    const [isTrain, setIsTrain] = useState(false)
    const [progressValue, setProgressValue] = useState(0)

    const train_model = () => {
        setIsTrain(true)
        setProgressValue(0)
        setDisplayTrainButton(false)
        fetch(MODELS_API_USER_BOOK_RECOMMENDATIONS_TRAIN_LOGGED_IN_USER,
            {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.status === 200) {
                    const reader = res.body.getReader()
                    const decoder = new TextDecoder()
                    function readStream() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                setIsTrain(false)
                                fetchBooks()
                                return
                            }
                            const chunk = decoder.decode(value, { stream: true })
                            const json = JSON.parse(chunk)
                            setProgressValue(json.percentage)
                            readStream();
                        }).catch(err => console.error('Stream error:', err))
                    }
                    readStream()
                }
                else if (res.status === 401 || res.status == 403) {
                    setDisplay(false)
                    setIsAuth(false)
                    setIsTrain(false)
                }
            })
            .catch(err => {
                setIsTrain(false)
                console.log(err)
            })
    }

    const rate = (books_index, is_like) => {
        const { id, rating } = books[books_index]
        let newRating
        if (is_like) {
            newRating = (rating == null || rating === 'Dislike') ? 'Like' : 'None'
        }
        else {
            newRating = (rating == null || rating === 'Like') ? 'Dislike' : 'None'
        }
        const body = {
            book_id: id,
            rating: newRating
        }
        fetch(MODELS_API_BOOKS_RATE_URL,
            {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setIsAuth(false)
                    setDisplay(false)
                }
                else {
                    const booksCopy = [...books]
                    if (newRating !== 'None') {
                        booksCopy[books_index].rating = newRating
                        if (newRating === 'Like') {
                            booksCopy[books_index].nr_likes += 1
                        }
                        else {
                            booksCopy[books_index].nr_dislikes += 1
                        }
                    }
                    else {
                        booksCopy[books_index].rating = null
                    }
                    if (rating === 'Like') {
                        booksCopy[books_index].nr_likes -= 1
                    }
                    else if (rating === 'Dislike') {
                        booksCopy[books_index].nr_dislikes -= 1
                    }
                    setBooks(booksCopy)
                }
            })
    }

    const fetchBooks = () => {
        fetch(MODELS_API_USER_BOOK_RECOMMENDATIONS, { credentials: 'include' })
            .then(res => Promise.all([res, res.json()]))
            .then(([res, data]) => {
                if (res.status === 200) {
                    setBooks(data)
                }
                else if (res.status === 401) {
                    setDisplay(false)
                    setIsAuth(false)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (display === false || isTrain) {
            return
        }
        fetch(MODELS_API_USER_BOOK_RECOMMENDATIONS_TRAINING_STATUS, { credentials: 'include' })
            .then(res => Promise.all([res, res.json()]))
            .then(([res, data]) => {
                if (res.status === 401 || res.status == 403) {
                    setDisplay(false)
                    setIsAuth(false)
                    return
                }
                if (data['training_status'] === 'cannot_train' || data['training_status'] === 'currently_training_other_user') {
                    setCannotTrainMessage(data['message'])
                    setBooks([])
                    setDisplayTrainButton(false)
                    return
                }
                setCannotTrainMessage(null)
                if (data['training_status'] === 'must_train') {
                    setDisplayTrainButton(true)
                    setBooks([])
                    return
                }
                if (data['training_status'] === 'can_train') {
                    fetchBooks()
                    setDisplayTrainButton(true)               
                    return
                }
                if (data['training_status'] == 'already_trained'){
                    fetchBooks()
                    return
                }
                if (data['training_status'] === 'currently_training_logged_in_user') {
                    train_model()
                }
            })
            .catch(err => console.log(err))
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    const booksDiv = books.map((book, index) =>
        <LessInfoBook {...book} key={book.id} like={() => rate(index, true)} dislike={() => rate(index, false)}></LessInfoBook>
    )

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplay(false)}>X</button>
                <h3 className={styles.title}>My recommendations</h3>
                {cannotTrainMessage && <p className={styles.error}>{cannotTrainMessage}</p>}
                {displayTrainButton && <button className="basic-btn-2" onClick={train_model}>Build Recommendations</button>}
                {isTrain && <progress min={0} max={1} value={progressValue}></progress>}
                <div className={styles['book-section']}>
                    {booksDiv}
                </div>
            </div>
        </ModalBackground>
    )
}

export default UserRecommendationsModal