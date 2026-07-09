import { NextFunction, Request, Response } from "express";

/**
 * Rate Limiter - Prevents brute force attacks and DDoS
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  maxRequests?: number; // Max requests per window (default: 100)
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Generic rate limiter middleware
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100;
  const message = options.message || "Too many requests, please try again later";
  const keyGenerator = options.keyGenerator || ((req) => req.ip || "unknown");

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up old entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or increment
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
    } else {
      store[key].count++;
    }

    // Set headers
    res.setHeader("RateLimit-Limit", maxRequests);
    res.setHeader("RateLimit-Remaining", Math.max(0, maxRequests - store[key].count));
    res.setHeader("RateLimit-Reset", store[key].resetTime);

    // Check limit
    if (store[key].count > maxRequests) {
      console.warn(`[RateLimit] Limit exceeded for ${key}: ${store[key].count}/${maxRequests}`);
      return res.status(429).json({ error: message });
    }

    next();
  };
}

/**
 * Specific rate limiters for critical endpoints
 */

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: "Too many login attempts, please try again later",
});

export const signupLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 signups per hour per IP
  message: "Too many signup attempts, please try again later",
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  message: "API rate limit exceeded",
});

export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50, // 50 uploads per hour
  message: "Upload limit exceeded",
});
