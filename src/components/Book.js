import React from 'react'

const Book = ({ title, description, previewlink, infolink, image }) => {
    return (
        <div className='book'>
            <img src={`data:image/jpg;base64,${image}`}></img>
            <div>
                <h4>{title}</h4>
            </div>
        </div>
    )
}

export default Book