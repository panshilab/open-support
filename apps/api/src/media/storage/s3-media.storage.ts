import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { MediaStorage } from './media-storage.interface';

interface S3MediaStorageOptions {
  accessKeyId: string;
  bucket: string;
  endpoint?: string;
  prefix?: string;
  publicUrl: string;
  region: string;
  secretAccessKey: string;
}

export class S3MediaStorage implements MediaStorage {
  readonly provider = 's3' as const;
  private readonly client: S3Client;

  constructor(private readonly options: S3MediaStorageOptions) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
      endpoint: options.endpoint,
      forcePathStyle: Boolean(options.endpoint),
      region: options.region,
    });
  }

  async put(file: Express.Multer.File) {
    const filename = `${randomUUID()}${extname(file.originalname)}`;
    const key = [this.options.prefix?.replace(/^\/|\/$/g, ''), filename].filter(Boolean).join('/');

    await this.client.send(
      new PutObjectCommand({
        Body: file.buffer,
        Bucket: this.options.bucket,
        ContentType: file.mimetype,
        Key: key,
      }),
    );

    return {
      key,
      provider: this.provider,
      url: `${this.options.publicUrl.replace(/\/$/, '')}/${key
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`,
    };
  }

  async delete(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.options.bucket, Key: key }));
  }
}
