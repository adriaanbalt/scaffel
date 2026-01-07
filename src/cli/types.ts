/**
 * CLI command option types
 */

export interface GenerateOptions {
  product?: string;
  description?: string;
  type?: string;
  features?: string;
  techStack?: string;
  config?: string;
  output?: string;
  interactive?: boolean;
}

export interface ScaffoldOptions {
  roadmap?: string;
  phase?: string;
  feature?: string;
  output?: string;
}

export interface StatusOptions {
  roadmap?: string;
  statusFile?: string;
}

export interface ValidateOptions {
  roadmap?: string;
  strict?: boolean;
}
