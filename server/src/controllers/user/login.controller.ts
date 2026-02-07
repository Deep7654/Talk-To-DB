import asyncHandler from "../../utils/asyncHandler.js";
import { Request, Response , NextFunction } from "express";
import { userExists } from "../../services/user/index.service.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { comparePassword , generateAccessToken , generateRefreshToken } from "../../services/user/auth.service.js";



const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { username, password } = req.body;
            console.log(username)

            //check the user already exist or not
            const user = await userExists(username);
            console.log(user)

            if (!user) {
                return res.status(401).json(
                    new ApiResponse(
                        false,
                        401,
                        "User does not exist",
                        { username } // or real user data later
                    )
                );
            }
            
            // check the password is valid or not 
            const validPassword = await comparePassword(password, user.password)

            if (!validPassword) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "invalid password please try again")
                )
            }
            
            // check the user is verified or not 
            if (!user.isVerified) {
                return res.status(403).json(
                    new ApiResponse(false, 403, "User is not verified")
                );
            }

            const accessToken = generateAccessToken(user.email, user._id);
            const refreshToken = generateRefreshToken(user.email, user._id, user.tokenVersion );
            
            // save refresh token in database 
            user.refreshToken = refreshToken;
            await user.save();

            const isProd = process.env.NODE_ENV === "production"

            res.cookie("refreshToken" , refreshToken , {
                httpOnly : true,
                secure : isProd,
                sameSite : "lax",
                maxAge : 7 * 24 * 60 * 60 * 1000,
                path : "/api/user/refresh-token"
            })
            
            res.cookie("accessToken" , accessToken , {
                httpOnly : true,
                secure : isProd,
                sameSite : "lax",
                maxAge :  1 * 60 * 60 * 1000
            })
            res.status(200).json(
                new ApiResponse(
                    true,
                    200,
                    "Login Successful",
                    {
                        username: user.username,
                        email: user.email,
                        accessToken
                    }
                )
            );

        } catch (error) {
            console.error("Login Error:", error);
            next(
                new ApiError(500, "Internal Server Error while login")
            );
        }
    });

    export default loginController