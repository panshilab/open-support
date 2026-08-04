import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EnvService } from '../config/env.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly env: EnvService) {}

  async sendOtp(email: string, otp: string) {
    const smtp = this.env.smtp;

    if (!smtp.host || !smtp.fromEmail) {
      this.logger.warn(`SMTP is not configured. OTP for ${email}: ${otp}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth:
        smtp.user && smtp.pass
          ? {
              user: smtp.user,
              pass: smtp.pass,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
      to: email,
      subject: `${this.env.appName} login code`,
      text: `Your ${this.env.appName} login code is ${otp}. It expires in ${Math.floor(
        this.env.otp.expiresInSeconds / 60,
      )} minutes.`,
    });
  }
}
