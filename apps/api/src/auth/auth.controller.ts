import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import {
  ChangePasswordDto,
  type ChangePasswordInput,
  GoogleLoginDto,
  type GoogleLoginInput,
  PasswordLoginDto,
  type PasswordLoginInput,
  SendOtpDto,
  type SendOtpInput,
  VerifyOtpDto,
  type VerifyOtpInput,
} from '@open-support/schemas/auth';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { SessionService, type SessionUser } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
  ) {}

  @Post('send-otp')
  sendOtp(@Body() body: SendOtpDto) {
    return this.auth.sendOtp(body as SendOtpInput);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.auth.verifyOtp(body as VerifyOtpInput);
    response.setHeader('Set-Cookie', this.sessions.createCookie(user));
    return { user: this.sessions.toSessionUser(user) };
  }

  @Post('mobile/verify-otp')
  async mobileVerifyOtp(@Body() body: VerifyOtpDto) {
    const user = await this.auth.verifyOtp(body as VerifyOtpInput);
    return { user: this.sessions.toSessionUser(user), token: this.sessions.createToken(user) };
  }

  @Post('password')
  async passwordLogin(
    @Body() body: PasswordLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.auth.passwordLogin(body as PasswordLoginInput);
    response.setHeader('Set-Cookie', this.sessions.createCookie(user));
    return { user: this.sessions.toSessionUser(user) };
  }

  @Post('mobile/password')
  async mobilePassword(@Body() body: PasswordLoginDto) {
    const user = await this.auth.passwordLogin(body as PasswordLoginInput);
    return { user: this.sessions.toSessionUser(user), token: this.sessions.createToken(user) };
  }

  @Post('change-password')
  @UseGuards(SessionGuard)
  async changePassword(
    @CurrentUser() user: SessionUser,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const updatedUser = await this.auth.changePassword(user, body as ChangePasswordInput);
    response.setHeader('Set-Cookie', this.sessions.createCookie(updatedUser));
    return { user: this.sessions.toSessionUser(updatedUser) };
  }

  @Post('google')
  async google(@Body() body: GoogleLoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.auth.verifyGoogle(body as GoogleLoginInput);
    response.setHeader('Set-Cookie', this.sessions.createCookie(user));
    return { user: this.sessions.toSessionUser(user) };
  }

  @Get('google/config')
  googleConfig() {
    return this.auth.googleConfig();
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Set-Cookie', this.sessions.createClearCookie());
    return { ok: true };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  me(@CurrentUser() user: SessionUser) {
    return { user };
  }
}
