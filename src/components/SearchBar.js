import React, { useState, useEffect, useRef } from 'react'
import { MODELS_API_BOOKS_URL } from '../externApi'
import SearchBarButton from './SearchBarButton'

const SearchBar = ({setId}) => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const inputRef = useRef(null)
    const divFindingsRef = useRef(null)

    useEffect(() => {
        if (value.length > 0) {
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

    useEffect(() => {
        if (divFindingsRef.current) {
            if (inputHasFocus) {
                divFindingsRef.current.style.visibility = 'visible'
            }
            else {
                divFindingsRef.current.style.visibility = 'hidden'

            }
        }
    }, [inputHasFocus])

    const buttonClick = (id, text) => {
        setValue(text)
        setId(id)
    }

    return (
        <div className='search-bar-div '>
            <label>Search movie: </label>
            <div className='search-bar-input'>
                <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
                    onFocus={() => setInputHasFocus(true)} onBlur={() => setInputHasFocus(false)}></input>
                {titles.length > 0 && <div className='search-bar-findings-div' ref={divFindingsRef}>
                    {titles.map(obj => <SearchBarButton key={obj['id']} id={obj['id']} text={obj['title']} click={buttonClick}></SearchBarButton>)}
                </div>}

            </div>
        </div>
    )
}

export default SearchBar