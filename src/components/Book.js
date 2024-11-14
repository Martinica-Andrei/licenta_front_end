import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_BOOKS_RATE_URL } from '../externApi'
import { getCSRFToken } from '../utils'
import styles from '../css/Book.module.css'

// take books as props to check if ratingState should be synced with rating
const Book = ({ id, title, description, link, image, rating, authors, categories, setDisplayLogin, books }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [ratingState, setRatingState] = useState(rating)

    useEffect(() => {
        setRatingState(rating)
    }, [books])

    // could add an extra function that represents the common code between like and dislike
    const like = () => {
        if (isAuth === false) {
            setDisplayLogin(true)
            return
        }
        const newRating = (ratingState === null || ratingState == 'Dislike') ? 'Like' : 'None'
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
                    if (newRating !== 'None') {
                        setRatingState(newRating)
                    }
                    else {
                        setRatingState(null)
                    }
                }
            })
    }

    const dislike = () => {
        if (isAuth === false) {
            setDisplayLogin(true)
            return
        }
        const newRating = (ratingState === null || ratingState == 'Like') ? 'Dislike' : 'None'
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
                    if (newRating !== 'None') {
                        setRatingState(newRating)
                    }
                    else {
                        setRatingState(null)
                    }
                }
            })
    }

    const like_png_path = ratingState !== 'Like' ? './like.png' : 'like-filled.png'
    const dislike_png_path = ratingState !== 'Dislike' ? './dislike.png' : 'dislike-filled.png'

    return (
        <div className={styles.book}>
            <div className={styles['book-upper']}>
                <a href={link} className={styles['book-image-link']}>
                    <img src={image !== null ? `data:image/jpg;base64,${image}` : "/empty_cover.jpg"}></img>
                </a>
                <div className={styles['book-upper-right']}>
                    <a href={link}>{title}</a>
                    {/* <p className={style['book-authors']}>{authors.join(', ')}</p>
                    <p className={style['book-categories']}>{categories.join(', ')}</p> */}

                    <p className={styles['book-authors']}></p>
                    <p className={styles['book-categories']}></p>
                </div>
            </div>
            <p className={styles['book-description']}>{description}</p>
            <div className={styles['book-rating-section']}>
                <button className='rate-btn' onClick={like}><img src={like_png_path}></img></button>
                <button className='rate-btn' onClick={dislike}><img src={dislike_png_path}></img></button>
            </div>
        </div>
    )
}

export default Book