import React from "react";
import styles from '../css/LessInfoBook.module.css'

const LessInfoBook = ({ id, title, image, link, rating, like, dislike }) => {

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