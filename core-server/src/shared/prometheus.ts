import client from 'prom-client';

const register = new client.Registry();
register.setDefaultLabels({ app: 'order-payment-server' });

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000], // adjust as needed
});

register.registerMetric(httpRequestDuration);

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestCounter);

export { register, httpRequestDuration, httpRequestCounter };
