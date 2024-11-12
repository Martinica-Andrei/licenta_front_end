import React, { useState, useContext } from "react"
import SearchBar from "./SearchBar"
import LoginModal from './LoginModal'
import RegisterModal from "./RegisterModal"
import AuthContext from "../contexts/AuthContext"

const Nav = ({ setId }) => {

    const [displayLogin, setDisplayLogin] = useState(false)
    const [displayRegister, setDisplayRegister] = useState(false)
    const [isAuth, setIsAuth] = useContext(AuthContext)

    return (
        <>
            <div id="nav-wrapper">
                <nav id="nav-main">
                    <h1>Book recommendations</h1>
                    <div id="nav-main-right">
                        {isAuth === false ?
                            <>
                                <button className="basic-btn" onClick={() => setDisplayLogin(true)}>Login</button>
                                <button className="basic-btn" onClick={() => setDisplayRegister(true)}>Register</button>
                            </>
                            :
                            <>
                                <button className="basic-btn">Profile</button>
                            </>
                        }
                    </div>
                </nav>
                <nav id="nav-search">
                    <SearchBar setId={setId}></SearchBar>
                </nav>
            </div>
            <LoginModal display={displayLogin} setDisplay={setDisplayLogin}></LoginModal>
            <RegisterModal display={displayRegister} setDisplay={setDisplayRegister}></RegisterModal>
        </>
    )
}

export default Nav