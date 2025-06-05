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


    const train_model = async () => {
        const readerUpdate = (json) => {
            console.log(json.percentage)
            setProgressValue(json.percentage)
        }
        const readerEnd = () => {
            setIsTrain(false)
            fetchBooks()
        }

        const [status, err] = await userRecommenderService.trainOnLoggedIn(readerUpdate, readerEnd)

        if (status === 400) {
            setIsTrain(false)
            validateTrainingStatus(err)
        }
        else if (status === 401 || status === 403) {
            setDisplay(false)
            setIsAuth(false)
            setIsTrain(false)
        }
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
        if (status === 200) {
            setBooks(data)
        }
        else {
            setBooks([])
        }
    }

    const validateTrainingStatus = (data) => {
        const trainingStatus = data['training_status']
        if (['cannot_train', 'currently_training_other_user'].includes(trainingStatus)) {
            setCannotTrainMessage(data['message'])
            setDisplayTrainButton(false)
        }
        else if (['must_train', 'can_train'].includes(trainingStatus)) {
            setCannotTrainMessage(null)
            setDisplayTrainButton(true)
        }
        else if (trainingStatus === 'already_trained') {
            setDisplayTrainButton(false)
            setCannotTrainMessage(null)
        }
        else if (trainingStatus === 'currently_training_logged_in_user') {
            train_model()
            setDisplayTrainButton(false)
            setCannotTrainMessage(null)
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
            validateTrainingStatus(data)
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