import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly cache: CacheService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async getHealth() {
    return {
      status: 'ok',
      database: this.dataSource.isInitialized ? 'connected' : 'disconnected',
      cache: this.cache.storeName,
    };
  }
}
