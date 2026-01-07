/**
 * JSON file provider for feature knowledge
 *
 * Loads feature knowledge from JSON files. Supports:
 * - Single JSON file with array of features
 * - Multiple JSON files in a directory
 * - File system and package-relative paths
 */

import fs from 'fs';
import path from 'path';
import type { FeatureKnowledge } from '../types';
import type { KnowledgeProvider } from './knowledge-provider';

export interface JsonProviderOptions {
  /**
   * Path to JSON file or directory containing JSON files
   */
  path: string;

  /**
   * Whether to recursively search subdirectories
   */
  recursive?: boolean;

  /**
   * Custom file name pattern (default: *.json)
   */
  pattern?: RegExp;
}

export class JsonProvider implements KnowledgeProvider {
  private options: Required<JsonProviderOptions>;

  constructor(options: JsonProviderOptions) {
    this.options = {
      recursive: options.recursive ?? false,
      pattern: options.pattern ?? /\.json$/,
      path: options.path,
    };
  }

  getName(): string {
    return `JsonProvider(${this.options.path})`;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const resolvedPath = this.resolvePath(this.options.path);
      return fs.existsSync(resolvedPath);
    } catch {
      return false;
    }
  }

  async load(): Promise<FeatureKnowledge[]> {
    const resolvedPath = this.resolvePath(this.options.path);
    const stats = fs.statSync(resolvedPath);

    if (stats.isFile()) {
      return this.loadFromFile(resolvedPath);
    } else if (stats.isDirectory()) {
      return this.loadFromDirectory(resolvedPath);
    } else {
      throw new Error(`Path is neither a file nor directory: ${resolvedPath}`);
    }
  }

  private loadFromFile(filePath: string): FeatureKnowledge[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Support both array and single object
      if (Array.isArray(data)) {
        return data;
      } else if (typeof data === 'object' && data !== null) {
        return [data];
      } else {
        throw new Error(`Invalid JSON structure in ${filePath}: expected array or object`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  private loadFromDirectory(dirPath: string): FeatureKnowledge[] {
    const features: FeatureKnowledge[] = [];
    const files = this.getJsonFiles(dirPath);

    for (const file of files) {
      try {
        const fileFeatures = this.loadFromFile(file);
        features.push(...fileFeatures);
      } catch (error) {
        // Log error but continue loading other files
        // Use synchronous import to avoid async issues
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { createLogger } = require('../../../utils/logger');
          const logger = createLogger('JsonProvider');
          logger.warn(`Failed to load ${file}`, {
            error: error instanceof Error ? error.message : String(error),
            file,
          });
        } catch {
          // Fallback to console if logger not available
          console.warn(
            `Failed to load ${file}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    }

    return features;
  }

  private getJsonFiles(dirPath: string): string[] {
    const files: string[] = [];

    const readDir = (currentPath: string): void => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isFile() && this.options.pattern.test(entry.name)) {
          files.push(fullPath);
        } else if (entry.isDirectory() && this.options.recursive) {
          readDir(fullPath);
        }
      }
    };

    readDir(dirPath);
    return files;
  }

  /**
   * Resolve path relative to package root or current working directory
   */
  private resolvePath(inputPath: string): string {
    // If absolute path, use as-is
    if (path.isAbsolute(inputPath)) {
      return inputPath;
    }

    // Try relative to current working directory
    const cwdPath = path.resolve(process.cwd(), inputPath);
    if (fs.existsSync(cwdPath)) {
      return cwdPath;
    }

    // Try relative to package root (where node_modules is)
    const packageRoot = this.findPackageRoot();
    if (packageRoot) {
      const packagePath = path.resolve(packageRoot, inputPath);
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
    }

    // Try relative to source file location (for compiled dist files)
    try {
      // In compiled code, __dirname points to dist/core/knowledge/providers
      // So we go up to dist, then to root, then to the path
      const sourceDir = __dirname;
      const distRoot = path.resolve(sourceDir, '../../..');
      const sourcePath = path.resolve(distRoot, inputPath);
      if (fs.existsSync(sourcePath)) {
        return sourcePath;
      }
    } catch {
      // Ignore errors in path resolution
    }

    // Return the original path (will fail later if doesn't exist)
    return inputPath;
  }

  /**
   * Find package root by looking for package.json
   */
  private findPackageRoot(): string | null {
    let currentDir = process.cwd();

    // Try from current working directory up
    for (let i = 0; i < 10; i++) {
      const packageJsonPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        return currentDir;
      }
      const parent = path.dirname(currentDir);
      if (parent === currentDir) {
        break; // Reached filesystem root
      }
      currentDir = parent;
    }

    // Try from __dirname (for compiled code)
    try {
      let dir = __dirname;
      for (let i = 0; i < 10; i++) {
        const packageJsonPath = path.join(dir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          return dir;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
          break;
        }
        dir = parent;
      }
    } catch {
      // Ignore errors
    }

    return null;
  }
}
