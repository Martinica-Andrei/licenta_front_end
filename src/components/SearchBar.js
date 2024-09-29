import React, { useState, useEffect } from 'react'
import { MODELS_API_BOOKS_URL } from '../externApi'

const SearchBar = () => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])

    useEffect(() => {
        if (value.length >= 3) {
            const url = `${MODELS_API_BOOKS_URL}?count=10&title=${value}`
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setTitles(data)
                })
                .catch(err => setTitles([]))
        }
        else {
            setTitles([])
        }
    }, [value])
    console.log(titles)
    return (
        <div className='search-bar-div '>
            <label>Search movie: </label>
            <div className='search-bar-input'>
                <input value={value} onChange={e => setValue(e.target.value)}></input>
                <div className='search-bar-findings-div'>
                {titles.map(obj => <button key={obj['id']}>{obj['title']}</button>)}
                </div>
            </div>
        </div>
    )
}

export default SearchBar