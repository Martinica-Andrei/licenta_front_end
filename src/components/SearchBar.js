import React, { useState, useEffect, useRef } from 'react'
import SearchBarButton from './SearchBarButton'
import styles from '../css/SearchBar.module.css'

const SearchBar = ({ setId, fetchMethod, dbColumnName, clearValueOnSelect = false }) => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const inputRef = useRef(null)
    const divFindingsRef = useRef(null)
    const valueRef = useRef(value)

    const fetchTitles = async () => {
        const data = await fetchMethod(value)
        if (valueRef.current === value) {
            setTitles(data)
            if (divFindingsRef.current) {
                divFindingsRef.current.scrollTop = 0
            }
        }
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
                divFindingsRef.current.style.display = ''
            }
            else {
                divFindingsRef.current.style.display = 'none'
            }
        }
    }, [inputHasFocus])

    const buttonClick = (id, text) => {
        setValue(text)
        setId(id, text)
        if (clearValueOnSelect) {
            setValue('')
        }
    }

    return (
        <div style={{ position: "relative" }}>
            <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
                onFocus={() => setInputHasFocus(true)} onBlur={() => setInputHasFocus(false)}></input>
            {titles.length > 0 && <div className={styles.findings} ref={divFindingsRef}>
                {titles.map(obj => <SearchBarButton key={obj['id']} id={obj['id']} text={obj[dbColumnName]} click={buttonClick}></SearchBarButton>)}
            </div>}
        </div>
    )
}

export default SearchBar