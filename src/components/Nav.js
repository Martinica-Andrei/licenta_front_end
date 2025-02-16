import React, { useState, useContext } from "react"
import { MODELS_API_BOOKS_SEARCH_URL } from '../externApi'
import SearchBar from "./SearchBar"
import AuthContext from "../contexts/AuthContext"
import styles from '../css/Nav.module.css'

const Nav = ({ setId, setDisplayLogin, setDisplayRegister, setDisplayUserRoutes, setDisplayExternalBook }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)

    const createEndpoint = (value) => {
        return `${MODELS_API_BOOKS_SEARCH_URL}?count=100&title=${value}`
    }

    return (

        <div id={styles["nav-wrapper"]}>
            <nav id={styles["nav-main"]}>
                <h1>Book recommendations</h1>
                <div>
                    {isAuth === false ?
                        <>
                            <button className="basic-btn" onClick={() => setDisplayLogin(true)}>Login</button>
                            <button className="basic-btn" onClick={() => setDisplayRegister(true)}>Register</button>
                        </>
                        :
                        <button className="basic-btn" onClick={() => setDisplayUserRoutes(true)}>Profile</button>
                    }
                </div>
            </nav>
            <nav id={styles["nav-search"]}>
                <div className={styles['search-div']}>
                    <label>Search book: </label>
                    <SearchBar setId={setId} createEndpoint={createEndpoint} dbColumnName={'title'}></SearchBar>
                </div>
                <button className="basic-btn" onClick={() => setDisplayExternalBook(true)}>External book</button>
            </nav>
        </div>

    )
}

export default Nav