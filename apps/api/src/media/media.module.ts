import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { MediaAssetEntity } from './media-asset.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaStorageService } from './storage/media-storage.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([MediaAssetEntity])],
  controllers: [MediaController],
  providers: [MediaService, MediaStorageService],
})
export class MediaModule {}
