import authRepository from "../repositories/authRepository"
import localStorageRepository from "../repositories/localStorageRepository"

const authService = {
    getCheckSession: async () => {
        const res = await authRepository.getCheckSession()
        if (res.status === 200){
            const data = await res.json()
            localStorageRepository.setCSRFToken(data.csrf_token)
        }
        return res.status
    },
    login: async (name, password, rememberMe) => {
        const body = {
            "name": name,
            "password": password,
            "remember_me": rememberMe
        }
        const res = await authRepository.login(body)
        const status = res.status
        const data = await res.json()
        if (status === 200){
            localStorageRepository.setCSRFToken(data.csrf_token)
        }
        return [status, data]
    },
    register: async (name, password, rememberMe) => {
        const body = {
            "name": name,
            "password": password,
            "remember_me": rememberMe
        }
        const res = await authRepository.register(body)
        const status = res.status
        const data = await res.json()
        if (status === 200){
            localStorageRepository.setCSRFToken(data.csrf_token)
        }
        return [status, data]
    },
    logoff: async () => {
        const res = await authRepository.logoff()
        const status = res.status
        if (status === 200){
            localStorageRepository.removeCSRFToken()
        }
        return status
    }
}

export default authService