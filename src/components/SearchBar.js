import React, { useState, useEffect, useRef } from 'react'
import { MODELS_API_BOOKS_SEARCH_URL } from '../externApi'
import SearchBarButton from './SearchBarButton'
import styles from '../css/SearchBar.module.css'

const SearchBar = ({ setId }) => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const inputRef = useRef(null)
    const divFindingsRef = useRef(null)
    const valueRef = useRef(value)

    const fetchTitles = () => {
        const v = encodeURIComponent(value)
        const url = `${MODELS_API_BOOKS_SEARCH_URL}?count=100&title=${v}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (valueRef.current === value) {
                    setTitles(data)
                    if (divFindingsRef.current) {
                        divFindingsRef.current.scrollTop = 0
                    }
                }
            })
            .catch(err => {
                if (valueRef.current === value) {
                    setTitles([])
                    if (divFindingsRef.current) {
                        divFindingsRef.current.scrollTop = 0
                    }
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
        <div className={styles.main}>
            <label>Search book: </label>
            <div className={styles['input-div']}>
                <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
                    onFocus={() => setInputHasFocus(true)} onBlur={() => setInputHasFocus(false)}></input>
                {titles.length > 0 && <div className={styles.findings} ref={divFindingsRef}>
                    {titles.map(obj => <SearchBarButton key={obj['id']} id={obj['id']} text={obj['title']} click={buttonClick}></SearchBarButton>)}
                </div>}

            </div>
        </div>
    )
}

export default SearchBar