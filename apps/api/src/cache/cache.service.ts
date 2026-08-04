import { Inject, Injectable } from '@nestjs/common';
import type { CacheIncrementOptions, CacheSetOptions, CacheStore } from './cache-store.interface';

export const CACHE_STORE = Symbol('CACHE_STORE');

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_STORE) private readonly store: CacheStore) {}

  get storeName() {
    return this.store.name;
  }

  get<T>(key: string) {
    return this.store.get<T>(key);
  }

  set<T>(key: string, value: T, options?: CacheSetOptions) {
    return this.store.set(key, value, options);
  }

  delete(key: string) {
    return this.store.delete(key);
  }

  increment(key: string, options?: CacheIncrementOptions) {
    return this.store.increment(key, options);
  }

  expire(key: string, ttlSeconds: number) {
    return this.store.expire(key, ttlSeconds);
  }

  exists(key: string) {
    return this.store.exists(key);
  }
}
