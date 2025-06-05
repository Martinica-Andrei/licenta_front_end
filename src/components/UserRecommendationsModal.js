import { useEffect, useContext, useState, useRef } from "react";
import ModalBackground from "./ModalBackground";
import styles from '../css/UserRecommendationsModal.module.css'
import AuthContext from "../contexts/AuthContext";
import LessInfoBook from "./LessInfoBook";
import { getCSRFToken } from "../utils";
import {
    MODELS_API_USER_BOOK_RECOMMENDATIONS_TRAIN_LOGGED_IN_USER,
} from "../externApi";
import bookService from "../services/bookService";
import userRecommenderService from "../services/userRecommenderService";

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
                else if (res.status === 401 || res.status === 403) {
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

    const rate = async (book, is_like) => {
        const status = await bookService.rate(book, is_like)

        if (status === 401 || status === 403) {
            setIsAuth(false)
            setDisplay(false)
        }

        setBooks([...books])
    }

    const fetchBooks = async () => {
        const [status, data] = await userRecommenderService.getLoggedInRecommendations()
        if (status === 401 || status == - 403) {
            setDisplay(false)
            setIsAuth(false)
            return
        }
        if (status === 200 && !('training_status' in data)) {
            setBooks(data)
        }
    }

    useEffect(() => {
        const fetchTrainingStatus = async () => {
            if (display === false || isTrain) {
                return
            }
            const [status, data] = await userRecommenderService.getTrainingStatus()
            if (status === 401 || status === 403) {
                setDisplay(false)
                setIsAuth(false)
                return
            }
            if (['cannot_train', 'currently_training_other_user'].includes(data['training_status'])) {
                setCannotTrainMessage(data['message'])
                fetchBooks()
                return
            }
            setCannotTrainMessage(null)
            if (data['training_status'] === 'must_train') {
                setDisplayTrainButton(true)
            }
            else if (data['training_status'] === 'can_train') {
                setDisplayTrainButton(true)
                return
            }
            else if (data['training_status'] === 'currently_training_logged_in_user') {
                train_model()
            }
            fetchBooks()
        }
        fetchTrainingStatus()
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    const booksDiv = books.map((book) =>
        <LessInfoBook {...book} key={book.id} like={() => rate(book, true)} dislike={() => rate(book, false)}></LessInfoBook>
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