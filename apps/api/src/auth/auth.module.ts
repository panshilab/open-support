import { Global, Module } from '@nestjs/common';
import { AppCacheModule } from '../cache/cache.module';
import { AppConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerService } from './mailer.service';
import { OtpService } from './otp.service';
import { RolesGuard } from './roles.guard';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [AppConfigModule, AppCacheModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, MailerService, OtpService, RolesGuard, SessionGuard, SessionService],
  exports: [RolesGuard, SessionGuard, SessionService],
})
export class AuthModule {}
