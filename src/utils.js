export const getCSRFToken = () => {
    return localStorage.getItem('csrf_token')
}

export const setCSRFToken = (csrf_token) => {
    localStorage.setItem('csrf_token', csrf_token)
}

export const LOGGED_OUT_MESSAGE = "You have been logged out."