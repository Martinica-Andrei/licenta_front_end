import { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import styles from '../css/UserRoutesModal.module.css'
import authService from "../services/authService";
import userService from "../services/userService";

const UserRoutesModal = ({ display, setDisplay, setDisplayUserRatings, setDisplayUserRecommendations, setDisplayUserCategories }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [username, setUsername] = useState(null)

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        },
        className: "modal-background-right"
    }

    const signOut = async () => {
        const status = await authService.logoff()
        if (status === 200) {
            setIsAuth(false)
            setDisplay(false)
        }
    }

    useEffect(() => {
        const fetchMe = async () => {
            if (display === false) {
                return
            }
            const [status, data] = await userService.getMe()
            if (status === 200){
                setUsername(data.name)
            }
            else if (status === 401){
                setIsAuth(false)
                setDisplay(false)
            }
        }
        fetchMe()
    }, [display, isAuth])

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className="flex-row">
                    <h3 className={styles.username}>{username}</h3>
                    <button className={styles['close-btn']} onClick={() => setDisplay(false)}>X </button>
                </div>
                <button className={styles.btn} onClick={() => setDisplayUserCategories(true)}>Liked Categories</button>
                <button className={styles.btn} onClick={() => setDisplayUserRatings(true)}>My Ratings</button>
                <button className={styles.btn} onClick={() => setDisplayUserRecommendations(true)}>My Recommendations</button>
                <button className={styles.btn} onClick={signOut}>Sign Out</button>
            </div>
        </ModalBackground>
    )
}

export default UserRoutesModal