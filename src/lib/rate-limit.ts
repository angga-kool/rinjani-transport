/**
 * Simple in-memory rate limiter for API routes.
 * Uses sliding window approach per IP/key.
 *
 * For production with multiple instances, use Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 60_000); // Clean every minute

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check rate limit for a given key (typically IP address).
 * Returns whether the request should be allowed.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { limit: 30, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const entry = store.get(key);

  // No existing entry or window expired — allow and create new entry
  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: options.limit - 1, resetIn: options.windowSeconds };
  }

  // Within window — check count
  if (entry.count < options.limit) {
    entry.count++;
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { success: true, remaining: options.limit - entry.count, resetIn };
  }

  // Rate limited
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return { success: false, remaining: 0, resetIn };
}

/**
 * Get the client IP from request headers.
 * Works with most proxies/load balancers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
