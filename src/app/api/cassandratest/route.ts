import { probeCassandra } from '../../../lib/probes';
import { jsonResponse } from '../../../lib/response';

export async function GET() {
    try {
        const ok = await probeCassandra();
        if (ok) {
            return jsonResponse({
                message: 'Cassandra connection successful!',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        }
        return jsonResponse({
            message: 'Cassandra connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } catch (error: any) {
        return jsonResponse({
            message: 'Cassandra connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
