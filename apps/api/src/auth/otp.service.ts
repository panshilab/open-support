import { randomInt, createHash } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { EnvService } from '../config/env.service';

interface OtpRecord {
  hash: string;
  attempts: number;
}

@Injectable()
export class OtpService {
  constructor(
    private readonly cache: CacheService,
    private readonly env: EnvService,
  ) {}

  async create(email: string) {
    const otp = this.generateOtp();
    await this.cache.set(this.key(email), this.record(otp), {
      ttlSeconds: this.env.otp.expiresInSeconds,
    });
    return otp;
  }

  async verify(email: string, otp: string) {
    const key = this.key(email);
    const record = await this.cache.get<OtpRecord>(key);

    if (!record) {
      throw new UnauthorizedException('Invalid or expired login code');
    }

    if (record.hash !== this.hash(otp)) {
      record.attempts += 1;

      if (record.attempts >= 5) {
        await this.cache.delete(key);
      } else {
        await this.cache.set(key, record, {
          ttlSeconds: this.env.otp.expiresInSeconds,
        });
      }

      throw new UnauthorizedException('Invalid or expired login code');
    }

    await this.cache.delete(key);
  }

  private generateOtp() {
    const length = this.env.otp.length;
    const min = 10 ** (length - 1);
    const max = 10 ** length;
    return String(randomInt(min, max));
  }

  private record(otp: string): OtpRecord {
    return {
      hash: this.hash(otp),
      attempts: 0,
    };
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private key(email: string) {
    return `auth:otp:${email.toLowerCase()}`;
  }
}
