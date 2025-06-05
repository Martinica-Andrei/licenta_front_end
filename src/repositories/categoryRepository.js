import { MODELS_API_BASE_URL } from './baseApiLink'

const CATEGORIES_URL = MODELS_API_BASE_URL + '/categories'

const categoryRepository = {
    getCategories: async (name) =>{
        const url = `${CATEGORIES_URL}?name=${name}`
        const res = await fetch(url)
        return res
    }    
}

export default categoryRepository