import React, { useState, useEffect } from 'react'

const Book = ({ title, description, link, image, authors, categories }) => {
    return (
        <div className='book'>
            <div className='book-upper'>
                <a href={link} className='book-image-link'>
                    <img src={image !== null? `data:image/jpg;base64,${image}` : "/empty_cover.jpg"}></img>
                </a>
                <div className='book-upper-right'>
                    <a href={link}>{title}</a>
                    {/* <p className='book-authors'>{authors.join(', ')}</p>
                    <p className='book-categories'>{categories.join(', ')}</p> */}

                    <p className='book-authors'></p>
                    <p className='book-categories'></p>
                </div>
            </div>
            <p className='book-description'>{description}</p>
        </div>
    )
}

export default Book