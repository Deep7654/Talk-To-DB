import { Hash } from "crypto"
import { User } from "../../db/models/user.model.js"
import ApiError from "../../utils/apiError.js"
import bcrptjs from "bcryptjs"



const checkPassword = async (password: string, hashPassword: string) => {
    const validPassword = await bcrptjs.compare(password, hashPassword)
    return validPassword
}




const loginService = (username: string, password: string) => {
    try {

    } catch (error) {
        throw new ApiError(500, "Internal Server Error while login")
    }
}


export { loginService, checkPassword }