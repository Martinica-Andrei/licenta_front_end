import { MODELS_API_BASE_URL } from './baseApiLink'

export const USER_BOOK_RECOMMENDATIONS_URL = MODELS_API_BASE_URL + '/user_book_recommendations'
export const TRAINING_STATUS_URL = USER_BOOK_RECOMMENDATIONS_URL + '/training_status'
export const TRAIN_LOGGED_IN_USER_URL = USER_BOOK_RECOMMENDATIONS_URL + '/train_logged_in_user'

const userRecommenderRepository = {
    getTrainingStatus: async () => {
        const res = await fetch(TRAINING_STATUS_URL, { credentials: 'include' })
        return res
    },

    getLoggedInRecommendations: async () => {
        const res = await fetch(USER_BOOK_RECOMMENDATIONS_URL, { credentials: 'include' })
        return res
    },

    trainOnLoggedIn: async (csrf_token) => {
        const res = await fetch(TRAIN_LOGGED_IN_USER_URL, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "X-CSRFToken": csrf_token,
                'Content-Type': 'application/json'
            }
        })
        return res
    }
  
}

export default userRecommenderRepository