import { Client } from '@elastic/elasticsearch';
import { NextResponse } from 'next/server';

export async function GET() {
    // Debug: log all relevant environment variables and their lengths
    const debugInfo = {
        ELASTICSEARCH_SECURE: process.env.ELASTICSEARCH_SECURE,
        ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST,
        ELASTICSEARCH_PORT: process.env.ELASTICSEARCH_PORT,
        ELASTICSEARCH_USER: process.env.ELASTICSEARCH_USER,
        ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD ? '***' : undefined,
        ELASTICSEARCH_CA_CRT_length: process.env.ELASTICSEARCH_CA_CRT?.length,
        ELASTICSEARCH_CA_CRT_start: process.env.ELASTICSEARCH_CA_CRT?.slice(0, 40),
        ELASTICSEARCH_CA_CRT_end: process.env.ELASTICSEARCH_CA_CRT?.slice(-40),
    };

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
                ca: process.env.ELASTICSEARCH_CA_CRT
            }
        };
        // Debug: log the client config (mask password)
        const safeConfig = { ...clientConfig, auth: { ...clientConfig.auth, password: '***' } };
        console.log('Elasticsearch client config:', safeConfig);
        client = new Client(clientConfig);
    } catch (initError) {
        return NextResponse.json({
            message: 'Failed to initialize Elasticsearch client',
            debugInfo,
            error: initError && (initError.stack || JSON.stringify(initError)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }

    try {
        const result = await client.info();
        return NextResponse.json({
            message: 'Elasticsearch connection successful!',
            dbResult: result,
            debugInfo,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            message: 'Elasticsearch connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            debugInfo,
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
