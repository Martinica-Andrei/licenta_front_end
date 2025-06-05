import bookRepository from "../repositories/bookRepository"

const bookService = {
    getSearch : async (title, count) =>{
        const res = await bookRepository.getSearch(title, count)
        const data = await res.json()
        return data
    }
}

export default bookService