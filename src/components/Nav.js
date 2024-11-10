import React from "react"
import SearchBar from "./SearchBar"

const Nav = ({setId}) => {
    return (
        <div id="nav-wrapper">
            <nav id="nav-main">
                <h1>Book recommendations</h1>
                <div id="nav-main-right">
                    <button>Login</button>
                    <button>Register</button>
                </div>
            </nav>
            <nav id="nav-search">
                <SearchBar setId={setId}></SearchBar>
            </nav>
        </div>
    )
}

export default Nav