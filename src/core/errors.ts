/**
 * Custom error types for Scaffel
 */

export class ScaffelError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ScaffelError';
    Object.setPrototypeOf(this, ScaffelError.prototype);
  }
}

export class ValidationError extends ScaffelError {
  constructor(
    message: string,
    public readonly errors: string[],
    cause?: Error
  ) {
    super(message, 'VALIDATION_ERROR', cause);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ConfigurationError extends ScaffelError {
  constructor(message: string, cause?: Error) {
    super(message, 'CONFIGURATION_ERROR', cause);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class FileSystemError extends ScaffelError {
  constructor(
    message: string,
    public readonly path: string,
    cause?: Error
  ) {
    super(message, 'FILE_SYSTEM_ERROR', cause);
    this.name = 'FileSystemError';
    Object.setPrototypeOf(this, FileSystemError.prototype);
  }
}

export class KnowledgeBaseError extends ScaffelError {
  constructor(message: string, cause?: Error) {
    super(message, 'KNOWLEDGE_BASE_ERROR', cause);
    this.name = 'KnowledgeBaseError';
    Object.setPrototypeOf(this, KnowledgeBaseError.prototype);
  }
}

export class TemplateError extends ScaffelError {
  constructor(
    message: string,
    public readonly templateName?: string,
    cause?: Error
  ) {
    super(message, 'TEMPLATE_ERROR', cause);
    this.name = 'TemplateError';
    Object.setPrototypeOf(this, TemplateError.prototype);
  }
}
