import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import type {
  ChangePasswordInput,
  GoogleLoginInput,
  PasswordLoginInput,
  SendOtpInput,
  VerifyOtpInput,
} from '@open-support/schemas/auth';
import { EnvService } from '../config/env.service';
import { UsersService } from '../users/users.service';
import { MailerService } from './mailer.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import type { SessionUser } from './session.service';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly env: EnvService,
    private readonly mailer: MailerService,
    private readonly otp: OtpService,
    private readonly passwords: PasswordService,
    private readonly users: UsersService,
  ) {}

  async sendOtp(input: SendOtpInput) {
    const otp = await this.otp.create(input.email);
    await this.mailer.sendOtp(input.email, otp);
    return { ok: true };
  }

  async verifyOtp(input: VerifyOtpInput) {
    await this.otp.verify(input.email, input.otp);
    return this.users.findOrCreateLocalUser(input.email);
  }

  async passwordLogin(input: PasswordLoginInput) {
    const user = await this.users.findByEmail(input.email);

    if (!user || !this.passwords.verify(input.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async changePassword(user: SessionUser, input: ChangePasswordInput) {
    const storedUser = await this.users.getById(user.id);

    if (!this.passwords.verify(input.currentPassword, storedUser.passwordHash)) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    return this.users.setPassword(user.id, this.passwords.hash(input.newPassword), false);
  }

  async verifyGoogle(input: GoogleLoginInput) {
    const clientId = this.env.googleClientId;

    if (!clientId) {
      throw new UnauthorizedException('Google login is not configured');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified');
    }

    return this.users.findOrCreateLocalUser(payload.email, payload.name ?? null);
  }
}
