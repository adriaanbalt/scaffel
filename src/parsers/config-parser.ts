/**
 * Configuration file parser
 */

import fs from 'fs';
import path from 'path';
import { ConfigurationError } from '../core/errors';

export interface ScaffelConfig {
  product: {
    name: string;
    description?: string;
    type?: string;
    domain?: string;
  };
  techStack?: {
    framework?: string;
    backend?: string;
    database?: string;
    language?: string;
    styling?: string;
  };
  features?: Array<{
    name: string;
    description?: string;
    priority?: string;
    dependencies?: string[];
    estimatedTime?: {
      days?: number;
      weeks?: number;
    };
  }>;
  options?: {
    multiTenant?: boolean;
    includeAdmin?: boolean;
    includeTests?: boolean;
    includeDocs?: boolean;
    codeGeneration?: boolean;
  };
}

export class ConfigParser {
  parse(filePath: string): ScaffelConfig {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Config file not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const config = JSON.parse(content) as ScaffelConfig;

    return this.validate(config);
  }

  validate(config: unknown): ScaffelConfig {
    if (!config || typeof config !== 'object') {
      throw new ConfigurationError('Config must be an object');
    }
    const configObj = config as Record<string, unknown>;
    if (!configObj.product || typeof configObj.product !== 'object') {
      throw new ConfigurationError('Config must have a product object');
    }
    const product = configObj.product as Record<string, unknown>;
    if (!product.name || typeof product.name !== 'string') {
      throw new ConfigurationError('Config must have a product with a name');
    }

    return config as ScaffelConfig;
  }

  mergeWithCLI(
    config: ScaffelConfig,
    cliArgs: {
      product?: string;
      features?: string;
      techStack?: string;
    }
  ): ScaffelConfig {
    const merged = { ...config };

    if (cliArgs.product) {
      merged.product.name = cliArgs.product;
    }

    if (cliArgs.features) {
      // Features will be parsed separately
    }

    if (cliArgs.techStack) {
      // Tech stack will be parsed separately
    }

    return merged;
  }
}
