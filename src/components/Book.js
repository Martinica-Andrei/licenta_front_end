import React from 'react'
import styles from '../css/Book.module.css'

const Book = ({ id, title, description, link, image, rating, nr_likes, nr_dislikes, authors, categories, like, dislike}) => {

    const like_png_path = rating !== 'Like' ? './like.png' : 'like-filled.png'
    const dislike_png_path = rating !== 'Dislike' ? './dislike.png' : 'dislike-filled.png'

    const authorsArr = Object.entries(authors).map(([key, value]) => `${key}${value !== null ? `(${value})` : ''}`)
       
    return (
        <div className={styles.book}>
            <div className={styles['book-upper']}>
                <a href={link} className={styles['book-image-link']}>
                    <img src={image !== null ? `data:image/jpg;base64,${image}` : "/empty_cover.jpg"}></img>
                </a>
                <div className={styles['book-upper-right']}>
                    <div className={styles['title-div']}>
                        <a className={styles.title} href={link}>{title}</a>
                    </div>
                    <p className={styles['book-authors']}>{authorsArr.join(', ')}</p>
                    <p className={styles['book-categories']}>{categories.join(', ')}</p> 
                </div>
            </div>
            <p className={styles['book-description']}>{description}</p>
            <div className={styles['book-rating-section']}>
                <button className='rate-btn' onClick={like}><img src={like_png_path}></img></button>
                <span>{nr_likes}</span>
                <button className='rate-btn' onClick={dislike}><img src={dislike_png_path}></img></button>
                <span>{nr_dislikes}</span>
            </div>
        </div>
    )
}

export default Book