import categoryRepository from "../repositories/categoryRepository"

const categoryService = {
    getCategories: async (name) => {
        const res = await categoryRepository.getCategories(name)
        const data = await res.json()
        return data
    }
}

export default categoryService