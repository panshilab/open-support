import { Injectable } from '@nestjs/common';
import type { SessionUser } from '../auth/session.service';
import type { WebSocket } from 'ws';

export type RealtimeEvent = {
  type: 'ticket.created' | 'ticket.comment_added' | 'ticket.status_updated' | 'ticket.seen_updated';
  ticketId: string;
  ticketOwnerId: string;
  actorId: string;
  actorRole: SessionUser['role'];
  status?: string;
  side?: 'customer' | 'staff';
  occurredAt: string;
};

@Injectable()
export class RealtimePublisher {
  private readonly clients = new Map<WebSocket, SessionUser>();

  connect(client: WebSocket, user: SessionUser) {
    this.clients.set(client, user);
  }

  disconnect(client: WebSocket) {
    this.clients.delete(client);
  }

  publish(event: RealtimeEvent) {
    const message = JSON.stringify({ event: 'realtime', data: event });

    for (const [client, user] of this.clients) {
      const canReceive = user.id === event.ticketOwnerId || this.isStaff(user);
      if (canReceive && client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  }

  private isStaff(user: SessionUser) {
    return user.role === 'admin' || user.role === 'support_agent';
  }
}
