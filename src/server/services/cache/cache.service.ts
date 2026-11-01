import "reflect-metadata";
import { singleton } from "tsyringe";
import { Redis } from "@upstash/redis";
import type { ICacheService } from "./cache.types";

const ERROR_LOG_THROTTLE_MS = 30_000;

class CacheErrorLogger {
  private lastLogTime = 0;

  constructor(private readonly throttleMs: number = ERROR_LOG_THROTTLE_MS) {}

  report(operation: string, error: unknown): void {
    const now = Date.now();
    if (now - this.lastLogTime <= this.throttleMs) return;

    console.warn(`[CacheService] Redis ${operation} failed (bypassing cache):`, error instanceof Error ? error.message : error);
    this.lastLogTime = now;
  }
}

@singleton()
export class CacheService implements ICacheService {
  private readonly client: Redis | null;
  private readonly logger: CacheErrorLogger;

  constructor() {
    this.logger = new CacheErrorLogger();
    this.client = this.createClient();
  }

  get isDistributed(): boolean {
    return this.client !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.execute(
      `get("${key}")`,
      async (client) => (await client.get<T>(key)) ?? null,
      () => null,
    );
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.execute(
      `set("${key}")`,
      async (client) => {
        if (ttlSeconds && ttlSeconds > 0) {
          await client.set(key, value, { ex: ttlSeconds });
        } else {
          await client.set(key, value);
        }
      },
      () => undefined,
    );
  }

  async delete(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    if (keys.length === 0) return;

    await this.execute(
      "delete",
      async (client) => {
        await client.del(...keys);
      },
      () => undefined,
    );
  }

  async deletePattern(pattern: string): Promise<void> {
    await this.execute(
      `deletePattern("${pattern}")`,
      async (client) => {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(...keys);
        }
      },
      () => undefined,
    );
  }

  async has(key: string): Promise<boolean> {
    return this.execute(
      `has("${key}")`,
      async (client) => (await client.exists(key)) === 1,
      () => false,
    );
  }

  async remember<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;

    const fresh = await fetcher();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  }

  async clear(): Promise<void> {
    await this.execute(
      "clear",
      async (client) => {
        await client.flushdb();
      },
      () => undefined,
    );
  }

  private async execute<T>(operation: string, action: (client: Redis) => Promise<T>, fallback: () => T): Promise<T> {
    if (!this.client) return fallback();

    try {
      return await action(this.client);
    } catch (error) {
      this.logger.report(operation, error);
      return fallback();
    }
  }

  private createClient(): Redis | null {
    try {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!url || !token) {
        console.warn("[CacheService] Redis credentials not found. Cache will operate in bypass mode.");
        return null;
      }

      return new Redis({
        url,
        token,
        retry: { retries: 1, backoff: () => 50 },
      });
    } catch (error) {
      this.logger.report("initialization", error);
      return null;
    }
  }
}
