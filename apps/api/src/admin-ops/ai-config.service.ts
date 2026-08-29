import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { AiProvider, UpsertAiConfigInput } from '@open-support/schemas/ai';
import { Repository } from 'typeorm';
import { EnvService } from '../config/env.service';
import { AdminSettingEntity } from './entities/admin-setting.entity';

const SETTING_KEY = 'ai.config';

@Injectable()
export class AiConfigService {
  constructor(
    @InjectRepository(AdminSettingEntity) private readonly settings: Repository<AdminSettingEntity>,
    private readonly env: EnvService,
  ) {}

  async getConfig() {
    const setting = await this.settings.findOne({ where: { key: SETTING_KEY } });
    if (!setting) return null;
    const value = setting.value as {
      provider: AiProvider;
      model?: string | null;
      enabled: boolean;
      apiKey: string;
    };
    return {
      provider: value.provider,
      model: value.model ?? null,
      enabled: value.enabled,
      apiKey: this.decrypt(value.apiKey),
    };
  }

  async publicConfig() {
    const config = await this.getConfig();
    return config
      ? { provider: config.provider, model: config.model, enabled: config.enabled }
      : null;
  }

  async upsert(userId: string, input: UpsertAiConfigInput) {
    await this.settings.save(
      this.settings.create({
        key: SETTING_KEY,
        updatedByUserId: userId,
        value: {
          provider: input.provider,
          model: input.model ?? null,
          enabled: input.enabled,
          apiKey: this.encrypt(input.apiKey),
        },
      }),
    );
    return this.publicConfig();
  }

  private key() {
    return createHash('sha256').update(this.env.session.secret).digest();
  }
  private encrypt(value: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key(), iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`;
  }
  private decrypt(value: string) {
    const [iv, tag, encrypted] = value.split('.');
    const decipher = createDecipheriv('aes-256-gcm', this.key(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  }
}
