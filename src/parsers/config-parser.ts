/**
 * Configuration file parser
 */

import fs from 'fs';
import path from 'path';
import type { ProductInput } from '../core/generator';
import type { Feature } from '../core/generator';
import type { TechStack } from './tech-stack-parser';

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

  validate(config: any): ScaffelConfig {
    if (!config.product || !config.product.name) {
      throw new Error('Config must have a product with a name');
    }

    return config as ScaffelConfig;
  }

  mergeWithCLI(config: ScaffelConfig, cliArgs: {
    product?: string;
    features?: string;
    techStack?: string;
  }): ScaffelConfig {
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

