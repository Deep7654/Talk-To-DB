import { loginService } from "./login.service.js";
import { User } from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";

// check user exist or not 
const userExists = async (username: string) => {
    try {
        console.log("bdhjbsjk")
        const user = await User.findOne({ username })
        if (!user) {
            console.log("No Existing User Found")
            return null
        } else {
            console.log(`User already exists ${user}`)
            return user
        }
    } catch (error) {
        console.error("Error in userExists service:", error);
        throw new ApiError(400, "Error While finding Existing User ")
    }

}

// export all services from on service index 
export { loginService, userExists }