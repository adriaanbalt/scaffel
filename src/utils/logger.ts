/**
 * Structured logging utility for Scaffel
 *
 * Provides consistent logging with levels, structured metadata, and formatting.
 * For CLI user-facing output, use console.log directly.
 * For internal operations, use this logger.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogMetadata {
  [key: string]: unknown;
}

interface Logger {
  debug(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
  error(message: string, error?: unknown, metadata?: LogMetadata): void;
}

/**
 * Get the minimum log level from environment variable
 */
function getLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

  if (envLevel && levels.includes(envLevel as LogLevel)) {
    return envLevel as LogLevel;
  }

  // Default to 'info' in production, 'debug' in development
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

/**
 * Check if a log level should be logged
 */
function shouldLog(level: LogLevel): boolean {
  const minLevel = getLogLevel();
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const minIndex = levels.indexOf(minLevel);
  const levelIndex = levels.indexOf(level);
  return levelIndex >= minIndex;
}

/**
 * Format log entry for console output
 */
function formatLog(
  level: LogLevel,
  component: string,
  message: string,
  metadata?: LogMetadata,
  error?: unknown
): string {
  const timestamp = new Date().toISOString();
  const levelIcon = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  }[level];

  let logLine = `${levelIcon} [${timestamp}] [${component}] ${message}`;

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logLine += `\n   Error: ${errorMessage}`;
    if (errorStack && process.env.DEBUG) {
      logLine += `\n   Stack: ${errorStack}`;
    }
  }

  if (metadata && Object.keys(metadata).length > 0) {
    logLine += `\n   Metadata: ${JSON.stringify(metadata, null, 2)}`;
  }

  return logLine;
}

/**
 * Create a logger instance for a component
 */
export function createLogger(component: string): Logger {
  return {
    debug: (message: string, metadata?: LogMetadata) => {
      if (shouldLog('debug')) {
        console.debug(formatLog('debug', component, message, metadata));
      }
    },
    info: (message: string, metadata?: LogMetadata) => {
      if (shouldLog('info')) {
        console.log(formatLog('info', component, message, metadata));
      }
    },
    warn: (message: string, metadata?: LogMetadata) => {
      if (shouldLog('warn')) {
        console.warn(formatLog('warn', component, message, metadata));
      }
    },
    error: (message: string, error?: unknown, metadata?: LogMetadata) => {
      if (shouldLog('error')) {
        console.error(formatLog('error', component, message, metadata, error));
      }
    },
  };
}

/**
 * Default logger instance
 */
export const logger = createLogger('Scaffel');
