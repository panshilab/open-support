import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';
import { SessionService } from '../auth/session.service';
import { RealtimePublisher } from './realtime.publisher';

type AuthenticatedSocket = WebSocket & { user?: ReturnType<SessionService['parseToken']> };

@Injectable()
@WebSocketGateway({ path: '/api/realtime' })
export class RealtimeGateway {
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
    private readonly sessions: SessionService,
    private readonly publisher: RealtimePublisher,
  ) {}

  handleConnection(client: AuthenticatedSocket, request: IncomingMessage) {
    const user = this.sessions.parseToken(this.readCookie(request.headers.cookie));
    if (!user) {
      client.close(1008, 'Authentication required');
      return;
    }

    client.user = user;
    this.publisher.connect(client, user);
    this.logger.debug(`Realtime client connected: ${user.id}`);
    client.send(JSON.stringify({ event: 'realtime.ready', data: { userId: user.id } }));
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.publisher.disconnect(client);
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() _body: unknown) {
    if (client.user) {
      client.send(
        JSON.stringify({ event: 'realtime.pong', data: { at: new Date().toISOString() } }),
      );
    }
  }

  private readCookie(cookieHeader: string | undefined) {
    const cookies = cookieHeader?.split(';').map((cookie) => cookie.trim()) ?? [];
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith(`${this.sessions.cookieName}=`),
    );
    return sessionCookie?.slice(this.sessions.cookieName.length + 1);
  }
}
