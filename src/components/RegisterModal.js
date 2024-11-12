import React, { useState, useContext } from "react";
import ModalBackground from "./ModalBackground";
import { MODELS_API_AUTH_REGISTER_URL } from '../externApi'
import AuthContext from '../contexts/AuthContext'

const RegisterModal = ({ display, setDisplay }) => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [isAuth, setIsAuth] = useContext(AuthContext)

    const getErrorStyle = (key) => {
        let obj = { style: { display: 'none' } }
        if (key in errors) {
            obj.style.display = 'block'
        }
        return obj
    }

    const submit = (e) => {
        e.preventDefault()
        if (isAuth){
            return
        }
        let body = {
            "name": name,
            "password": password,
        }
        fetch(MODELS_API_AUTH_REGISTER_URL, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status >= 400) {
                    return res.json()
                }
                else {
                    setDisplay(false)
                    setName('')
                    setPassword('')
                    setIsAuth(true)                
                    return {}
                }
            })
            .then(data => {
                setErrors(data);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const attributes = {
        onClick: (e) =>{
            setDisplay(false)
        }
    }

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <div className="div-close-modal">
                    <button className='close-btn' onClick={() => setDisplay(false)}>X</button>
                </div>
                <h1>Register</h1>
                <form className="basic-form" onSubmit={submit}>
                    <div className="input-div">
                        <label >Name: </label>
                        <div>
                            <input value={name} onChange={e => setName(e.target.value)}></input>
                            <p className="error" {...getErrorStyle('name')}>{errors['name']}</p>
                        </div>
                    </div>
                    <div className="input-div">
                        <label >Password: </label>
                        <div>
                            <input type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
                            <p className="error" {...getErrorStyle('password')}>{errors['password']}</p>
                        </div>
                    </div>
                    <div className="login-modal-submit-div">
                        <button className="basic-btn-2">Register</button>
                    </div>
                </form>
            </div>
        </ModalBackground>
    )
}

export default RegisterModal