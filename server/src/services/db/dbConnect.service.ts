import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import { User } from "../../db/models/user.model.js";
import ApiResponse from "../../utils/apiResponse.js";
import postgres from "postgres"

const userDbConnect = asyncHandler(async(req:Request , res : Response , next : NextFunction)=>{
        const {query} = req.body
        if(!query){
            
        }
})