import { Request, Response, NextFunction } from "express"
import { success, ZodError, ZodTypeAny, z } from "zod"



//the function validate(schema,ture) , if ture it will prase body in req
//if false it will parse params in req.params
export const validate = <T extends ZodTypeAny>(schemaType: T, query: boolean = false) => {
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = query ? { query: req.query, params: req.params } :
                { body: req.body, params: req.params }

            const validated = (await schemaType.parseAsync(dataToValidate)) as z.infer<T>;
            if (query && (validated as any).query) req.query = (validated as any).query as any;

            (req as any).body = validated;

            return next();
        }
        catch (error) {
        }
        //which means thier is some kind of in the server it'self 
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
