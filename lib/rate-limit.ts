import 'server-only';

type Bucket = { tokens: number; lastRefill: number };

const CAPACITY = 5; // max requests per window
const WINDOW_MS = 60_000; // 1 minute window
const REFILL_RATE = CAPACITY / WINDOW_MS; // tokens per ms

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: CAPACITY, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  const refill = elapsed * REFILL_RATE;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return { ok: true };
  }

  buckets.set(key, bucket);
  const tokensNeeded = 1 - bucket.tokens;
  const retryAfterSeconds = Math.ceil(tokensNeeded / REFILL_RATE / 1000);
  return { ok: false, retryAfterSeconds };
}

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}
