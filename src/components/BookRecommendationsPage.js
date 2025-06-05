import { useState, useEffect } from 'react'
import '../css/BookRecommendationsPage.css'
import {
    MODELS_API_BOOKS_RECOMMENDATIONS_URL,
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
import ExternalBookModal from './ExternalBookModal'
import { getCSRFToken, LOGGED_OUT_MESSAGE } from '../utils'
import authService from '../services/authService'
import bookService from '../services/bookService'

const BookRecommendationsPage = () => {
    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)
    const [displayUserRoutes, setDisplayUserRoutes] = useState(false)
    const [displayUserRatings, setDisplayUserRatings] = useState(false)
    const [displayUserRecommendations, setDisplayUserRecommendations] = useState(false)
    const [displayUserCategories, setDisplayUserCategories] = useState(false)
    const [displayExternalBook, setDisplayExternalBook] = useState(false)
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
        const checkSession = async () => {
            if (isAuth === false) {
                return
            }
            const status = await authService.getCheckSession()
            if (status != 200) {
                setIsAuth(false)
            }
        }
        checkSession()
    }, [])

    useEffect(() => {
        const fetchBooks = async () => {
            if (id !== null) {
                const data = await bookService.getRecommendations(id)
                setBooks(data)
            }
        }
        fetchBooks()
    }, [id, isAuth])

    const rate = async (book, is_like) => {
        if (isAuth === false) {
            setDisplayLogin(true)
            return
        }
        
        const status = await bookService.rate(book, is_like)

        if (status == 401 || status == 403){
            setIsAuth(false)
        }

        setBooks([...books])
    }


    return (
        <AuthContext.Provider value={[isAuth, setIsAuth]}>
            <Nav setId={setId} setDisplayLogin={setDisplayLogin} setDisplayRegister={setDisplayRegister}
                setDisplayUserRoutes={setDisplayUserRoutes} setDisplayExternalBook={setDisplayExternalBook}></Nav>
            <div className='main-section'>
                {books.length > 0 && <div className='book-section'>
                    {books.map((book) => <Book key={book.id} {...book} setDisplayLogin={setDisplayLogin}
                        like={() => rate(book, true)} dislike={() => { rate(book, false) }}></Book>)}
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
            <ExternalBookModal display={displayExternalBook} setDisplay={setDisplayExternalBook} setBooks={setBooks}></ExternalBookModal>
        </AuthContext.Provider>
    )
}

export default BookRecommendationsPage