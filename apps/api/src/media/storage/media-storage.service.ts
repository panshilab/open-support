import { Injectable, NotImplementedException } from '@nestjs/common';
import { EnvService } from '../../config/env.service';
import { LocalMediaStorage } from './local-media.storage';
import type { MediaStorage } from './media-storage.interface';

@Injectable()
export class MediaStorageService {
  readonly storage: MediaStorage;

  constructor(env: EnvService) {
    const media = env.media;

    if (media.provider !== 'local') {
      throw new NotImplementedException(
        `${media.provider} media storage is configured but not implemented yet`,
      );
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
