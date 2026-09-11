import { supabase } from '../config/supabase';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private static sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...context };
    const sensitiveKeys = ['key', 'secret', 'password', 'token', 'authorization', 'api_key'];
    for (const k of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk))) {
        sanitized[k] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  public static log(module: string, level: LogLevel, message: string, context: Record<string, unknown> = {}) {
    const sanitized = this.sanitizeContext(context);
    const timestamp = new Date().toISOString();
    
    // Console output
    const formattedConsole = `[${timestamp}] [${level}] [${module}]: ${message}`;
    if (level === 'ERROR') {
      console.error(formattedConsole, sanitized);
    } else if (level === 'WARN') {
      console.warn(formattedConsole, sanitized);
    } else {
      console.log(formattedConsole, sanitized);
    }

    // Safe non-blocking background DB insert
    try {
      if (process.env.NODE_ENV !== 'test' && supabase) {
        Promise.resolve(
          supabase.from('system_logs').insert({
            module,
            level,
            message,
            context: sanitized,
            created_at: timestamp
          })
        ).catch(() => {});
      }
    } catch {
      // Ignored to prevent crashes
    }
  }

  public static info(module: string, message: string, context: Record<string, unknown> = {}) {
    this.log(module, 'INFO', message, context);
  }

  public static warn(module: string, message: string, context: Record<string, unknown> = {}) {
    this.log(module, 'WARN', message, context);
  }

  public static error(module: string, message: string, context: Record<string, unknown> = {}) {
    this.log(module, 'ERROR', message, context);
  }

  public static debug(module: string, message: string, context: Record<string, unknown> = {}) {
    this.log(module, 'DEBUG', message, context);
  }
}
