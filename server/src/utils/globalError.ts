import { Request , Response , NextFunction } from "express";

/**
 * Global Error Handler Middleware
 * 
 * This middleware function catches and handles all errors that occur during request processing.
 * It logs the error to the console and sends a standardized error response to the client.
 * 
 * @param error - The error object that was caught (can be any type)
 * @param req - Express Request object
 * @param res - Express Response object used to send the error response
 * @param next - Express NextFunction for passing control to the next middleware
 * @returns Promise<void>
 */
const globalError =  (error:any ,req: Request, res: Response, next: NextFunction) : void => {
        
        // Log error header message to console
        console.error("Globale Error Handler:"); 
        // Log the actual error object for debugging purposes
        console.error(error)
        
        // Send HTTP 500 (Internal Server Error) response with JSON payload
        res.status(500)
            .json(
                {
                    // Indicates the request failed
                    success: false,
                    // Extract error message if it's an Error object, otherwise use generic message
                    message: error instanceof Error ? error.message : "Internal Server Error",
                    // Status code for the response
                    statuscode : 400,
                    // No data to return on error
                    data: null
                }
            );
        // Pass error to next middleware (if any)
        next(error);
        
}
export default globalError;