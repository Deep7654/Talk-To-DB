import {Request , Response , NextFunction} from "express"
import asyncHandler from "../utils/asyncHandler.js"



const authMiddleware  = asyncHandler((req : Request, res : Response, next : NextFunction)=>{
        try{
          console.log("Auth middleware")
          next()
        }catch(error){
          console.log(error)
          next(error)
        }
}) 

export default authMiddleware



