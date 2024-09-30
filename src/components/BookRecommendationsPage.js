import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import '../css/BookRecommendationsPage.css'
import { MODELS_API_BOOKS_RECOMMENDATIONS_URL } from '../externApi'
import Book from './Book'

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
        <div className='main-section'>
            <h1>Book recommendations</h1>
            <SearchBar setId={setId}></SearchBar>
            {books.length > 0 && <div className='book-section'>
                {books.map((book, index) => <Book key={index} {...book}></Book>)}
            </div>}
        </div>
    )
}

export default BookRecommendationsPage