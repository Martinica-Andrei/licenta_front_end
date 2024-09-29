import React from 'react'
import SearchBar from './SearchBar'
import '../css/BookRecommendationsPage.css'

const BookRecommendationsPage = () => {
  return (
    <div className='main-section'>
      <h1>Book recommendations</h1>
        <SearchBar></SearchBar>
    </div>
  )
}

export default BookRecommendationsPage