import bookRepository from "../repositories/bookRepository"

const bookService = {
    getSearch : async (title, count) =>{
        const res = await bookRepository.getSearch(title, count)
        const data = await res.json()
        return data
    },

    getRecommendations : async(book_id) =>{
        const res = await bookRepository.getRecommendations(book_id)
        const data = await res.json()
        return data
    }
}

export default bookService