import categoryRepository from "../repositories/categoryRepository"
import localStorageRepository from "../repositories/localStorageRepository"

const categoryService = {
    getCategories: async (name) => {
        const res = await categoryRepository.getCategories(name)
        const data = await res.json()
        return data
    },

    likeCategory: async (category, is_like) => {
        const body = {
            id: category.id,
            like: is_like
        }
        const res = await categoryRepository.likeCategory(body, localStorageRepository.getCSRFToken())
        const status = res.status
        if (status === 200) {
            category.liked = is_like
        }
        return status
    }
}

export default categoryService