import { NextResponse } from 'next/server';
import { probeEs } from '../../../lib/probes';

export async function GET() {
    try {
        const ok = await probeEs();
        if (ok) {
            return NextResponse.json({
                message: 'Elasticsearch connection successful!',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        }
        return NextResponse.json({
            message: 'Elasticsearch connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } catch (error: any) {
        return NextResponse.json({
            message: 'Elasticsearch connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
