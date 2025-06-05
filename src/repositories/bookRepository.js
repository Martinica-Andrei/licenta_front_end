import { MODELS_API_BASE_URL } from './baseApiLink'

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

    getRecommendationsById: async (book_id) => {
        const url = `${RECOMMENDATIONS_URL}?id=${book_id}`
        const res = await fetch(url)
        return res
    },

    getRecommendationsByContent: async (body) => {
        const res = await fetch(RECOMMENDATIONS_URL, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return res
    },

    rate: async (body, csrf_token) => {
        const res = await fetch(RATE_URL,
            {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "X-CSRFToken": csrf_token,
                    'Content-Type': 'application/json'
                }
            })
        return res
    }
}

export default bookRepository