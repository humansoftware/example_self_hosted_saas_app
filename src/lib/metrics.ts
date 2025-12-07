import client from 'prom-client';

// Create a dedicated registry so we don't interfere with other Node metrics
export const register = new client.Registry();

// Collect default Node.js process metrics
client.collectDefaultMetrics({ register });

// Gauge that indicates current up/down for each endpoint (1 = up, 0 = down)
export const endpointUp = new client.Gauge({
    name: 'example_app_probe_up',
    help: 'Probe success (1 = up, 0 = down) for application endpoints',
    labelNames: ['endpoint'],
    registers: [register],
});

// Counter for total probes with result label
export const endpointProbes = new client.Counter({
    name: 'example_app_probe_total',
    help: 'Total number of probes for application endpoints',
    labelNames: ['endpoint', 'result'],
    registers: [register],
});

export function markSuccess(endpoint: string) {
    try {
        endpointUp.labels(endpoint).set(1);
        endpointProbes.labels(endpoint, 'success').inc();
    } catch (e) {
        // ignore metric errors
    }
}

export function markFailure(endpoint: string) {
    try {
        endpointUp.labels(endpoint).set(0);
        endpointProbes.labels(endpoint, 'failure').inc();
    } catch (e) {
        // ignore metric errors
    }
}

export default register;
