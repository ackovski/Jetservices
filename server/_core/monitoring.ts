/**
 * Monitoring & Alerting System
 * Tracks performance, errors, and anomalies
 */

interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number; // milliseconds
  statusCode: number;
  timestamp: Date;
}

interface ErrorAlert {
  message: string;
  stack?: string;
  userId?: number;
  endpoint?: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
}

const metrics: PerformanceMetric[] = [];
const alerts: ErrorAlert[] = [];
const thresholds = {
  slowRequest: 1000, // ms
  errorRate: 0.05, // 5%
  dbConnectionPool: 0.9, // 90%
};

/**
 * Record performance metric
 */
export function recordMetric(metric: PerformanceMetric): void {
  metrics.push(metric);

  // Keep only last 1000 metrics in memory
  if (metrics.length > 1000) {
    metrics.shift();
  }

  // Alert on slow requests
  if (metric.duration > thresholds.slowRequest) {
    createAlert({
      message: `Slow request: ${metric.method} ${metric.endpoint} took ${metric.duration}ms`,
      endpoint: metric.endpoint,
      timestamp: metric.timestamp,
      severity: metric.duration > 5000 ? "high" : "medium",
    });
  }

  // Alert on errors
  if (metric.statusCode >= 500) {
    createAlert({
      message: `Server error: ${metric.method} ${metric.endpoint} returned ${metric.statusCode}`,
      endpoint: metric.endpoint,
      timestamp: metric.timestamp,
      severity: "high",
    });
  }
}

/**
 * Create alert
 */
export function createAlert(alert: ErrorAlert): void {
  alerts.push(alert);

  // Keep only last 100 alerts in memory
  if (alerts.length > 100) {
    alerts.shift();
  }

  // Log alert
  const prefix = `[${alert.severity.toUpperCase()}]`;
  if (alert.severity === "critical") {
    console.error(prefix, alert.message);
  } else if (alert.severity === "high") {
    console.warn(prefix, alert.message);
  } else {
    console.log(prefix, alert.message);
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(): any {
  if (metrics.length === 0) {
    return { message: "No metrics available" };
  }

  const durations = metrics.map((m) => m.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);

  const errors = metrics.filter((m) => m.statusCode >= 400);
  const errorRate = errors.length / metrics.length;

  return {
    totalRequests: metrics.length,
    averageDuration: Math.round(avgDuration),
    maxDuration,
    minDuration,
    errorCount: errors.length,
    errorRate: (errorRate * 100).toFixed(2) + "%",
    lastUpdated: new Date(),
  };
}

/**
 * Get recent alerts
 */
export function getRecentAlerts(limit: number = 10): ErrorAlert[] {
  return alerts.slice(-limit).reverse();
}

/**
 * Health check
 */
export function getHealthStatus(): any {
  const stats = getPerformanceStats();
  const recentAlerts = getRecentAlerts(5);

  const errorRate = parseFloat(stats.errorRate || "0");
  const isHealthy =
    errorRate < thresholds.errorRate * 100 && recentAlerts.length === 0;

  return {
    status: isHealthy ? "healthy" : "degraded",
    metrics: stats,
    recentAlerts,
    timestamp: new Date(),
  };
}

/**
 * Middleware for Express to track performance
 */
export function monitoringMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();

  // Wrap res.end to capture status code
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - startTime;
    recordMetric({
      endpoint: req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      timestamp: new Date(),
    });
    originalEnd.apply(res, args);
  };

  next();
}
