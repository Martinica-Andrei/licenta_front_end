import React, { useState, useEffect, useRef } from 'react'
import { MODELS_API_BOOKS_URL } from '../externApi'
import SearchBarButton from './SearchBarButton'

const SearchBar = ({ setId }) => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const inputRef = useRef(null)
    const divFindingsRef = useRef(null)
    const valueRef = useRef(value)

    const fetchTitles = () => {
        const v = encodeURIComponent(value)
        const url = `${MODELS_API_BOOKS_URL}?count=10&title=${v}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (valueRef.current === value) {
                    setTitles(data)
                }
            })
            .catch(err => {
                if (valueRef.current === value) {
                    setTitles([])
                    console.log(err)
                }
            })
    }

    useEffect(() => {
        if (value.length > 0) {
            valueRef.current = value
            const timeoutId = setTimeout(fetchTitles, 200)
            return () => {
                clearTimeout(timeoutId)
            }
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
            <label>Search book: </label>
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