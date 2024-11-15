import React from "react";
import styles from '../css/LessInfoBook.module.css'

const LessInfoBook = ({ id, title, image, link, rating }) => {
    const like = 1;
    const dislike = 2;
    // const like = () => {
    //     const newRating = (ratingState === null || ratingState == 'Dislike') ? 'Like' : 'None'
    //     const body = {
    //         book_id: id,
    //         rating: newRating
    //     }
    //     fetch(MODELS_API_BOOKS_RATE_URL,
    //         {
    //             credentials: 'include',
    //             method: 'POST',
    //             body: JSON.stringify(body),
    //             headers: {
    //                 "X-CSRFToken": getCSRFToken(),
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then(res => {
    //             if (res.status === 401 || res.status === 403) {
    //                 setIsAuth(false)
    //             }
    //             else {
    //                 if (newRating !== 'None') {
    //                     setRatingState(newRating)
    //                 }
    //                 else {
    //                     setRatingState(null)
    //                 }
    //             }
    //         })
    // }

    // const dislike = () => {
    //     const newRating = (ratingState === null || ratingState == 'Like') ? 'Dislike' : 'None'
    //     const body = {
    //         book_id: id,
    //         rating: newRating
    //     }
    //     fetch(MODELS_API_BOOKS_RATE_URL,
    //         {
    //             credentials: 'include',
    //             method: 'POST',
    //             body: JSON.stringify(body),
    //             headers: {
    //                 "X-CSRFToken": getCSRFToken(),
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then(res => {
    //             if (res.status === 401 || res.status === 403) {
    //                 setIsAuth(false)
    //             }
    //             else {
    //                 if (newRating !== 'None') {
    //                     setRatingState(newRating)
    //                 }
    //                 else {
    //                     setRatingState(null)
    //                 }
    //             }
    //         })
    // }

    const like_png_path = rating !== 'Like' ? './like.png' : 'like-filled.png'
    const dislike_png_path = rating !== 'Dislike' ? './dislike.png' : 'dislike-filled.png'

    return (
        <div className={styles['main-div']}>
            <a href={link} className={styles['book-image-link']}>
                <img src={image !== null ? `data:image/jpg;base64,${image}` : "/empty_cover.jpg"}></img>
            </a>
            <div className={styles['right-section']}>
                <div className={styles['title-div']}>
                    <a href={link} className={styles.title}>{title}</a>
                </div>
                <div className={styles['book-rating-section']}>
                    <button className='rate-btn' onClick={like}><img src={like_png_path}></img></button>
                    <button className='rate-btn' onClick={dislike}><img src={dislike_png_path}></img></button>
                </div>
            </div>
        </div>
    )
}

export default LessInfoBook