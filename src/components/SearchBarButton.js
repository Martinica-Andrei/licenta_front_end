import React from 'react'

const SearchBarButton = ({ text, id, click }) => {

    const onMouseDown = event => {
        if (event.button === 0) {
            click(id, text)
        }
        else {
            event.preventDefault()
        }
    }

    return (
        <button onMouseDown={onMouseDown}>{text}</button>
    )
}

export default SearchBarButton