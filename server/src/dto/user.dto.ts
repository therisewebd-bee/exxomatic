import {z} from "zod";


const nameSchema=z.string().min(2,"Name must be at lest 2 char long").
    max(50,"Name must be max 50 char length")


const createAccountSchema=z.object({
    name:nameSchema,
    
})