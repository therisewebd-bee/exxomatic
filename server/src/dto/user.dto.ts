import { z } from "zod";


const nameSchema = z.string().min(2, "Name must be at lest 2 char long").
    max(50, "Name must be max 50 char length")


const passwordSchema = z.string().min(8, "password must be 8 characcters long").
    max(80, "password must be 80 char long").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );

const roleSchema = z.enum(["Admin", "Customer"]);


// main schema which is gonna used in controler and sql query    
export const createAccountSchema = z.object({
    body: z.object({
        name: nameSchema,
        email: z.email(),
        password: passwordSchema,
        role: roleSchema.optional().default('Customer')
    })
})


export const loginAccountSchema = z.object({
    body: z.object({
        email: z.email(),
        password: passwordSchema
    })
})


export const updateUserSchema = z.object({
    body: z.object({
        name: nameSchema.optional(),
        role: roleSchema.optional()
    })
})


export const findUserQuerySchema = z.object({
    query: z.object({
        email: z.email().optional(),
        role: roleSchema.optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(100).optional()
    })
})

export const userIdParamSchema = z.object({
    params: z.object({
        userId: z.uuid('Invalid user ID format'),
    }),
});

// Export types
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type LoginAccountInput = z.infer<typeof loginAccountSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FindUserQueryInput = z.infer<typeof findUserQuerySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;