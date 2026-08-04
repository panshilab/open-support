import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { MediaListQuery, UploadMediaMetadataInput } from '@open-support/schemas/media';
import { Repository } from 'typeorm';
import type { SessionUser } from '../auth/session.service';
import { EnvService } from '../config/env.service';
import { MediaAssetEntity } from './media-asset.entity';
import { MediaStorageService } from './storage/media-storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaAssetEntity)
    private readonly mediaAssets: Repository<MediaAssetEntity>,
    private readonly env: EnvService,
    private readonly storage: MediaStorageService,
  ) {}

  list(query: MediaListQuery) {
    const builder = this.mediaAssets.createQueryBuilder('media').orderBy('media.createdAt', 'DESC');

    if (query.provider) {
      builder.andWhere('media.provider = :provider', { provider: query.provider });
    }

    if (query.mimeType) {
      builder.andWhere('media.mimeType = :mimeType', { mimeType: query.mimeType });
    }

    return builder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();
  }

  async upload(
    user: SessionUser,
    file: Express.Multer.File | undefined,
    metadata: UploadMediaMetadataInput,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    this.validateFile(file);
    const stored = await this.storage.put(file);

    return this.mediaAssets.save(
      this.mediaAssets.create({
        ...stored,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        altText: metadata.altText ?? null,
        caption: metadata.caption ?? null,
        uploadedByUserId: user.id,
      }),
    );
  }

  async delete(mediaId: string) {
    const media = await this.mediaAssets.findOne({ where: { id: mediaId } });

    if (!media) {
      throw new NotFoundException('Media asset not found');
    }

    await this.storage.delete(media.key);
    await this.mediaAssets.delete(media.id);

    return { ok: true };
  }

  private validateFile(file: Express.Multer.File) {
    const media = this.env.media;

    if (file.size > media.maxFileSizeBytes) {
      throw new BadRequestException('File is too large');
    }

    if (!media.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type is not allowed');
    }
  }
}
