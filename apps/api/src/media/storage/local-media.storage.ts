import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { MediaStorage } from './media-storage.interface';

export class LocalMediaStorage implements MediaStorage {
  readonly provider = 'local' as const;

  constructor(
    private readonly directory: string,
    private readonly publicUrl: string,
  ) {}

  async put(file: Express.Multer.File) {
    await mkdir(this.directory, { recursive: true });
    const extension = extname(file.originalname);
    const key = `${randomUUID()}${extension}`;
    await writeFile(join(this.directory, key), file.buffer);

    return {
      key,
      provider: this.provider,
      url: `${this.publicUrl.replace(/\/$/, '')}/${key}`,
    };
  }

  async delete(key: string) {
    try {
      await unlink(join(this.directory, key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
