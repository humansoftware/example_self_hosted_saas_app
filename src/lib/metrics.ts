import client from 'prom-client';

// Create a dedicated registry so we don't interfere with other Node metrics
export const register = new client.Registry();

// Collect default Node.js process metrics
client.collectDefaultMetrics({ register });

// Gauge that indicates current up/down for each endpoint (1 = up, 0 = down)
export const appMetricUp = new client.Gauge({
    name: 'example_app_probe_up',
    help: 'Probe success (1 = up, 0 = down) for application endpoints',
    labelNames: ['app_metric'],
    registers: [register],
});

// Counter for total probes with result label
export const appMetricProbes = new client.Counter({
    name: 'example_app_probe_total',
    help: 'Total number of probes for application endpoints',
    labelNames: ['app_metric', 'result'],
    registers: [register],
});

export function markSuccess(appMetric: string) {
    try {
        appMetricUp.labels({ app_metric: appMetric }).set(1);
        appMetricProbes.labels({ app_metric: appMetric, result: 'success' }).inc();
    } catch (e) {
        // ignore metric errors
    }
}

export function markFailure(appMetric: string) {
    try {
        appMetricUp.labels({ app_metric: appMetric }).set(0);
        appMetricProbes.labels({ app_metric: appMetric, result: 'failure' }).inc();
    } catch (e) {
        // ignore metric errors
    }
}

export default register;
