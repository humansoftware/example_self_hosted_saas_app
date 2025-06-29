import { NextResponse } from 'next/server';
import cassandra from 'cassandra-driver';

export async function GET() {
    const client = new cassandra.Client({
        contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
        localDataCenter: 'datacenter1',
        credentials: {
            username: process.env.CASSANDRA_USER!,
            password: process.env.CASSANDRA_PASSWORD!
        },
        keyspace: process.env.CASSANDRA_KEYSPACE
    });

    try {
        await client.connect();
        const result = await client.execute('SELECT * FROM system.local');
        await client.shutdown();
        return NextResponse.json({
            message: 'Cassandra connection successful!',
            dbResult: result.rows,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            message: 'Cassandra connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
