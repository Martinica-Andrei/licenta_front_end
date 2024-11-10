import React, { useState, useEffect } from 'react'
import '../css/BookRecommendationsPage.css'
import { MODELS_API_BOOKS_RECOMMENDATIONS_URL } from '../externApi'
import Book from './Book'
import Nav from './Nav'

const BookRecommendationsPage = () => {

    const [id, setId] = useState(null)
    const [books, setBooks] = useState([])

    useEffect(() => {
        if (id !== null) {
            const url = `${MODELS_API_BOOKS_RECOMMENDATIONS_URL}?id=${id}`
            fetch(url)
                .then(res => res.json())
                .then(data => setBooks(data))
                .catch(err => {
                    setBooks([])
                })
        }
    }, [id])

    return (
        <>
            <Nav setId={setId}></Nav>
            <div className='main-section'>
                {books.length > 0 && <div className='book-section'>
                    {books.map((book, index) => <Book key={index} {...book}></Book>)}
                </div>}
            </div>
        </>
    )
}

export default BookRecommendationsPage