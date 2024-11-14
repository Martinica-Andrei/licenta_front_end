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

const BookRecommendationsPage = () => {

    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)
    const [displayUserRoutes, setDisplayUserRoutes] = useState(false)
    const [id, setId] = useState(null)
    const [books, setBooks] = useState([])
    const [isAuth, setIsAuth] = useLocalStorageState('isAuth', false)

    useEffect(() => {
        if (isAuth === false) {
            fetch(MODELS_API_AUTH_CHECK_SESSION_URL, { credentials: 'include' })
                .then(res => {
                    if (res.status === 200) {
                        setIsAuth(true)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        if (id !== null) {
            const url = `${MODELS_API_BOOKS_RECOMMENDATIONS_URL}?id=${id}`
            fetch(url, {credentials:'include'})
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
            <UserRoutesModal display={displayUserRoutes} setDisplay={setDisplayUserRoutes}></UserRoutesModal>
        </AuthContext.Provider>
    )
}

export default BookRecommendationsPage