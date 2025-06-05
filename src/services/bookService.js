import bookRepository from "../repositories/bookRepository"

const bookService = {
    getSearch: async (title, count) => {
        const res = await bookRepository.getSearch(title, count)
        const data = await res.json()
        return data
    },

    getRecommendations: async (book_id) => {
        const res = await bookRepository.getRecommendations(book_id)
        const data = await res.json()
        return data
    },

    rate: async (book, is_like) => {
        const [newRating, modify_likes, modify_dislikes] = getNewRating(is_like, book.rating)

        const body = {
            book_id: book.id,
            rating: newRating
        }
        const res = await bookRepository.rate(body)
        const status = res.status

        if (status === 200) {
            book.rating = newRating
            book.nr_likes += modify_likes
            book.nr_dislikes += modify_dislikes
        }

        return status
    }
}

const getNewRating = (is_like, current_rating) => {
    let modify_likes = 0Fray
    let modify_dislikes = 0
    let newRating;
    if (is_like) {
        // like if is null
        if (current_rating === null) {
            newRating = 'Like'
            modify_likes = 1
        }
        // like if is dislike and remove dislike
        else if (current_rating === 'Dislike') {
            newRating = 'Like'
            modify_likes = 1
            modify_dislikes = -1
        }
        // remove rating if it is like
        else /* Like*/ {
            newRating = null
            modify_likes = -1
        }
    }
    else /*is_dislike*/ {
         // dislike if is null
        if (current_rating === null) {
            newRating = 'Dislike'
            modify_dislikes = 1
        }
        // dislike if it is like and remove like
        else if (current_rating === 'Like') {
            newRating = 'Dislike'
            modify_likes = -1
            modify_dislikes = 1
        }
        // remove rating if it is dislike
        else /* Dislike*/ {
            newRating = null
            modify_dislikes = -1
        }
    }
    return [newRating, modify_likes, modify_dislikes]
}

export default bookService