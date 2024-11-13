import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_AUTH_LOGOFF, MODELS_API_ME_URL } from "../externApi";

const UserRoutesModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [username, setUsername] = useState(null)

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        },
        className: "modal-background-right"
    }

    const signOut = () => {
        fetch(MODELS_API_AUTH_LOGOFF, { credentials: 'include' })
            .then(res => {
                if (res.status === 200) {
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (display === false) {
            return
        }
        fetch(MODELS_API_ME_URL, { credentials: 'include' })
            .then(res => Promise.all([res, res.json()]))
            .then(([res, data]) => {
                if (res.status === 200) {
                    setUsername(data.name)
                }
                else if (res.status == 401 && 'sessionToken' in data) {
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => console.log(err))
    })

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className="user-routes-modal" onClick={e => e.stopPropagation()}>
                <div className="flex-row">
                    <p className="user-routes-username">{username}</p>
                    <button className="user-routes-close-btn" onClick={() => setDisplay(false)}>X </button>
                </div>
                <button className="user-routes-btn">My ratings</button>
                <button className="user-routes-btn" onClick={signOut}>Sign Out</button>
            </div>
        </ModalBackground>
    )
}

export default UserRoutesModal