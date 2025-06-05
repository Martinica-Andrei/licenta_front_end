import { MODELS_API_BASE_URL } from './baseApiLink'

const AUTH_URL = MODELS_API_BASE_URL + '/auth'
const LOGIN_URL = AUTH_URL + '/login'
const REGISTER_URL = AUTH_URL + '/register'
const LOGOFF_URL = AUTH_URL + '/logoff'
const CHECK_SESSION_URL = AUTH_URL + '/check_session'

const authRepository = {
    getCheckSession: async () => {
        const res = await fetch(CHECK_SESSION_URL,
            {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                }
            })
        return res
    },
    login: async (body) => {
        const res = await fetch(LOGIN_URL, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return res
    },
    register: async (body) => {
        const res = await fetch(REGISTER_URL, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return res
    },
    logoff: async () => {
        const res = await fetch(LOGOFF_URL, { credentials: 'include' })
        return res
    }
}

export default authRepository