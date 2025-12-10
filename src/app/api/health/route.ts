import { probeCassandra, probeDb, probeEs } from '../../../lib/probes';
import { jsonResponse } from '../../../lib/response';

export async function GET() {
    try {
        // Run all probes in parallel, but with per-probe timeouts inside each probe
        const [dbRes, esRes, cassRes] = await Promise.all([probeDb(), probeEs(), probeCassandra()]);
        const allOk = dbRes && esRes && cassRes;
        if (allOk) {
            return jsonResponse({ status: 'ok', db: dbRes, es: esRes, cassandra: cassRes }, { status: 200 });
        }
        return jsonResponse({ status: 'degraded', db: dbRes, es: esRes, cassandra: cassRes }, { status: 500 });
    } catch (e) {
        return jsonResponse({ status: 'error', error: String(e) }, { status: 500 });
    }
}
