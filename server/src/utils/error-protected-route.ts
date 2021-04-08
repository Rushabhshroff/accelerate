import { NextFunction, Request, Response } from "express";

export default function ErrorProtectedRoute(fn: (req: Request, res: Response,next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        (async () => {
            await fn(req, res,next)
        })().catch(next)
    }
}