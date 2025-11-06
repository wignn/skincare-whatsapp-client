// src/metrics.ts
import express from 'express';
import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics for WhatsApp client
const whatsappConnectedGauge = new promClient.Gauge({
  name: 'whatsapp_connected',
  help: 'WhatsApp connection status (1 = connected, 0 = disconnected)',
  registers: [register]
});

const whatsappMessagesReceivedCounter = new promClient.Counter({
  name: 'whatsapp_messages_received_total',
  help: 'Total number of WhatsApp messages received',
  labelNames: ['type'], // individual, group
  registers: [register]
});

const whatsappMessagesSentCounter = new promClient.Counter({
  name: 'whatsapp_messages_sent_total',
  help: 'Total number of WhatsApp messages sent',
  labelNames: ['type', 'status'], // status: success, failed
  registers: [register]
});

const whatsappSessionsGauge = new promClient.Gauge({
  name: 'whatsapp_active_sessions',
  help: 'Number of active WhatsApp sessions',
  registers: [register]
});

const whatsappQrGeneratedCounter = new promClient.Counter({
  name: 'whatsapp_qr_generated_total',
  help: 'Total number of QR codes generated',
  registers: [register]
});

const whatsappErrorCounter = new promClient.Counter({
  name: 'whatsapp_errors_total',
  help: 'Total number of WhatsApp errors',
  labelNames: ['error_type'],
  registers: [register]
});

const databaseQueriesHistogram = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['query_type'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register]
});

// Export metrics and functions
export {
  register,
  whatsappConnectedGauge,
  whatsappMessagesReceivedCounter,
  whatsappMessagesSentCounter,
  whatsappSessionsGauge,
  whatsappQrGeneratedCounter,
  whatsappErrorCounter,
  databaseQueriesHistogram
};

// Metrics endpoint middleware
export function metricsEndpoint() {
  const router = express.Router();

  router.get('/metrics', async (_, res) => {
    try {
      res.set('Content-Type', register.contentType);
      const metrics = await register.metrics();
      res.end(metrics);
    } catch (error) {
      res.status(500).end(error);
    }
  });

  router.get('/health', (_, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    });
  });

  router.get('/ready', (_, res) => {
    // Check if service is ready to accept traffic
    // You can add database connection check here
    res.json({ status: 'ready' });
  });

  router.get('/alive', (_, res) => {
    res.json({ status: 'alive' });
  });

  return router;
}

// Helper functions to update metrics
export function updateWhatsappConnectionStatus(connected: boolean) {
  whatsappConnectedGauge.set(connected ? 1 : 0);
}

export function incrementMessagesReceived(type: 'individual' | 'group') {
  whatsappMessagesReceivedCounter.inc({ type });
}

export function incrementMessagesSent(type: string, status: 'success' | 'failed') {
  whatsappMessagesSentCounter.inc({ type, status });
}

export function setActiveSessions(count: number) {
  whatsappSessionsGauge.set(count);
}

export function incrementQrGenerated() {
  whatsappQrGeneratedCounter.inc();
}

export function incrementErrors(errorType: string) {
  whatsappErrorCounter.inc({ error_type: errorType });
}

export function observeDatabaseQuery(queryType: string, duration: number) {
  databaseQueriesHistogram.observe({ query_type: queryType }, duration);
}
