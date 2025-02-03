import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_AUTH_LOGOFF, MODELS_API_ME_URL } from "../externApi";
import styles from '../css/UserRoutesModal.module.css'

const UserRoutesModal = ({ display, setDisplay, setDisplayUserRatings, setDisplayUserRecommendations, setDisplayUserCategories }) => {

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
                    localStorage.removeItem('csrf_token')
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => console.log(err))
    }

    // could be changed to fetch only when auth changes
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
                else if (res.status === 401) {
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => console.log(err))
    }, [display, isAuth])

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className="flex-row">
                    <h3 className={styles.username}>{username}</h3>
                    <button className={styles['close-btn']} onClick={() => setDisplay(false)}>X </button>
                </div>
                <button className={styles.btn} onClick={()=>setDisplayUserCategories(true)}>Liked Categories</button>
                <button className={styles.btn} onClick={() => setDisplayUserRatings(true)}>My Ratings</button>
                <button className={styles.btn} onClick={() => setDisplayUserRecommendations(true)}>My Recommendations</button>
                <button className={styles.btn} onClick={signOut}>Sign Out</button>
            </div>
        </ModalBackground>
    )
}

export default UserRoutesModal