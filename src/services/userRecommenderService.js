import localStorageRepository from "../repositories/localStorageRepository"
import userRecommenderRepository from "../repositories/userRecommenderRepository"

const userRecommenderService = {
    getTrainingStatus: async () => {
        const res = await userRecommenderRepository.getTrainingStatus()
        return [res.status, await res.json()]
    },

    getLoggedInRecommendations: async () => {
        const res = await userRecommenderRepository.getLoggedInRecommendations()
        return [res.status, await res.json()]
    },

    trainOnLoggedIn: async (updateCallback, endCallback) => {
        const csrf_token = localStorageRepository.getCSRFToken()
        const res = await userRecommenderRepository.trainOnLoggedIn(csrf_token)
        const status = res.status
        if (status !== 200) {
            return [status, await res.json()]
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        await readTrainOnLoggedInStream(reader, decoder, updateCallback, endCallback)
        return [status, null]
    }
}

const readTrainOnLoggedInStream = async (reader, decoder, updateCallback, endCallback) => {
    const {done, value} = await reader.read()
    if (done){
        endCallback()
        return
    }
    const chunk = decoder.decode(value, { stream: true })
    const json = JSON.parse(chunk)
    updateCallback(json)
    readTrainOnLoggedInStream(reader, decoder, updateCallback, endCallback)
}

export default userRecommenderService