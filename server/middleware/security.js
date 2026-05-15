/**
 * server/middleware/security.js
 *
 * Drop-in security middleware for Express:
 *  - rateLimiter        → general API rate limit
 *  - paymentRateLimiter → strict limit on payment endpoints
 *  - sanitizeBody       → strip $ and . from keys to prevent NoSQL injection
 *  - auditLog           → attach IP + userAgent to req for logging
 */

import rateLimit from "express-rate-limit";

/* ── 1. General API rate limit ───────────────────────────── */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

/* ── 2. Payment endpoint rate limit (strict) ─────────────── */
export const paymentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 minutes
  max: 10,                     // max 10 payment attempts per IP per 10 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment attempts. Please wait and try again." },
});

/* ── 3. NoSQL injection sanitiser ────────────────────────── */
function deepSanitize(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else {
      obj[key] = deepSanitize(obj[key]);
    }
  }
  return obj;
}

export function sanitizeBody(req, _res, next) {
  if (req.body) req.body = deepSanitize(req.body);
  next();
}

/* ── 4. Audit metadata injector ──────────────────────────── */
export function auditLog(req, _res, next) {
  req.clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  req.clientAgent = req.headers["user-agent"] || "unknown";
  next();
}