import React, { useState, useEffect, useContext } from 'react'
import '../css/BookRecommendationsPage.css'
import {
    MODELS_API_BOOKS_RECOMMENDATIONS_URL, MODELS_API_AUTH_CHECK_SESSION_URL,
    MODELS_API_BOOKS_RATE_URL
} from '../externApi'
import Book from './Book'
import Nav from './Nav'
import useLocalStorageState from '../hooks/useLocalStorageState'
import AuthContext from '../contexts/AuthContext'
import LoginModal from './LoginModal'
import RegisterModal from "./RegisterModal"
import UserRoutesModal from "./UserRoutesModal"
import UserRatingsModal from './UserRatingsModal'
import UserRecommendationsModal from './UserRecommendationsModal'
import UserCategoriesModal from './UserCategoriesModal'
import { getCSRFToken, LOGGED_OUT_MESSAGE } from '../utils'

const BookRecommendationsPage = () => {
    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)
    const [displayUserRoutes, setDisplayUserRoutes] = useState(false)
    const [displayUserRatings, setDisplayUserRatings] = useState(false)
    const [displayUserRecommendations, setDisplayUserRecommendations] = useState(false)
    const [displayUserCategories, setDisplayUserCategories] = useState(false)
    const [id, setId] = useState(null)
    const [books, setBooks] = useState([])

    const isAuthArr = useLocalStorageState('isAuth', false)
    const isAuth = isAuthArr[0]
    const setIsAuth = (value) => {
        if (isAuth === true && value === false) {
            alert(LOGGED_OUT_MESSAGE)
        }
        isAuthArr[1](value)
    }

    useEffect(() => {
        if (isAuth === false) {
            return
        }
        fetch(MODELS_API_AUTH_CHECK_SESSION_URL,
            {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                }

            })
            .then(res => {
                if (res.status === 200) {
                    setIsAuth(true)
                }
                else if (res.status === 401 || res.status === 403) {
                    setIsAuth(false)
                }
            })
            .catch(err => console.log(err))

    }, [])

    useEffect(() => {
        if (id !== null) {
            const url = `${MODELS_API_BOOKS_RECOMMENDATIONS_URL}?id=${id}`
            fetch(url, { credentials: 'include' })
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(err => {
                    setBooks([])
                })
        }
    }, [id, isAuth])

    const rate = (books_index, is_like) => {
        if (isAuth === false) {
            setDisplayLogin(true)
            return
        }
        const { id, rating } = books[books_index]
        let newRating
        if (is_like) {
            newRating = (rating === null || rating === 'Dislike') ? 'Like' : 'None'
        }
        else {
            newRating = (rating === null || rating === 'Like') ? 'Dislike' : 'None'
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
                        if (newRating === 'Like'){
                            booksCopy[books_index].nr_likes += 1
                        }
                        else{
                            booksCopy[books_index].nr_dislikes += 1
                        }
                    }
                    else {
                        booksCopy[books_index].rating = null
                    }
                    if (rating === 'Like'){
                        booksCopy[books_index].nr_likes -= 1
                    }
                    else if (rating === 'Dislike'){
                        booksCopy[books_index].nr_dislikes -= 1 
                    }
                    setBooks(booksCopy)
                }
            })
    }


    return (
        <AuthContext.Provider value={[isAuth, setIsAuth]}>
            <Nav setId={setId} setDisplayLogin={setDisplayLogin} setDisplayRegister={setDisplayRegister} setDisplayUserRoutes={setDisplayUserRoutes}></Nav>
            <div className='main-section'>
                {books.length > 0 && <div className='book-section'>
                    {books.map((book, index) => <Book key={index} {...book} setDisplayLogin={setDisplayLogin}
                        like={() => rate(index, true)} dislike={() => { rate(index, false) }}></Book>)}
                </div>}
            </div>
            <LoginModal display={displayLogin} setDisplay={setDisplayLogin}></LoginModal>
            <RegisterModal display={displayRegister} setDisplay={setDisplayRegister}></RegisterModal>
            <UserRoutesModal display={displayUserRoutes} setDisplay={setDisplayUserRoutes} setDisplayUserRatings={setDisplayUserRatings}
                setDisplayUserRecommendations={setDisplayUserRecommendations}
                setDisplayUserCategories={setDisplayUserCategories}></UserRoutesModal>
            <UserRatingsModal display={displayUserRatings} setDisplay={setDisplayUserRatings}></UserRatingsModal>
            <UserRecommendationsModal display={displayUserRecommendations} setDisplay={setDisplayUserRecommendations}></UserRecommendationsModal>
            <UserCategoriesModal display={displayUserCategories} setDisplay={setDisplayUserCategories}></UserCategoriesModal>
        </AuthContext.Provider>
    )
}

export default BookRecommendationsPage