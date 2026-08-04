export interface CacheSetOptions {
  ttlSeconds?: number;
  nx?: boolean;
}

export interface CacheIncrementOptions {
  ttlSeconds?: number;
}

export interface CacheStore {
  readonly name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<boolean>;
  delete(key: string): Promise<void>;
  increment(key: string, options?: CacheIncrementOptions): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  exists(key: string): Promise<boolean>;
}
