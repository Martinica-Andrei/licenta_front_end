import { MODELS_API_BASE_URL } from './baseApiLink'

const AUTHORS_URL = MODELS_API_BASE_URL + '/authors'

const authorRepository = {
    getAuthors: async (name) =>{
        const url = `${AUTHORS_URL}?name=${name}`
        const res = await fetch(url)
        return res
    }
}

export default authorRepository