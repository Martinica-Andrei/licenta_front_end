import { useState, useContext } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import authService from "../services/authService";

const RegisterModal = ({ display, setDisplay }) => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})
    const [isAuth, setIsAuth] = useContext(AuthContext)

    const getErrorStyle = (key) => {
        let obj = { style: { display: 'none' } }
        if (key in errors) {
            obj.style.display = 'block'
        }
        return obj
    }

    const setDisplayWrapper = (v) =>{
        setName('')
        setPassword('')
        setRememberMe(false)
        setErrors({})
        setDisplay(v)
    }

    const submit = (e) => {
        e.preventDefault()
        if (isAuth) {
            return
        }
        const register = async () => {
            const [status, data] = await authService.register(name, password, rememberMe)
            if (status >= 400) {
                setErrors(data)
            }
            else {
                setDisplayWrapper(false)
            }
        }
        register()
    }

    const attributes = {
        onClick: (e) => {
            setDisplayWrapper(false)
        }
    }

    return (
        <ModalBackground display={display} setDisplay={setDisplayWrapper} divAttributes={attributes}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <div className="div-close-modal">
                    <button className='close-btn' onClick={() => setDisplayWrapper(false)}>X</button>
                </div>
                <h1>Register</h1>
                <form className="basic-form" onSubmit={submit}>
                    <div className="input-div">
                        <label >Name: </label>
                        <div className="form-div">
                            <input value={name} onChange={e => setName(e.target.value)}></input>
                            <p className="error" {...getErrorStyle('name')}>{errors['name']}</p>
                        </div>
                    </div>
                    <div className="input-div">
                        <label >Password: </label>
                        <div className="form-div">
                            <input type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
                            <p className="error" {...getErrorStyle('password')}>{errors['password']}</p>
                        </div>
                    </div>
                    <div className="input-div">
                        <label >Remember me: </label>
                        <div>
                            <input type='checkbox' checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}></input>
                            <p className="error" {...getErrorStyle('remember_me')}>{errors['remember_me']}</p>
                        </div>
                    </div>
                    <div className="auth-modal-submit-div">
                        <button className="basic-btn-2">Register</button>
                    </div>
                </form>
            </div>
        </ModalBackground>
    )
}

export default RegisterModal