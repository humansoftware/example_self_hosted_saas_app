import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';

export async function GET() {
    const client = new Client({
        node: `http${process.env.ELASTICSEARCH_SECURE === 'true' ? 's' : ''}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
        auth: {
            username: process.env.ELASTICSEARCH_USER!,
            password: process.env.ELASTICSEARCH_PASSWORD!
        }
    });

    try {
        const result = await client.info();
        return NextResponse.json({
            message: 'Elasticsearch connection successful!',
            dbResult: result,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            message: 'Elasticsearch connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
