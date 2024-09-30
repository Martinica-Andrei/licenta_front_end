import React, {useState, useEffect} from 'react'
import SearchBar from './SearchBar'
import '../css/BookRecommendationsPage.css'

const BookRecommendationsPage = () => {

    const [id, setId] = useState(null)

    return (
        <div className='main-section'>
            <h1>Book recommendations</h1>
            <SearchBar setId={setId}></SearchBar>
        </div>
    )
}

export default BookRecommendationsPage