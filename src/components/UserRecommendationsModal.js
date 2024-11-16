import React, { useEffect, useContext } from "react";
import ModalBackground from "./ModalBackground";
import styles from '../css/UserRecommendationsModal.module.css'
import AuthContext from "../contexts/AuthContext";

const UserRecommendationsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)



    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>My recommendations</h3>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplay(false)}>X</button>
            </div>
        </ModalBackground>
    )
}

export default UserRecommendationsModal