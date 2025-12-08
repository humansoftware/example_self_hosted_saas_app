import { markFailure, markSuccess } from '../lib/metrics';
import createCassandraClient from './clients/cassandra';
import createEsClient from './clients/elasticsearch';
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

export async function probeEs(): Promise<boolean> {
    try {
        const client = createEsClient();
        await withTimeout(client.info(), PROBE_TIMEOUT_MS);
        markSuccess('es');
        return true;
    } catch (e) {
        markFailure('es');
        return false;
    }
}

export async function probeCassandra(): Promise<boolean> {
    const client = createCassandraClient();
    try {
        await withTimeout(client.execute('SELECT now() FROM system.local'), PROBE_TIMEOUT_MS);
        markSuccess('cassandra');
        return true;
    } catch (e) {
        markFailure('cassandra');
        return false;
    }
}

export default { probeDb, probeEs, probeCassandra };
