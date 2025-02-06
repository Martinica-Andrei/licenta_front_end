import React, { useState, useEffect, useRef } from 'react'
import SearchBarButton from './SearchBarButton'
import styles from '../css/SearchBar.module.css'

const SearchBar = ({ setId, createEndpoint, dbColumnName, clearValueOnSelect=false }) => {

    const [value, setValue] = useState('')
    const [titles, setTitles] = useState([])
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const inputRef = useRef(null)
    const divFindingsRef = useRef(null)
    const valueRef = useRef(value)

    const fetchTitles = () => {
        const v = encodeURIComponent(value)
        const url = createEndpoint(v)
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
        setId(id, text)
        if (clearValueOnSelect){
            setValue('')
        }
    }

    return (
        <div>
            <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
                onFocus={() => setInputHasFocus(true)} onBlur={() => setInputHasFocus(false)}></input>
            {titles.length > 0 && <div className={styles.findings} ref={divFindingsRef}>
                {titles.map(obj => <SearchBarButton key={obj['id']} id={obj['id']} text={obj[dbColumnName]} click={buttonClick}></SearchBarButton>)}
            </div>}
        </div>
    )
}

export default SearchBar