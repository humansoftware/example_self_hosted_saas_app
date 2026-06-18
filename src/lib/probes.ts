import { markFailure, markSuccess } from '../lib/metrics';
import createPgClient from './clients/postgres';

const PROBE_TIMEOUT_MS = 5000;

async function withTimeout<T>(p: Promise<T>, ms: number) {
    return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

export async function probeDb(): Promise<boolean> {
    const pool = createPgClient();
    try {
        await withTimeout(pool.query('SELECT 1'), PROBE_TIMEOUT_MS);
        markSuccess('db');
        return true;
    } catch (e) {
        markFailure('db');
        return false;
    }
}

export default { probeDb };
