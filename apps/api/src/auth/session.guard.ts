import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { SessionService, type SessionUser } from './session.service';

export interface RequestWithUser extends Request {
  user?: SessionUser;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = this.sessions.parseToken(this.readCookie(request));

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = user;
    return true;
  }

  private readCookie(request: Request) {
    const cookieHeader = request.headers.cookie;
    const cookies = cookieHeader?.split(';').map((cookie: string) => cookie.trim()) ?? [];
    const sessionCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${this.sessions.cookieName}=`),
    );

    return sessionCookie?.slice(this.sessions.cookieName.length + 1);
  }
}
