import { probeEs } from '../../../lib/probes';
import { jsonResponse } from '../../../lib/response';

export async function GET() {
    try {
        const ok = await probeEs();
        if (ok) {
            return jsonResponse({
                message: 'Elasticsearch connection successful!',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        }
        return jsonResponse({
            message: 'Elasticsearch connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } catch (error: any) {
        return jsonResponse({
            message: 'Elasticsearch connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
