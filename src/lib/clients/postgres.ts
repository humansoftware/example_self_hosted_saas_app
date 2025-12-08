import { Pool } from 'pg';

let cachedPool: Pool | null = null;

export function createPgClient(): Pool {
    if (cachedPool) return cachedPool;
    cachedPool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
        database: process.env.POSTGRES_DB || process.env.POSTGRES_DATABASE || process.env.POSTGRES_USER,
    });
    return cachedPool;
}

export default createPgClient;
