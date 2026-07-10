// Vercel Serverless Function Entry Point
// This file exports the Express app to be used as a Vercel serverless function

import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth.js";
import { registerStorageProxy } from "../server/_core/storageProxy.js";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import { createRateLimiter } from "../server/_core/rateLimiter.js";
import { monitoringMiddleware } from "../server/_core/monitoring.js";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Security middlewares
app.use(monitoringMiddleware);
app.use(createRateLimiter({ maxRequests: 30, windowMs: 60 * 1000 }));

// Register routes
registerStorageProxy(app);
registerOAuthRoutes(app);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Backup health check endpoint
app.get("/health/backup", async (req, res) => {
  try {
    const { getBackupHealth } = await import("../server/_core/backupService.js");
    const health = getBackupHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files (built frontend)
app.use(express.static("dist/public"));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile("dist/public/index.html");
});

// Export the app for Vercel
export default app;
