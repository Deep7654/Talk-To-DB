import { Request, Response , NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { generateAccessToken , generateRefreshToken } from "../../services/user/auth.service.js";
import validateToken from "../../services/user/validateToken.service.js";
import { User } from "../../db/models/user.model.js";
import {z} from "zod";

const isRefreshTokenValidSchema = z.object({
    id : z.string(),
    email : z.string(),
    tokenVersion : z.number(),
    iat: z.number(),        // used for rotation
    exp: z.number().optional(), // optional, but nice 
}).passthrough()

const refreshTokenController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        
        if(!refreshToken){
            return res.status(401).json(
                new ApiResponse(false , 401 , "Unauthorized-relogin-refresh token is required" , {
                  message :"Refresh token is required or relogin again",
                  username : req.body.username
                })
              )
        }
        const decodedToken = validateToken(refreshToken , isRefreshTokenValidSchema)

        const user = await User.findById(decodedToken.id)

        if(!user){
            return res.status(401).json(
                new ApiResponse(false , 401 , "Unauthorized relogin refresh token is not valid " , {
                  message :"User not found or Deleted",
                  user_email : decodedToken.email
                })
              )
        }

        //check if refresh token is valid or not like not logout from all devices
        if(decodedToken.tokenVersion !== user.tokenVersion){
            return res.status(401).json(
                new ApiResponse(false , 401 , "Unauthorized-relogin-refreshTokenExpired or logout from all devices" , {
                  message :"Refresh token is not valid relogin again",
                  username : req.body.username
                })
              )
        }

        const newAccessToken = generateAccessToken(user.email, user._id);

        const REFRESH_ROTATION_WINDOW = 4 * 24 * 60 * 60 * 1000; // 4 days
        const tokenAgeMs = Date.now() - decodedToken.iat * 1000;
        let newRefreshToken = user.refreshToken;
        // save refresh token in database 
        if (tokenAgeMs > REFRESH_ROTATION_WINDOW) {
            newRefreshToken = generateRefreshToken(user.email, user._id, user.tokenVersion );
            user.refreshToken = newRefreshToken;
            try{
                await user.save();
            }catch(dbError : any ){
                return next(new ApiError(400, "Error while saving refresh token" , dbError))
            }
        }

        const isProd = process.env.NODE_ENV === "production"
        // every time set the refresh token in cookie 
        res.cookie("refreshToken" , newRefreshToken , {
            httpOnly : true,
            secure : isProd,
            sameSite : "lax",
            path : "/api/user/refresh",
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        res.cookie("accessToken" , newAccessToken , {
            httpOnly : true,
            secure : isProd,
            sameSite : "lax",
            path : "/",
            maxAge : 1 * 60 * 60 * 1000
        })
      const users = 1;
        res.status(200).json(
            new ApiResponse(
                true,
                200,
                "Access token generated successfully",
                {
                    username: user.username,
                    email: user.email,
                    accessToken : newAccessToken
                }
            )
        );
    } catch (error : any) {
        if (error.name === "TokenExpiredError") {
              console.log("Token Expired" , error)
              return next(new ApiError(401, "JWT_EXPIRED", error));
            }
            
            if (error.name === "JsonWebTokenError") {
              console.log("Token Invalid" , error)
              return next(new ApiError(401, "JWT_INVALID", error));
            }
        next(new ApiError(400, "Error while refreshing Ac token"))
    }
})

export default refreshTokenController