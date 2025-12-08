import { Client as ESClient } from '@elastic/elasticsearch';

let cachedEsClient: ESClient | null = null;

export function createEsClient(): ESClient {
    if (cachedEsClient) return cachedEsClient;

    const caCert = process.env.ELASTICSEARCH_CA_CRT_BASE64
        ? Buffer.from(process.env.ELASTICSEARCH_CA_CRT_BASE64, 'base64').toString('utf-8')
        : undefined;

    cachedEsClient = new ESClient({
        node: `http${process.env.ELASTICSEARCH_SECURE === 'true' ? 's' : ''}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
        auth: {
            username: process.env.ELASTICSEARCH_USER || '',
            password: process.env.ELASTICSEARCH_PASSWORD || '',
        },
        tls: { ca: caCert },
    });

    return cachedEsClient;
}

export default createEsClient;
