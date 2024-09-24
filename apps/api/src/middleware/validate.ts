import { Request, Response, NextFunction, response } from "express";
import { ZodSchema } from "zod";

export const validate = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next:NextFunction) => {
    const result = schema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({success: false, error: result.error.errors})
    }
    next()
}