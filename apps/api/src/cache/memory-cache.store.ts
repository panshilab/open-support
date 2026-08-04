import type { CacheIncrementOptions, CacheSetOptions, CacheStore } from './cache-store.interface';

interface MemoryCacheEntry {
  value: unknown;
  expiresAt: number | null;
}

export class MemoryCacheStore implements CacheStore {
  readonly name = 'memory';
  private readonly entries = new Map<string, MemoryCacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options: CacheSetOptions = {}): Promise<boolean> {
    if (options.nx && (await this.exists(key))) {
      return false;
    }

    this.entries.set(key, {
      value,
      expiresAt: this.expiresAt(options.ttlSeconds),
    });
    return true;
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async increment(key: string, options: CacheIncrementOptions = {}): Promise<number> {
    const current = Number((await this.get<number>(key)) ?? 0);
    const next = current + 1;
    await this.set(key, next, options);
    return next;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const entry = this.entries.get(key);
    if (!entry || this.isExpired(entry)) {
      this.entries.delete(key);
      return;
    }

    this.entries.set(key, {
      value: entry.value,
      expiresAt: this.expiresAt(ttlSeconds),
    });
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.entries.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.entries.delete(key);
      return false;
    }

    return true;
  }

  private expiresAt(ttlSeconds?: number) {
    return ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  }

  private isExpired(entry: MemoryCacheEntry) {
    return entry.expiresAt !== null && entry.expiresAt <= Date.now();
  }
}
