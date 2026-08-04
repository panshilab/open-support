import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { EnvService } from '../config/env.service';
import { InvitationEmail } from '../email-templates/invitation-email';
import { OtpEmail } from '../email-templates/otp-email';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly env: EnvService) {}

  async sendOtp(email: string, otp: string) {
    const expiresInMinutes = Math.floor(this.env.otp.expiresInSeconds / 60);
    await this.sendMail({
      to: email,
      subject: `${this.env.appName} login code`,
      html: await render(
        OtpEmail({
          appName: this.env.appName,
          otp,
          expiresInMinutes,
        }),
      ),
      text: `Your ${this.env.appName} login code is ${otp}. It expires in ${expiresInMinutes} minutes.`,
      fallbackLog: `SMTP is not configured. OTP for ${email}: ${otp}`,
    });
  }

  async sendInvitation(email: string, invitationUrl: string, role: string, expiresAt: Date) {
    await this.sendMail({
      to: email,
      subject: `You have been invited to ${this.env.appName}`,
      html: await render(
        InvitationEmail({
          appName: this.env.appName,
          invitationUrl,
          role,
          expiresAt,
        }),
      ),
      text: `You have been invited to ${this.env.appName} as ${role}. Accept the invitation: ${invitationUrl}`,
      fallbackLog: `SMTP is not configured. Invitation for ${email}: ${invitationUrl}`,
    });
  }

  private async sendMail(input: {
    to: string;
    subject: string;
    html: string;
    text: string;
    fallbackLog: string;
  }) {
    const smtp = this.env.smtp;

    if (!smtp.host || !smtp.fromEmail) {
      this.logger.warn(input.fallbackLog);
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
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  }
}
