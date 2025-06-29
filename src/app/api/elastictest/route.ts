import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';

export async function GET() {
    let caCert: string | undefined;
    try {
        caCert = fs.readFileSync('/etc/ssl/certs/elasticsearch-ca.crt', 'utf8');
    } catch (error) {
        console.error('Failed to read CA certificate:', error);
    }

    const client = new Client({
        node: `http${process.env.ELASTICSEARCH_SECURE === 'true' ? 's' : ''}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
        auth: {
            username: process.env.ELASTICSEARCH_USER!,
            password: process.env.ELASTICSEARCH_PASSWORD!
        },
        tls: {
            ca: caCert
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
