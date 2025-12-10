import { probeDb } from '../../../lib/probes';
import { jsonResponse } from '../../../lib/response';

export async function GET() {
    try {
        const ok = await probeDb();
        if (ok) {
            return jsonResponse({
                message: 'Database connection successful!',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        }
        return jsonResponse({
            message: 'Database connection failed',
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    } catch (error: any) {
        return jsonResponse({
            message: 'Database connection failed',
            error: error && (error.stack || JSON.stringify(error)),
            status: 'error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
