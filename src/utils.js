export const getCSRFToken = () => {
    return localStorage.getItem('csrf_token')
}
