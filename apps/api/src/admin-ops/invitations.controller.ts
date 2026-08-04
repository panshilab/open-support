import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AcceptInvitationDto, type AcceptInvitationInput } from '@open-support/schemas/auth';
import { SessionService } from '../auth/session.service';
import { AdminOpsService } from './admin-ops.service';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly adminOps: AdminOpsService,
    private readonly sessions: SessionService,
  ) {}

  @Post('accept')
  async accept(@Body() body: AcceptInvitationDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.adminOps.acceptInvitation(body as AcceptInvitationInput);
    response.setHeader('Set-Cookie', this.sessions.createCookie(user));
    return { user: this.sessions.toSessionUser(user) };
  }
}
