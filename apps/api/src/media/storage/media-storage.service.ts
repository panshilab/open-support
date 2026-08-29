import { Injectable, NotImplementedException } from '@nestjs/common';
import { EnvService } from '../../config/env.service';
import { LocalMediaStorage } from './local-media.storage';
import { S3MediaStorage } from './s3-media.storage';
import type { MediaStorage } from './media-storage.interface';

@Injectable()
export class MediaStorageService {
  readonly storage: MediaStorage;

  constructor(env: EnvService) {
    const media = env.media;

    if (media.provider === 's3') {
      this.storage = new S3MediaStorage({
        accessKeyId: media.s3.accessKeyId!,
        bucket: media.s3.bucket!,
        endpoint: media.s3.endpoint,
        prefix: media.s3.prefix,
        publicUrl: media.publicUrl,
        region: media.s3.region!,
        secretAccessKey: media.s3.secretAccessKey!,
      });
      return;
    }

    if (media.provider !== 'local') {
      throw new NotImplementedException(`${media.provider} media storage is not implemented yet`);
    }

    this.storage = new LocalMediaStorage(media.localDir, media.publicUrl);
  }

  get provider() {
    return this.storage.provider;
  }

  put(file: Express.Multer.File) {
    return this.storage.put(file);
  }

  delete(key: string) {
    return this.storage.delete(key);
  }
}
