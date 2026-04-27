import type { Request, Response, NextFunction } from "express";
import { AppError } from "../helper/app_error_helper.js";
import { baseResponse } from "../helper/response_helper.js";

function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(baseResponse(err.message, err.error, null));
    }
    
    console.log(err)
    return res.status(500).json(baseResponse("Internal Server Error", null, null));
}

export {
    errorMiddleware
}