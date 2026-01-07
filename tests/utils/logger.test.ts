import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLogger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    delete process.env.LOG_LEVEL;
    delete process.env.NODE_ENV;
    delete process.env.DEBUG;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createLogger', () => {
    it('should create a logger instance with all methods', () => {
      const logger = createLogger('TestComponent');

      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
    });

    it('should log debug messages', () => {
      const logger = createLogger('TestComponent');
      logger.debug('Debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('🔍'));
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('TestComponent'));
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Debug message'));
    });

    it('should log info messages', () => {
      const logger = createLogger('TestComponent');
      logger.info('Info message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ️'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('TestComponent'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Info message'));
    });

    it('should log warn messages', () => {
      const logger = createLogger('TestComponent');
      logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️'));
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('TestComponent'));
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Warning message'));
    });

    it('should log error messages', () => {
      const logger = createLogger('TestComponent');
      logger.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('❌'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('TestComponent'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });

    it('should include metadata in log messages', () => {
      const logger = createLogger('TestComponent');
      logger.info('Message', { userId: '123', action: 'test' });

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Metadata:'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('userId'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('123'));
    });

    it('should include error details when error object is provided', () => {
      const logger = createLogger('TestComponent');
      const error = new Error('Test error');
      logger.error('Error message', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Test error'));
    });

    it('should include stack trace when DEBUG is enabled', () => {
      process.env.DEBUG = 'true';
      const logger = createLogger('TestComponent');
      const error = new Error('Test error');
      logger.error('Error message', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Stack:'));
    });

    it('should respect LOG_LEVEL environment variable', () => {
      process.env.LOG_LEVEL = 'warn';
      const logger = createLogger('TestComponent');

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should default to debug level in development', () => {
      process.env.NODE_ENV = 'development';
      const logger = createLogger('TestComponent');

      logger.debug('Debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    });

    it('should default to info level in production', () => {
      process.env.NODE_ENV = 'production';
      const logger = createLogger('TestComponent');

      logger.debug('Debug message');
      logger.info('Info message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });
  });
});
