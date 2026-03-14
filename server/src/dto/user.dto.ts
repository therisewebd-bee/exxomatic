import { email, z } from "zod";


const nameSchema = z.string().min(2, "Name must be at lest 2 char long").
    max(50, "Name must be max 50 char length")


const passwordSchema = z.string().min(8, "password must be 8 characcters long").
    max(80, "password must be 80 char long").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );

const roleSchema= z.enum(["Admin","Customer"]);


// main schema which is gonna used in controler and sql query    
const createAccountSchema = z.object({
    name: nameSchema,
    email:z.email(),
    password:passwordSchema,
    role:roleSchema.optional().default('Customer')
})


