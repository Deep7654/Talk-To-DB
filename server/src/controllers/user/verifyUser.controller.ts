import { Request, Response , NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import validateToken from "../../services/user/validateToken.service.js";
import { User } from "../../db/models/user.model.js";
import {z} from "zod";

const verifyUserpayload = z.object({
    id : z.string(),
    username : z.string(),
    email : z.string()
})

const verifyUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the token from the query as prams 
            const { token } = req.query as { token: string | undefined };

            // if token is not provided then return error 
            if (!token) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "No token provided for verfication ")
                );
            }

            // decode the token from the query
            const decodedToken = validateToken(token , verifyUserpayload);

            console.log(decodedToken);

            // check the token is valid or not 
            if (!decodedToken) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "Invalid token")
                );
            }

            // find the user by id 
            const user = await User.findById(decodedToken.id);

            // check the user is valid or not 
            if (!user) {
                return res.status(401).json(
                    new ApiResponse(false,
                        401,
                        "User not found invalid token for vrification")
                );
            }
            // check that user is already verified or not 
            if(user.isVerified == true){
                return res.status(200).json(
                    new ApiResponse(true ,
                        200 ,
                        "user is Already verified " ,
                        {userId : user.id})
                )
            }
            // update the user status to verified 
            user.isVerified = true;

            // save the user 
            await user.save();

            console.log(`{
                username : ${user.username},
                email : ${user.email},
                id : ${user._id},
                isVerified : ${user.isVerified}
            }`);

            res.status(200).json(
                new ApiResponse(
                    true,
                    200,
                    "User verified successfully",
                    { username: decodedToken.username ,
                      email : decodedToken.email 
                    }
                )
            );
        } catch (error) {
            next(new ApiError(400, "Error while verifying user"));
        }
    }
)


export default verifyUser
