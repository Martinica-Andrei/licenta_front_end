import { MODELS_API_BASE_URL } from './baseApiLink'

const ME_URL = MODELS_API_BASE_URL + '/me'

const userRepository = {
    getMe: async () => {
        const res = await fetch(ME_URL, { credentials: 'include' })
        return res
    }
}

export default userRepository