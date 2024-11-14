import React, { useState, useEffect, useContext } from 'react'
import '../css/BookRecommendationsPage.css'
import { MODELS_API_BOOKS_RECOMMENDATIONS_URL, MODELS_API_AUTH_CHECK_SESSION_URL } from '../externApi'
import Book from './Book'
import Nav from './Nav'
import useLocalStorageState from '../hooks/useLocalStorageState'
import AuthContext from '../contexts/AuthContext'
import LoginModal from './LoginModal'
import RegisterModal from "./RegisterModal"
import UserRoutesModal from "./UserRoutesModal"
import UserRatingsModal from './UserRatingsModal'
import { getCSRFToken } from '../utils'

const BookRecommendationsPage = () => {
    //TODO 
    //IMPLEMENT LIKE AND DISLIKE METHODS HERE SO THAT books array changes when user likes or dislikes
    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)
    const [displayUserRoutes, setDisplayUserRoutes] = useState(false)
    const [displayUserRatings, setDisplayUserRatings] = useState(false)
    const [id, setId] = useState(null)
    const [books, setBooks] = useState([])
    const [isAuth, setIsAuth] = useLocalStorageState('isAuth', false)

    useEffect(() => {
        fetch(MODELS_API_AUTH_CHECK_SESSION_URL, 
            { 
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json",
                    "X-CSRFToken" : getCSRFToken()
                }

            })
            .then(res => {
                if (res.status === 200) {
                    setIsAuth(true)
                }
                else if (res.status === 401 || res.status === 403){
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

    return (
        <AuthContext.Provider value={[isAuth, setIsAuth]}>
            <Nav setId={setId} setDisplayLogin={setDisplayLogin} setDisplayRegister={setDisplayRegister} setDisplayUserRoutes={setDisplayUserRoutes}></Nav>
            <div className='main-section'>
                {books.length > 0 && <div className='book-section'>
                    {books.map((book, index) => <Book key={index} {...book} setDisplayLogin={setDisplayLogin} books={books}></Book>)}
                </div>}
            </div>
            <LoginModal display={displayLogin} setDisplay={setDisplayLogin}></LoginModal>
            <RegisterModal display={displayRegister} setDisplay={setDisplayRegister}></RegisterModal>
            <UserRoutesModal display={displayUserRoutes} setDisplay={setDisplayUserRoutes} setDisplayUserRatings={setDisplayUserRatings}></UserRoutesModal>
            <UserRatingsModal display={displayUserRatings} setDisplay={setDisplayUserRatings}></UserRatingsModal>
        </AuthContext.Provider>
    )
}

export default BookRecommendationsPage