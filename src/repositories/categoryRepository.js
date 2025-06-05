import { MODELS_API_BASE_URL } from './baseApiLink'

const CATEGORIES_URL = MODELS_API_BASE_URL + '/categories'
const LIKE_URL = CATEGORIES_URL + '/like'

const categoryRepository = {
    getCategories: async (name) => {
        const url = `${CATEGORIES_URL}?name=${name}`
        const res = await fetch(url, { credentials: 'include' })
        return res
    },

    likeCategory: async (body, csrf_token) => {
        const res = await fetch(LIKE_URL,
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

export default categoryRepository