import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { } from "../externApi";
import styles from '../css/UserRatingsModal.module.css'

const UserRatingsModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                <h3 className={styles.title}>My Ratings</h3>

            </div>
        </ModalBackground>
    )
}

export default UserRatingsModal