const localStorageRepository = {
    getCSRFToken: () => {
        return localStorage.getItem('csrf_token')
    },
    setCSRFToken: (csrf_token) =>{
        localStorage.setItem('csrf_token', csrf_token)
    },
    removeCSRFToken: () =>{
        localStorage.removeItem('csrf_token')
    }
}

export default localStorageRepository