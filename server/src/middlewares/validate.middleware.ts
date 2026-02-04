
import { ZodSchema } from "zod";
import ApiError from "../utils/apiError.js";
import {Request, Response , NextFunction } from "express";

const validate = (schema: ZodSchema ) => (req: Request, res: Response, next: NextFunction) => {
    try { 
        schema.safeParse(req.body);   
    next();
    } catch (error) {
        next(new ApiError(
            400 , 
            "Input Validation Error by Zod Schema"
        ));
    }
}

export default validate;