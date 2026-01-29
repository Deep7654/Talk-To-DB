import { Request } from "express";


const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next))
    .catch((error: any) => {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        next(error);
    });
}


export default asyncHandler;




/**
 * asyncHandler
 *
 * A tiny helper that wraps Express route handlers (or middleware) that
 * return promises / are async functions. Instead of having to write
 * try/catch in every route, wrap the async function with `asyncHandler`
 * and any rejected promise will be caught and forwarded.
 *
 * How it works:
 * - It returns a function with the Express signature `(req, res, next)`.
 * - It calls `Promise.resolve(fn(req, res, next))` so that both plain
 *   synchronous handlers and async functions (which return promises)
 *   are handled uniformly.
 * - If the wrapped function throws or its returned promise rejects,
 *   the `.catch()` runs: the error is logged, a 500 JSON response is
 *   sent, and `next(error)` is called to forward the error to Express'
 *   error-handling middleware for any additional processing.
 *
 * Usage example:
 *   app.get('/route', asyncHandler(async (req, res) => {
 *     const data = await someAsyncWork();
 *     res.json(data);
 *   }));
 *
 * Notes:
 * - The current implementation both sends a 500 response and calls
 *   `next(error)`. If your error-handling middleware also sends a
 *   response, you should ensure it checks `res.headersSent` to avoid
 *   double responses.
 */

