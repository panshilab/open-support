import { Module } from '@nestjs/common';
import { EnvService } from '../config/env.service';
import { CACHE_STORE, CacheService } from './cache.service';
import { MemoryCacheStore } from './memory-cache.store';
import { RedisCacheStore } from './redis-cache.store';

@Module({
  providers: [
    {
      provide: CACHE_STORE,
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        if (env.redisUrl) {
          return new RedisCacheStore({
            url: env.redisUrl,
            password: env.redisPassword,
          });
        }

        return new MemoryCacheStore();
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class AppCacheModule {}
