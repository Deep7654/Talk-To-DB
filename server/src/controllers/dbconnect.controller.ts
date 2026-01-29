import asyncHandler from "../utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";


const dbConnectController = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        res.status(200).json(
            new ApiResponse(
                true,
                200,
                "success for login",
                { username }
            )
        )
    } catch (error) {
        next(new ApiError(400, "Error while logout"))
    }
})  

const neonController = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        console.log("LogoutSuccessfully");

        res.status(200).json(
            new ApiResponse(
                true,
                200,
                "success for logout",
                { username }
            )
        )
    } catch (error) {
        next(new ApiError(400, "Error while logout"))
    }
})


export {dbConnectController};