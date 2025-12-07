import { Client } from '@elastic/elasticsearch';
import { NextResponse } from 'next/server';
import { markFailure, markSuccess } from '../../../lib/metrics';

export async function GET() {
    // Decode the base64 CA cert
    const caCert = process.env.ELASTICSEARCH_CA_CRT_BASE64
        ? Buffer.from(process.env.ELASTICSEARCH_CA_CRT_BASE64, 'base64').toString('utf-8')
        : undefined;

    let client;
    let clientConfig;
    try {
        clientConfig = {
            node: `http${process.env.ELASTICSEARCH_SECURE === 'true' ? 's' : ''}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
            auth: {
                username: process.env.ELASTICSEARCH_USER!,
                password: process.env.ELASTICSEARCH_PASSWORD!
            },
            tls: {
                ca: caCert
            }
        };
        client = new Client(clientConfig);
    } catch (initError) {
        return NextResponse.json({
            message: 'Failed to initialize Elasticsearch client',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }

    try {
        const result = await client.info();
        markSuccess('/api/elastictest');
        return NextResponse.json({
            message: 'Elasticsearch connection successful!',
            dbResult: result,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        markFailure('/api/elastictest');
        return NextResponse.json({
            message: 'Elasticsearch connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
