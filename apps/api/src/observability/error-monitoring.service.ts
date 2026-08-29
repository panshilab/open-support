import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../config/env.service';

@Injectable()
export class ErrorMonitoringService {
  private readonly logger = new Logger(ErrorMonitoringService.name);
  private readonly dsn: URL | null;

  constructor(private readonly env: EnvService) {
    this.dsn = this.parseDsn(env.sentryDsn);
  }

  captureException(
    exception: unknown,
    context: { requestId: string; path: string; method: string },
  ) {
    if (!this.dsn) return;

    const error = exception instanceof Error ? exception : new Error(String(exception));
    const projectId = this.dsn.pathname.replace(/^\//, '');
    const endpoint = `${this.dsn.origin}/api/${projectId}/store/?sentry_version=7&sentry_key=${this.dsn.username}`;
    const payload = {
      event_id: crypto.randomUUID().replaceAll('-', ''),
      timestamp: Date.now() / 1000,
      platform: 'node',
      environment: this.env.nodeEnv,
      message: error.message,
      exception: {
        values: [{ type: error.name, value: error.message, stacktrace: { frames: [] } }],
      },
      extra: context,
    };

    void fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) this.logger.warn(`Sentry rejected event with status ${response.status}`);
      })
      .catch((sendError: unknown) => {
        this.logger.warn(
          `Unable to send error event: ${sendError instanceof Error ? sendError.message : String(sendError)}`,
        );
      });
  }

  private parseDsn(value?: string) {
    if (!value) return null;
    try {
      const dsn = new URL(value);
      if (!dsn.username || !dsn.pathname || dsn.protocol !== 'https:') return null;
      return dsn;
    } catch {
      this.logger.warn('SENTRY_DSN is invalid; error monitoring is disabled');
      return null;
    }
  }
}
