import { Request, Response, NextFunction } from "express"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import validateToken from "../services/user/validateToken.service.js"
import { z } from "zod"
import { User } from "../db/models/user.model.js"


const accessTokenSchema = z.object({
  id: z.string(),
 email :  z.string(),
}).passthrough()

const authMiddleware = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

  const authToken = req.cookies.accessToken || req.header("Authorization")
  if (!authToken) {
    return next(new ApiError(401, "Unauthorized", {
      username: req.body?.username,
      message: "No access token provided"
    }))
  }

  if (!authToken.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized", {
      username: req.body?.username,
      message: "Invalid access token provided"
    }))
  }
  try {
    const accessToken = authToken.split("Bearer ")[1]
    console.log("Access token : ", accessToken)

    const decodedToken = validateToken(accessToken, accessTokenSchema)
    console.log("Decoded token : ", decodedToken)

    // Fetch user from database
    let user 
    try{
      user = await User.findById(decodedToken.id)
    }
    catch(error){
      return next(new ApiError(401, "db Error", {
        username: req.body?.username,
        message: "Error while fetching user from db"
      }))
    }

    // Check if user exists
    if(!user){
      return next(new ApiError(401, "Unauthorized", {
        username: decodedToken.username,
        message: "User not found"
      }))
    }

    req.user = user
    
    next()
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "JWT_EXPIRED", error));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "JWT_INVALID", error));
    }

    if(error.name === "ZodError"){
      return next(new ApiError(401, "ZOD_INVALID", error));
    }
    // Fallback for Zod parsing errors or other issues
    next(new ApiError(401, error.message || "Unauthorized", error));
  }
})

export default authMiddleware



