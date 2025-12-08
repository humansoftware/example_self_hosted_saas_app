import { NextResponse } from 'next/server';
import { probeCassandra } from '../../../lib/probes';

export async function GET() {
    try {
        const ok = await probeCassandra();
        if (ok) {
            return NextResponse.json({
                message: 'Cassandra connection successful!',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        }
        return NextResponse.json({
            message: 'Cassandra connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } catch (error: any) {
        return NextResponse.json({
            message: 'Cassandra connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
