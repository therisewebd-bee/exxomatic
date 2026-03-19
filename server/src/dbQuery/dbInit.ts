import dotenv from 'dotenv';
dotenv.config();

// Aiven uses self-signed SSL certs — must be set before any pg connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool as any);

export const prismaAdapter = new PrismaClient({ adapter });
