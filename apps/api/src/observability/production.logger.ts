import { Injectable, type LoggerService } from '@nestjs/common';
import { EnvService } from '../config/env.service';

@Injectable()
export class ProductionLogger implements LoggerService {
  constructor(private readonly env: EnvService) {}

  log(message: unknown, context?: string) {
    this.write('info', message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.write('error', message, context, trace);
  }

  warn(message: unknown, context?: string) {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string) {
    if (this.env.nodeEnv !== 'production') this.write('debug', message, context);
  }

  verbose(message: unknown, context?: string) {
    if (this.env.nodeEnv !== 'production') this.write('trace', message, context);
  }

  private write(level: string, message: unknown, context?: string, trace?: string) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.env.appName,
      context: context ?? 'Application',
      message: message instanceof Error ? message.message : String(message),
      ...(trace ? { trace } : {}),
    };

    if (this.env.nodeEnv === 'production') {
      process.stdout.write(`${JSON.stringify(entry)}\n`);
      return;
    }

    const output = `[${entry.level}] ${entry.context}: ${entry.message}`;
    if (level === 'error') console.error(output, trace ?? '');
    else if (level === 'warn') console.warn(output);
    else console.log(output);
  }
}
