import React, { useState, useEffect, useContext } from "react"
import { MODELS_API_BOOKS_SEARCH_URL } from '../externApi'
import SearchBar from "./SearchBar"
import AuthContext from "../contexts/AuthContext"
import styles from '../css/Nav.module.css'

const Nav = ({ setId, setDisplayLogin, setDisplayRegister, setDisplayUserRoutes, setDisplayExternalBook }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [clientHeight, setClientHeight] = useState(0)
    const [displayNav, setDisplayNav] = useState(true)

    const minHeight = 700;

    const createEndpoint = (value) => {
        return `${MODELS_API_BOOKS_SEARCH_URL}?count=100&title=${value}`
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setClientHeight(document.documentElement.clientHeight)
            if (clientHeight !== document.documentElement.clientHeight) {
                if (document.documentElement.clientHeight >= minHeight) {
                    setDisplayNav(true)
                }
            }
        });

        resizeObserver.observe(document.documentElement);
        return () => {
            resizeObserver.disconnect();
        }
    }, [clientHeight])

    return (

        <div id={styles["nav-wrapper"]}>
            {displayNav &&
                <>
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
                </>}
            {clientHeight < minHeight && <button onClick={() => setDisplayNav(prev => !prev)}>≡</button>}

        </div>

    )
}

export default Nav