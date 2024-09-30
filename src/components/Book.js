import React from 'react'

const Book = ({ title, description, previewlink, infolink, image, authors, categories }) => {

    let link = infolink
    if (link === null) {
        link = previewlink
    }
    if (link === null) {
        link = "#"
    }

    return (
        <div className='book'>
            <div className='book-upper'>
                <a href={link} className='book-image-link'>
                    <img src={`data:image/jpg;base64,${image}`}></img>
                </a>
                <div className='book-upper-right'>
                    <a href={link}>{title}</a>
                    <p className='book-authors'>{authors.join(', ')}</p>
                    <p className='book-categories'>{categories.join(', ')}</p>
                </div>
            </div>
            <p className='book-description'>{description}</p>
        </div>
    )
}

export default Book