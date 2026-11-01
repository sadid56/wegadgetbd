export const CACHE_SERVICE_TOKEN = Symbol("ICacheService");

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string | string[]): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  remember<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  readonly isDistributed: boolean;
}
