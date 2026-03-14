import {PrismaClient} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

//creating a single re-useable connection/adapter
const adapter=new PrismaPg({
    connectionString:process.env.DATABASE_URL!,
});

export const prismaAdapter=new PrismaClient({adapter});