import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_ME_URL, MODELS_API_BOOKS_RATE_URL } from "../externApi";
import styles from '../css/UserRatingsModal.module.css'
import LessInfoBook from "./LessInfoBook";
import { getCSRFToken } from "../utils";

const UserRatingsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [bookFilter, setBookFilter] = useState('All')

    useEffect(() => {
        if (display === false) {
            return
        }
        fetch(MODELS_API_ME_URL, { credentials: 'include' })
            .then(res => Promise.all([res, res.json()]))
            .then(([res, data]) => {
                if (res.status === 200) {
                    setBooks(data.ratings)
                }
                else if (res.status === 401 || res.status === 403) {
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => {
                console.log(err)
                setBooks([])
            })
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    const rate = (books_index, is_like) => {
        const { id, rating } = books[books_index]
        let newRating
        if (is_like) {
            newRating = (rating === null || rating == 'Dislike') ? 'Like' : 'None'
        }
        else {
            newRating = (rating === null || rating == 'Like') ? 'Dislike' : 'None'
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
                }
                else {
                    const booksCopy = [...books]
                    if (newRating !== 'None') {
                        booksCopy[books_index].rating = newRating
                    }
                    else {
                        booksCopy[books_index].rating = null
                    }
                    setBooks(booksCopy)
                }
            })
    }

    // map to preserve index
    const booksDiv = books.map((book, index) => {
        if (bookFilter === 'All' || book.rating === bookFilter) {
            return <LessInfoBook {...book} key={book.id} like={() => rate(index, true)} dislike={() => rate(index, false)}></LessInfoBook>
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