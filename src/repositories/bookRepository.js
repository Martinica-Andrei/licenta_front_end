import { MODELS_API_BASE_URL } from './baseApiLink'
import localStorageRepository from './localStorageRepository'

const BOOKS_URL = MODELS_API_BASE_URL + '/books'
const SEARCH_URL = BOOKS_URL + '/search'
const RECOMMENDATIONS_URL = BOOKS_URL + '/recommendations'
const RATE_URL = BOOKS_URL + '/rate'

const bookRepository = {
    getSearch: async (title, count) => {
        const url = `${SEARCH_URL}?title=${title}&count=${count}`
        const res = await fetch(url)
        return res
    },

    getRecommendations: async (book_id) => {
        const url = `${RECOMMENDATIONS_URL}?id=${book_id}`
        const res = await fetch(url)
        return res
    },
    rate: async (body) => {
        const res = await fetch(RATE_URL,
            {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "X-CSRFToken": localStorageRepository.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            })
        return res
    }
}

export default bookRepository