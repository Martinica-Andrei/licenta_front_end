import React, { useState } from "react"
import SearchBar from "./SearchBar"
import LoginModal from './LoginModal'

const Nav = ({ setId }) => {

    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)

    return (
        <>
            <div id="nav-wrapper">
                <nav id="nav-main">
                    <h1>Book recommendations</h1>
                    <div id="nav-main-right">
                        <button className="basic-btn" onClick={() => { setDisplayLogin(true) }}>Login</button>
                        <button className="basic-btn">Register</button>
                    </div>
                </nav>
                <nav id="nav-search">
                    <SearchBar setId={setId}></SearchBar>
                </nav>
            </div>
            <LoginModal display={displayLogin} setDisplay={setDisplayLogin}></LoginModal>
        </>
    )
}

export default Nav