import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { userExists } from "../services/user/index.service.js";
import { checkPassword } from "../services/user/login.service.js";
import bcryptjs from "bcryptjs";
import { User } from "../db/models/user.model.js";


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
            const hashPassword = user.password
            const validPassword = await checkPassword(password, user.password)

            if (!validPassword) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "invalid pass")
                )
            }

            console.log(user);

            res.status(200).json(
                new ApiResponse(
                    true,
                    200,
                    "Login Successful",
                    { username: user.username, email: user.email }
                )
            );

        } catch (error) {
            console.error("Login Error:", error);
            next(
                new ApiError(500, "Internal Server Error while login")
            );
        }
    });

const logoutController = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        console.log("LogoutSuccessfully");

        res.status(200).json(
            new ApiResponse(
                true,
                200,
                "User logged out successfully",
                { username }
            )
        )
    } catch (error) {
        next(new ApiError(400, "Error while logout"))
    }
})


const signupController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Signup logic herec
        try {
            const { username, password, email } = req.body


            // check user already exist or not 
            const user = await userExists(username);

            //if exists then tell to login 
            if (user) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "user Already Exist please login")
                )
            }

            // create new user 

            //  first hash password
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password, salt)

            // save to database
            const newUser = new User({
                username,
               // name,
                email,
                // number ,
                password: hashedPassword
            })

            const savedUser = await newUser.save()
            console.log(`saved the new USer : ${savedUser}`)

            //return the resPosne to frontend about savedUSer
            res.status(200).json(
                new ApiResponse(true, 200, "User Saved Succesfully", savedUser)
            )



        } catch (error) {
            next(
                new ApiError(400, "Error while User Signup")
            )
        }
    })

    const getNumberController = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user : any = req.user

                // check user number is available or not
                if(!user.number){
                    return res.status(401).json(
                        new ApiResponse(false, 401, "User Number Not Found")
                    )
                }
                // return the number to frontend
                res.status(200).json(
                    new ApiResponse(true, 200, "User Number", {"number"  :  user?.number})
                )
            } catch (error) {
                next(
                    new ApiError(400, "Error while User Signup")
                )
            }
        })

export { loginController, logoutController, signupController , getNumberController };