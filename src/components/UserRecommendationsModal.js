import { useEffect, useContext, useState, useRef } from "react";
import ModalBackground from "./ModalBackground";
import styles from '../css/UserRecommendationsModal.module.css'
import AuthContext from "../contexts/AuthContext";
import LessInfoBook from "./LessInfoBook";
import bookService from "../services/bookService";
import userRecommenderService from "../services/userRecommenderService";

const UserRecommendationsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [cannotTrainMessage, setCannotTrainMessage] = useState(null)
    const [displayTrainButton, setDisplayTrainButton] = useState(false)
    const [isTrain, setIsTrain] = useState(false)
    const [progressValue, setProgressValue] = useState(0)

    const setDisplayWrapper = (v) =>{
        setBooks([])
        setCannotTrainMessage(null)
        setDisplayTrainButton(false)
        setIsTrain(false)
        setProgressValue(0)
        setDisplay(v)
    }

    const train_model = async () => {
        const readerUpdate = (json) => {
            setProgressValue(json.percentage)
        }
        const readerEnd = () => {
            setIsTrain(false)
            fetchTrainingStatus()
            fetchBooks()
        }

        const [status, err] = await userRecommenderService.trainOnLoggedIn(readerUpdate, readerEnd)

        if (status === 200) {
            setIsTrain(true)
            setDisplayTrainButton(false)
            setProgressValue(0)
        }
        else if (status === 400) {
            setIsTrain(false)
            validateTrainingStatus(err)
        }
        else if (status === 401 || status === 403) {
            setDisplayWrapper(false)
            setIsAuth(false)
            setIsTrain(false)
        }
    }

    const rate = async (book, is_like) => {
        const status = await bookService.rate(book, is_like)

        if (status === 401 || status === 403) {
            setIsAuth(false)
            setDisplayWrapper(false)
        }

        setBooks([...books])
    }

    const fetchBooks = async () => {
        const [status, data] = await userRecommenderService.getLoggedInRecommendations()
        if (status === 401 || status == - 403) {
            setDisplayWrapper(false)
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

    const fetchTrainingStatus = async () => {
        if (display === false || isTrain) {
            return
        }
        const [status, data] = await userRecommenderService.getTrainingStatus()
        if (status === 401 || status === 403) {
            setDisplayWrapper(false)
            setIsAuth(false)
            return
        }
        validateTrainingStatus(data)
    }

    useEffect(() => {
        fetchTrainingStatus()
        fetchBooks()
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplayWrapper(false)
        }
    }

    const booksDiv = books.map((book) =>
        <LessInfoBook {...book} key={book.id} like={() => rate(book, true)} dislike={() => rate(book, false)}></LessInfoBook>
    )

    return (
        <ModalBackground display={display} setDisplay={setDisplayWrapper} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplayWrapper(false)}>X</button>
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