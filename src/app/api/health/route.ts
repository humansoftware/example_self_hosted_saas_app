import { probeDb } from '../../../lib/probes';
import { jsonResponse } from '../../../lib/response';

export async function GET() {
    try {
        const dbRes = await probeDb();
        if (dbRes) {
            return jsonResponse({ status: 'ok', db: dbRes }, { status: 200 });
        }
        return jsonResponse({ status: 'degraded', db: dbRes }, { status: 500 });
    } catch (e) {
        return jsonResponse({ status: 'error', error: String(e) }, { status: 500 });
    }
}
