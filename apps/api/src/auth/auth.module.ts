import { Global, Module } from '@nestjs/common';
import { AppCacheModule } from '../cache/cache.module';
import { AppConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerService } from './mailer.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import { RolesGuard } from './roles.guard';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [AppConfigModule, AppCacheModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailerService,
    OtpService,
    PasswordService,
    RolesGuard,
    SessionGuard,
    SessionService,
  ],
  exports: [MailerService, PasswordService, RolesGuard, SessionGuard, SessionService],
})
export class AuthModule {}
