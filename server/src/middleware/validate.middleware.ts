import { Request, Response, NextFunction } from 'express';
import { success, ZodError, z } from 'zod';

//the function validate(schema,query) , if true it will parse query and params in req
//if false it will parse body and params in req
export const validate = <T extends z.ZodType>(schemaType: T, query: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = query
        ? { query: req.query, params: req.params }
        : { body: req.body, params: req.params };

      const validated = (await schemaType.parseAsync(dataToValidate)) as any;

      if (validated.body) req.body = validated.body;
      if (validated.query) req.query = validated.query;
      if (validated.params) req.params = validated.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        //creating a record of error
        //normalizing error
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          formattedErrors[path] = issue.message;
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            type: 'validation error',
            message: 'please fix the following error',
            details: formattedErrors,
          },
        });
      }

      //which means there is some kind of error in the server itself
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};
