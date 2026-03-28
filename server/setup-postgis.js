import pg from 'pg';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const run = async () => {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL.');
        await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        console.log('Successfully created/verified PostGIS extension.');
    } catch (e) {
        console.error('Failed to run PostGIS setup:', e);
    } finally {
        await client.end();
    }
};

run();
