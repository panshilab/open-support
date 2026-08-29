import { useCallback, useEffect, useRef } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { queryClient } from './query-client';
import type { SessionUser } from './types';

export interface RealtimeEvent {
  type: 'ticket.created' | 'ticket.comment_added' | 'ticket.status_updated' | 'ticket.seen_updated';
  ticketId: string;
  ticketOwnerId: string;
  actorId: string;
  actorRole: SessionUser['role'];
  status?: string;
  side?: 'customer' | 'staff';
  occurredAt: string;
}

interface RealtimeMessage {
  event: string;
  data?: RealtimeEvent;
}

export function useRealtime(
  user: SessionUser | null | undefined,
  onNotification: (message: string) => void,
) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  const handleMessage = useCallback((message: RealtimeMessage) => {
    if (message.event !== 'realtime' || !message.data) return;

    void queryClient.invalidateQueries({ queryKey: ['tickets'] });
    void queryClient.invalidateQueries({ queryKey: ['admin'] });

    const labels: Record<RealtimeEvent['type'], string> = {
      'ticket.created': 'A new support ticket was opened.',
      'ticket.comment_added': 'A ticket received a new reply.',
      'ticket.status_updated': 'A ticket status was updated.',
      'ticket.seen_updated': 'A ticket was viewed.',
    };

    if (message.data.type !== 'ticket.seen_updated') {
      onNotificationRef.current(labels[message.data.type]);
      playNotificationSound();
    }
  }, []);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return undefined;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new ReconnectingWebSocket(
      `${protocol}//${window.location.host}/api/realtime`,
      [],
      {
        maxRetries: Infinity,
        minReconnectionDelay: 1000,
        maxReconnectionDelay: 10000,
        connectionTimeout: 5000,
      },
    );
    const onMessage = (event: MessageEvent<string>) => {
      try {
        handleMessage(JSON.parse(event.data) as RealtimeMessage);
      } catch {
        // Ignore malformed messages so one bad event cannot tear down the stream.
      }
    };

    socket.addEventListener('message', onMessage);
    return () => {
      socket.removeEventListener('message', onMessage);
      socket.close();
    };
  }, [handleMessage, user]);
}

function playNotificationSound() {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.addEventListener('ended', () => void context.close());
  } catch {
    // Browsers can reject AudioContext creation until the user interacts.
  }
}
