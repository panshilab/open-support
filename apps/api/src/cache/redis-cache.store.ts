import Redis from 'ioredis';
import type { CacheIncrementOptions, CacheSetOptions, CacheStore } from './cache-store.interface';

export interface RedisCacheStoreOptions {
  url: string;
  password?: string;
}

export class RedisCacheStore implements CacheStore {
  readonly name = 'redis';
  private readonly redis: Redis;

  constructor(options: RedisCacheStoreOptions) {
    this.redis = new Redis(options.url, {
      password: options.password,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value === null ? null : JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, options: CacheSetOptions = {}): Promise<boolean> {
    const serialized = JSON.stringify(value);

    if (options.ttlSeconds && options.nx) {
      return (await this.redis.set(key, serialized, 'EX', options.ttlSeconds, 'NX')) === 'OK';
    }

    if (options.ttlSeconds) {
      return (await this.redis.set(key, serialized, 'EX', options.ttlSeconds)) === 'OK';
    }

    if (options.nx) {
      return (await this.redis.set(key, serialized, 'NX')) === 'OK';
    }

    return (await this.redis.set(key, serialized)) === 'OK';
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async increment(key: string, options: CacheIncrementOptions = {}): Promise<number> {
    const value = await this.redis.incr(key);
    if (options.ttlSeconds) {
      await this.redis.expire(key, options.ttlSeconds);
    }
    return value;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlSeconds);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }
}
