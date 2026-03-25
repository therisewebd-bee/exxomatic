import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

/**
 * Functional Validation Middleware
 * Populates req.validated with the parsed result of the schema.
 * Merges with existing validated data if multiple schemas are used.
 */
export const validate = <T extends z.ZodType>(schema: T, isQuery: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = isQuery
        ? { query: req.query, params: req.params }
        : { body: req.body, params: req.params };

      const validatedData = await schema.parseAsync(dataToValidate);

      // Merge with existing validated data to support multiple validation steps (e.g. params + body)
      if (!(req as any).validated) {
        (req as any).validated = {};
      }
      
      Object.assign((req as any).validated, validatedData);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
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
            details: formattedErrors,
          },
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};
