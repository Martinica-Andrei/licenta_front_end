import React, { useContext } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_AUTH_LOGOFF } from "../externApi";

const UserRoutesModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        },
        className: "modal-background-right"
    }

    const signOut = () => {
        fetch(MODELS_API_AUTH_LOGOFF, {credentials: 'include'})
            .then(res => {
                if (res.status === 200) {
                    setIsAuth(false)
                    setDisplay(false)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className="user-routes-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setDisplay(false)}>X </button>
                <button className="basic-btn" onClick={signOut}>Sign Out</button>
            </div>
        </ModalBackground>
    )
}

export default UserRoutesModal