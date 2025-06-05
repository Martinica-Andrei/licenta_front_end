import authorRepository from "../repositories/authorRepository"

const authorService = {
    getAuthors: async (name) => {
        const res = await authorRepository.getAuthors(name)
        const data = await res.json()
        return data
    }
}

export default authorService