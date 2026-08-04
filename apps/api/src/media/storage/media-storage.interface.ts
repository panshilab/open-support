import type { MediaProvider } from '@open-support/schemas/media';

export interface StoredMediaObject {
  key: string;
  url: string;
  provider: MediaProvider;
}

export interface MediaStorage {
  readonly provider: MediaProvider;
  put(file: Express.Multer.File): Promise<StoredMediaObject>;
  delete(key: string): Promise<void>;
}
