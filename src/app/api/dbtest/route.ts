import { NextResponse } from 'next/server';
import { Client } from 'pg';
import { markFailure, markSuccess } from '../../../lib/metrics';

export async function GET() {
    // Read DB connection info from environment variables
    const client = new Client({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
        database: process.env.POSTGRES_DB || process.env.POSTGRES_DATABASE || process.env.POSTGRES_USER,
    });

    try {
        await client.connect();
        // Simple query to test DB connection
        const result = await client.query('SELECT 1 as ok');
        await client.end();
        markSuccess('/api/dbtest');
        return NextResponse.json({
            message: 'Database connection successful!',
            dbResult: result.rows,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        markFailure('/api/dbtest');
        return NextResponse.json({
            message: 'Database connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
