import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { UserRole } from '@open-support/schemas/user';
import { EnvService } from '../config/env.service';
import type { UserEntity } from '../users/user.entity';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

interface SessionPayload extends SessionUser {
  exp: number;
}

@Injectable()
export class SessionService {
  constructor(private readonly env: EnvService) {}

  get cookieName() {
    return this.env.session.cookieName;
  }

  createToken(user: UserEntity) {
    const payload: SessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + this.env.session.ttlSeconds,
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const signature = this.sign(encodedPayload);
    return `${encodedPayload}.${signature}`;
  }

  createCookie(user: UserEntity) {
    const token = this.createToken(user);
    const maxAge = this.env.session.ttlSeconds;

    return [
      `${this.cookieName}=${token}`,
      'HttpOnly',
      'Path=/',
      'SameSite=Lax',
      `Max-Age=${maxAge}`,
      this.env.nodeEnv === 'production' ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');
  }

  createClearCookie() {
    return [
      `${this.cookieName}=`,
      'HttpOnly',
      'Path=/',
      'SameSite=Lax',
      'Max-Age=0',
      this.env.nodeEnv === 'production' ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');
  }

  parseToken(token: string | undefined): SessionUser | null {
    if (!token) {
      return null;
    }

    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature || !this.verifySignature(encodedPayload, signature)) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as SessionPayload;

      if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }

  private sign(value: string) {
    return createHmac('sha256', this.env.session.secret).update(value).digest('base64url');
  }

  private verifySignature(value: string, signature: string) {
    const expected = Buffer.from(this.sign(value));
    const received = Buffer.from(signature);

    return expected.length === received.length && timingSafeEqual(expected, received);
  }
}
