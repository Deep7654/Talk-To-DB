import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError.js";

//api rate limiter middleware for limiting requests from same IP to prevent DDoS attacks
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 *  1000, // 10 minute
  max: 20,               // 100 requests
  standardHeaders: true,
  legacyHeaders: false,

  handler : (req :Request , res : Response , next : NextFunction , options : any ) => {
    throw new ApiError(429 , "Too many requests , please try again later");
  }
});


/*
handler: (req, res, next, options) => {
    const message = `${options.message} (Limit: ${options.max} requests per 15 mins)`;
    
    // Passing the dynamic message to your custom ApiError
    next(new ApiError(options.statusCode, message));
}
    */

