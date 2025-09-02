/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from "express";
import { RedisClient } from "../../shared/redis";
import config from "../../config";

type Opts = {
  maxHits?: number; // default 3
  windowMs?: number; // default 1000
  penaltyMs?: number; // default 10000
  prefix?: string; // default "rl"
  keyGenerator?: (req: Request, prefix: string) => string;
};

const DEFAULTS = {
  maxHits: Number(config.RATE_LIMIT_MAX_HITS),
  windowMs: Number(config.RATE_LIMIT_WINDOW_MS),
  penaltyMs: Number(config.RATE_LIMIT_PENALTY_MS),
  prefix: "rl",
};

// Atomic Lua (sorted-set sliding window + penalty key)
// Return: [status, value]
//  status 0 = allow now (value = remaining)
//  status 1 = penalty active (value = ms left)
//  status 2 = just penalized (value = penaltyMs)
const LUA = `
local hitsKey = KEYS[1]
local penKey  = KEYS[2]
local now     = tonumber(ARGV[1])
local window  = tonumber(ARGV[2])
local maxHits = tonumber(ARGV[3])
local penalty = tonumber(ARGV[4])

-- penalty check
local pttl = redis.call('PTTL', penKey)
if pttl > 0 then
  return {1, pttl}
end

-- slide window
local oldest = now - window
redis.call('ZREMRANGEBYSCORE', hitsKey, 0, oldest)

-- add hit
redis.call('ZADD', hitsKey, now, tostring(now))

-- count
local count = redis.call('ZCARD', hitsKey)

-- keep hitsKey alive a bit longer than window
redis.call('PEXPIRE', hitsKey, window + 1000)

if count > maxHits then
  redis.call('PSETEX', penKey, penalty, '1')
  return {2, penalty}
end

return {0, math.max(0, maxHits - count)}
`;

function defaultKeyGenerator(req: Request, prefix: string): string {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const userId = (req as any).user?.userId;
  const route = `${req.baseUrl}${req.path}`;
  // guest: ip; logged-in: ip + userId
  return userId ? `${prefix}:${route}:${ip}:${userId}` : `${prefix}:${route}:${ip}`;
}

export function rateLimitRedis(opts?: Opts) {
  const maxHits = opts?.maxHits ?? DEFAULTS.maxHits;
  const windowMs = opts?.windowMs ?? DEFAULTS.windowMs;
  const penaltyMs = opts?.penaltyMs ?? DEFAULTS.penaltyMs;
  const prefix = opts?.prefix ?? DEFAULTS.prefix;
  const keyGen = opts?.keyGenerator ?? defaultKeyGenerator;

  return async function limiter(req: Request, res: Response, next: NextFunction) {
    try {
      const now = Date.now();
      const baseKey = keyGen(req, prefix);
      const keys = [`${baseKey}:hits`, `${baseKey}:pen`];

      const [statusRaw, valueRaw] = (await RedisClient.evalScript(LUA, keys, [now, windowMs, maxHits, penaltyMs])) as [number | string, number | string];

      const status = Number(statusRaw);
      const valueMs = Number(valueRaw);

      // Helpful headers
      res.setHeader("X-RateLimit-Limit", String(maxHits));
      res.setHeader("X-RateLimit-WindowMs", String(windowMs));
      res.setHeader("X-RateLimit-PenaltyMs", String(penaltyMs));

      if (status === 0) {
        const remaining = Math.max(0, maxHits - 1); // current request already counted
        res.setHeader("X-RateLimit-Remaining", String(remaining));
        return next();
      }

      // penalty active or just set -> delay then continue
      const wait = Math.max(0, valueMs);
      res.setHeader("Retry-After", Math.ceil(wait / 1000));
      res.setHeader("X-RateLimit-Delayed-For", String(Math.ceil(wait / 1000)));

      const timer = setTimeout(() => next(), wait);

      const cleanup = () => clearTimeout(timer);
      res.on("close", cleanup);
      res.on("finish", cleanup);
    } catch (_err) {
      // Fail-open if Redis unavailable
      return next();
    }
  };
}
