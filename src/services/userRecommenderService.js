import localStorageRepository from "../repositories/localStorageRepository"
import userRecommenderRepository from "../repositories/userRecommenderRepository"

const userRecommenderService = {
    getTrainingStatus: async () => {
        const res = await userRecommenderRepository.getTrainingStatus()
        return [res.status, await res.json()]
    },

    getLoggedInRecommendations : async () =>{
        const res = await userRecommenderRepository.getLoggedInRecommendations()
        return [res.status, await res.json()]
    }
}

export default userRecommenderService