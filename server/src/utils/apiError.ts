interface IApiError{
    statusCode: number;
    data: any;
    success: boolean;
    stack ? : string
}

export default class ApiError extends Error implements IApiError {
    statusCode: number;
    data: any;
    success: boolean;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        stack?: string
    ) {
        super(message);
        this.success = false;
        this.data = null;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


