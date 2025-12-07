import cassandra from 'cassandra-driver';
import { NextResponse } from 'next/server';
import { markFailure, markSuccess } from '../../../lib/metrics';

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
        const result = await client.execute('SELECT cluster_name, release_version, cql_version FROM system.local');
        await client.shutdown();
        markSuccess('/api/cassandratest');
        return NextResponse.json({
            message: 'Cassandra connection successful!',
            clusterName: result.rows[0].cluster_name,
            cassandraVersion: result.rows[0].release_version,
            cqlVersion: result.rows[0].cql_version,
            status: 'success',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        markFailure('/api/cassandratest');
        return NextResponse.json({
            message: 'Cassandra connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
