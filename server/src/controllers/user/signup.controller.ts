import { Request, Response , NextFunction } from "express";
import { userExists } from "../../services/user/index.service.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { hashPassword } from "../../services/user/auth.service.js";
import { User } from "../../db/models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";



const signupController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Signup logic herec
        try {
            const { username, password, email , number } = req.body

            // check user already exist or not 
            const oldUser = await userExists(username);

            //if exists then tell to login 
            if (oldUser) {
                return res.status(401).json(
                    new ApiResponse(false, 401, "user Already Exist please login")
                )
            }

            //  first hash password
            const hashedPassword = await hashPassword(password)

            // save User to database
            const newUser = new User({
                username,
                email,
                number ,
                password: hashedPassword
            })

            const savedUser = await newUser.save()
            console.log(`saved the new USer : ${savedUser}`)

            const payload = {
                username: savedUser.username,
                email: savedUser.email,
                id: savedUser._id
            }
            const verifyToken = jwt.sign(payload, process.env.JWT_SECRET!, {
                expiresIn: "1d"
            })

            const verifyUrl = `http://localhost:${process.env.PORT}/api/user/verify?token=${verifyToken}`

            //return the resPosne to frontend about savedUSer
            res.status(200).json(
                new ApiResponse(true, 200, "User Saved Succesfully", { savedUser, verifyUrl })
            )

        } catch (error) {
            next(
                new ApiError(400, "Error while User Signup")
            )
        }
    })


    export default signupController