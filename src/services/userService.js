import userRepository from "../repositories/userRepository"

const userService = {
    getMe : async () =>{
        const res = await userRepository.getMe()
        const status = res.status
        if (status !== 200){
            return [status, null]
        }
        const data = await res.json()
        return [status, data]
    }
}

export default userService