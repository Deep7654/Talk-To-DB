import { Request, Response , NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import  validateToken  from "../../services/user/validateToken.service.js";
import {z} from "zod";
import { User } from "../../db/models/user.model.js";

const isRefreshTokenValidSchema = z.object({
    id : z.string(),
    email : z.string(),
    tokenVersion : z.number()
})

const logoutController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username , logoutFlag } = req.body;
        
        const refreshToken = req.cookies?.refreshToken;

        if(!refreshToken){
            return res.status(401).json(
                new ApiResponse(false , 401 , "Unauthorized-login-first" , {
                  message :"Login first to log out from all device",
                  username : username
                })
              )
        }

        const decodedToken = validateToken(refreshToken , isRefreshTokenValidSchema)
        
        if(logoutFlag == "all-device"){
            const user = await User.findById(decodedToken.id)
            if(!user){
                return res.status(401).json(
                    new ApiResponse(false , 401 , "Unauthorized-login-first" , {
                      message :"Login first to log out from all device",
                      username : username
                    })
                  )
            }
            user.refreshToken = "";
            user.tokenVersion += 1;
            await user.save();
        }

        const isProd = process.env.NODE_ENV === "production"
        res.clearCookie("refreshToken" , {
            httpOnly : true,
            secure : isProd,
            sameSite : "lax",
            path : "/api/user/refresh",
        });

        console.log("LogoutSuccessfully");
    
        // logout from all devices
        if(logoutFlag == "all-device"){
            return res.status(200).json(
                new ApiResponse(
                    true,
                    200,
                    "User logged out successfully from all devices",
                    { username }
                )
            )
        }

        // response for single device logout
        res.status(200).json(
            new ApiResponse(
                true,
                200,
                "User logged out successfully",
                { username }
            )
        )
    } catch (error) {
        next(new ApiError(400, "Error while logout" , error))
    }
})


export default logoutController