import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_ME_URL } from "../externApi";
import styles from '../css/UserRatingsModal.module.css'
import LessInfoBook from "./LessInfoBook";

const UserRatingsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [bookFilter, setBookFilter] = useState('All')

    useEffect(() =>{
        if (display === false){
            return
        }
        fetch(MODELS_API_ME_URL, {credentials: 'include'})
        .then(res => Promise.all([res, res.json()]))
        .then(([res, data]) =>{
            if (res.status === 200){
                setBooks(data.ratings)
            }
            else if(res.status === 401 || res.status === 403){
                setIsAuth(false)
                setDisplay(false)
            }
        })
        .catch(err =>{
            console.log(err)
            setBooks([])
        })
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    let bookFiltered = books
    if (bookFilter !== 'All'){
        bookFiltered = books.filter(v => v.rating === bookFilter)
    }

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
                    {bookFiltered.map((book, index) => <LessInfoBook {...book} key={index}></LessInfoBook>)}
                </div>
            </div>
        </ModalBackground>
    )
}

export default UserRatingsModal