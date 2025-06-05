import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import styles from '../css/UserRatingsModal.module.css'
import LessInfoBook from "./LessInfoBook";
import bookService from "../services/bookService";
import userService from "../services/userService";

const UserRatingsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [bookFilter, setBookFilter] = useState('All')

    useEffect(() => {
        const fetchMe = async () => {
            if (display === false) {
                return
            }
            const [status, data] = await userService.getMe()
            if (status === 200){
                setBooks(data.ratings)
            }
            else if (status === 401 || status === 403){
                setIsAuth(false)
                setDisplay(false)
            }
        }
        fetchMe()
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
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

    // map to preserve index
    const booksDiv = books.map((book, index) => {
        if (bookFilter === 'All' || book.rating === bookFilter) {
            return <LessInfoBook {...book} key={book.id} like={() => rate(book, true)} dislike={() => rate(book, false)}></LessInfoBook>
        }
        else
            return undefined
    })

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>My Ratings</h3>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplay(false)}>X</button>
                <select className={styles.dropdown} value={bookFilter} onChange={e => setBookFilter(e.target.value)}>
                    <option value='All'>All</option>
                    <option value='Like'>Liked</option>
                    <option value='Dislike'>Disliked</option>
                </select>
                <div className={styles['book-section']}>
                    {booksDiv}
                </div>
            </div>
        </ModalBackground>
    )
}

export default UserRatingsModal