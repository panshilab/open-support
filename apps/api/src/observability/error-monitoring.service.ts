import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../config/env.service';

@Injectable()
export class ErrorMonitoringService {
  private readonly logger = new Logger(ErrorMonitoringService.name);
  private readonly dsn: URL | null;
  private readonly slackWebhook: URL | null;

  constructor(private readonly env: EnvService) {
    this.dsn = this.parseDsn(env.sentryDsn);
    this.slackWebhook = this.parseWebhook(env.slackErrorWebhookUrl);
  }

  captureException(
    exception: unknown,
    context: { requestId: string; path: string; method: string },
  ) {
    const error = exception instanceof Error ? exception : new Error(String(exception));
    if (this.dsn) {
      const projectId = this.dsn.pathname.replace(/^\//, '');
      const endpoint = `${this.dsn.origin}/api/${projectId}/store/?sentry_version=7&sentry_key=${this.dsn.username}`;
      void this.post(
        endpoint,
        {
          event_id: crypto.randomUUID().replaceAll('-', ''),
          timestamp: Date.now() / 1000,
          platform: 'node',
          environment: this.env.nodeEnv,
          message: error.message,
          exception: { values: [{ type: error.name, value: error.message }] },
          extra: context,
        },
        'Sentry',
      );
    }

    if (this.slackWebhook) {
      void this.post(
        this.slackWebhook.toString(),
        {
          text: `🚨 ${this.env.appName} server error: ${error.message.slice(0, 500)}`,
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: `${this.env.appName} server error` },
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Environment*\n${this.env.nodeEnv}` },
                { type: 'mrkdwn', text: `*Error*\n${error.name}: ${error.message.slice(0, 500)}` },
                { type: 'mrkdwn', text: `*Method*\n${context.method}` },
                { type: 'mrkdwn', text: `*Request ID*\n\`${context.requestId}\`` },
              ],
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: `*Path*\n\`${context.path.slice(0, 500)}\`` },
            },
          ],
        },
        'Slack',
      );
    }
  }

  private async post(endpoint: string, payload: Record<string, unknown>, provider: string) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        this.logger.warn(`${provider} rejected error event with status ${response.status}`);
    } catch (sendError: unknown) {
      this.logger.warn(
        `Unable to send ${provider} error event: ${sendError instanceof Error ? sendError.message : String(sendError)}`,
      );
    }
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

  private parseWebhook(value?: string) {
    if (!value) return null;
    try {
      const webhook = new URL(value);
      if (webhook.protocol !== 'https:') throw new Error('Webhook must use HTTPS');
      return webhook;
    } catch {
      this.logger.warn('SLACK_ERROR_WEBHOOK_URL is invalid; Slack error reporting is disabled');
      return null;
    }
  }
}
