import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOpsModule } from '../admin-ops/admin-ops.module';
import { AppConfigModule } from '../config/config.module';
import { MediaAssetEntity } from './media-asset.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaStorageService } from './storage/media-storage.service';

@Module({
  imports: [AppConfigModule, AdminOpsModule, TypeOrmModule.forFeature([MediaAssetEntity])],
  controllers: [MediaController],
  providers: [MediaService, MediaStorageService],
})
export class MediaModule {}
