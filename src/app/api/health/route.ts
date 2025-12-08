import { NextResponse } from 'next/server';
import { probeCassandra, probeDb, probeEs } from '../../../lib/probes';

export async function GET() {
    try {
        // Run all probes in parallel, but with per-probe timeouts inside each probe
        const [dbRes, esRes, cassRes] = await Promise.all([probeDb(), probeEs(), probeCassandra()]);
        const allOk = dbRes && esRes && cassRes;
        if (allOk) {
            return NextResponse.json({ status: 'ok', db: dbRes, es: esRes, cassandra: cassRes }, { status: 200 });
        }
        return NextResponse.json({ status: 'degraded', db: dbRes, es: esRes, cassandra: cassRes }, { status: 500 });
    } catch (e) {
        return NextResponse.json({ status: 'error', error: String(e) }, { status: 500 });
    }
}
