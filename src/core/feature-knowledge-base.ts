/**
 * Feature knowledge base - Common features with descriptions and patterns
 *
 * Refactored to use provider-based architecture for extensibility and maintainability.
 * Supports loading from JSON files, databases, APIs, or other sources.
 */

import type { FeatureKnowledge } from './knowledge/types';
import type { KnowledgeProvider } from './knowledge/providers/knowledge-provider';
import { JsonProvider } from './knowledge/providers/json-provider';
import { SchemaValidator } from './knowledge/validators/schema-validator';
import { DependencyValidator } from './knowledge/validators/dependency-validator';
import { KnowledgeBaseError, ValidationError } from './errors';
import path from 'path';

export type { FeatureKnowledge };

export class FeatureKnowledgeBase {
  private knowledge: Map<string, FeatureKnowledge> = new Map();
  private provider: KnowledgeProvider;
  private schemaValidator: SchemaValidator;
  private dependencyValidator: DependencyValidator;
  private loaded: boolean = false;

  constructor(provider?: KnowledgeProvider) {
    // Default to JSON provider if none specified
    // JsonProvider will resolve the path relative to package root
    this.provider =
      provider ||
      new JsonProvider({
        path: path.join(__dirname, 'knowledge', 'data', 'features.json'),
      });
    this.schemaValidator = new SchemaValidator();
    this.dependencyValidator = new DependencyValidator();
  }

  /**
   * Initialize knowledge base by loading from provider
   * This is called lazily on first access, or can be called explicitly
   */
  async initialize(): Promise<void> {
    if (this.loaded) {
      return;
    }

    try {
      // Check if provider is available
      const available = await this.provider.isAvailable();
      if (!available) {
        throw new KnowledgeBaseError(
          `Knowledge provider is not available: ${this.provider.getName()}`
        );
      }

      // Load features from provider
      const features = await this.provider.load();

      // Validate schema
      const schemaValidation = this.schemaValidator.validateBatch(features);
      if (!schemaValidation.valid) {
        throw new ValidationError(
          'Schema validation failed for knowledge base features',
          schemaValidation.errors
        );
      }

      // Log warnings if any
      if (schemaValidation.warnings.length > 0) {
        // Use dynamic import to avoid circular dependencies
        const { createLogger } = await import('../utils/logger');
        const logger = createLogger('FeatureKnowledgeBase');
        logger.warn('Schema validation warnings', { warnings: schemaValidation.warnings });
      }

      // Sanitize features
      const sanitizedFeatures = features.map((f) => this.schemaValidator.sanitize(f));

      // Validate dependencies
      const dependencyValidation = this.dependencyValidator.validate(sanitizedFeatures);
      if (!dependencyValidation.valid) {
        throw new ValidationError(
          'Dependency validation failed for knowledge base features',
          dependencyValidation.errors
        );
      }

      // Log warnings if any
      if (dependencyValidation.warnings.length > 0) {
        // Use dynamic import to avoid circular dependencies
        const { createLogger } = await import('../utils/logger');
        const logger = createLogger('FeatureKnowledgeBase');
        logger.warn('Dependency validation warnings', { warnings: dependencyValidation.warnings });
      }

      // Index by name and aliases
      this.indexFeatures(sanitizedFeatures);
      this.loaded = true;
    } catch (error) {
      if (error instanceof KnowledgeBaseError || error instanceof ValidationError) {
        throw error;
      }
      throw new KnowledgeBaseError(
        `Failed to initialize knowledge base: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Ensure knowledge is loaded (lazy initialization)
   */
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.initialize();
    }
  }

  /**
   * Index features by name and aliases
   */
  private indexFeatures(features: FeatureKnowledge[]): void {
    this.knowledge.clear();

    for (const feature of features) {
      // Index by canonical name
      this.knowledge.set(feature.name.toLowerCase(), feature);

      // Index by aliases
      for (const alias of feature.aliases) {
        this.knowledge.set(alias.toLowerCase(), feature);
      }
    }
  }

  /**
   * Get feature knowledge by name (supports aliases)
   * @param featureName Feature name or alias
   * @returns Feature knowledge or null if not found
   */
  async getFeatureKnowledge(featureName: string): Promise<FeatureKnowledge | null> {
    await this.ensureLoaded();
    const normalized = featureName.toLowerCase().trim();
    return this.knowledge.get(normalized) || null;
  }

  /**
   * Synchronous version for backward compatibility
   * Note: Will throw if knowledge hasn't been loaded yet
   */
  getFeatureKnowledgeSync(featureName: string): FeatureKnowledge | null {
    if (!this.loaded) {
      throw new Error(
        'Knowledge base not loaded. Call initialize() first or use getFeatureKnowledge() (async).'
      );
    }
    const normalized = featureName.toLowerCase().trim();
    return this.knowledge.get(normalized) || null;
  }

  /**
   * Enrich a feature with knowledge from the knowledge base
   */
  async enrichFeature(feature: {
    id: string;
    name: string;
    description?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low' | string;
    dependencies?: string[];
    estimatedTime?: { days: number; weeks: number };
  }): Promise<{
    id: string;
    name: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    dependencies: string[];
    estimatedTime: { days: number; weeks: number };
    category: string;
    checklistSections: string[];
  }> {
    await this.ensureLoaded();
    const knowledge = await this.getFeatureKnowledge(feature.name);

    return {
      id: feature.id,
      name: feature.name,
      description:
        feature.description ||
        knowledge?.description ||
        `Implementation of ${feature.name} feature.`,
      priority:
        (feature.priority as 'critical' | 'high' | 'medium' | 'low') ||
        (knowledge?.category === 'foundation' ? 'critical' : 'medium'),
      dependencies: feature.dependencies || knowledge?.commonDependencies || [],
      estimatedTime: feature.estimatedTime || knowledge?.estimatedTime || { days: 5, weeks: 1 },
      category: knowledge?.category || 'core',
      checklistSections: knowledge?.checklistSections || [
        'Prerequisites',
        'Implementation',
        'Testing',
      ],
    };
  }

  /**
   * Synchronous version for backward compatibility
   */
  enrichFeatureSync(feature: {
    id: string;
    name: string;
    description?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low' | string;
    dependencies?: string[];
    estimatedTime?: { days: number; weeks: number };
  }): {
    id: string;
    name: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    dependencies: string[];
    estimatedTime: { days: number; weeks: number };
    category: string;
    checklistSections: string[];
  } {
    if (!this.loaded) {
      throw new Error(
        'Knowledge base not loaded. Call initialize() first or use enrichFeature() (async).'
      );
    }
    const knowledge = this.getFeatureKnowledgeSync(feature.name);

    return {
      id: feature.id,
      name: feature.name,
      description:
        feature.description ||
        knowledge?.description ||
        `Implementation of ${feature.name} feature.`,
      priority:
        (feature.priority as 'critical' | 'high' | 'medium' | 'low') ||
        (knowledge?.category === 'foundation' ? 'critical' : 'medium'),
      dependencies: feature.dependencies || knowledge?.commonDependencies || [],
      estimatedTime: feature.estimatedTime || knowledge?.estimatedTime || { days: 5, weeks: 1 },
      category: knowledge?.category || 'core',
      checklistSections: knowledge?.checklistSections || [
        'Prerequisites',
        'Implementation',
        'Testing',
      ],
    };
  }

  /**
   * Get all features (deduplicated by name)
   */
  async getAllFeatures(): Promise<FeatureKnowledge[]> {
    await this.ensureLoaded();
    const seen = new Set<string>();
    const features: FeatureKnowledge[] = [];

    for (const [, feature] of this.knowledge.entries()) {
      if (!seen.has(feature.name)) {
        seen.add(feature.name);
        features.push(feature);
      }
    }

    return features;
  }

  /**
   * Synchronous version for backward compatibility
   */
  getAllFeaturesSync(): FeatureKnowledge[] {
    if (!this.loaded) {
      throw new Error(
        'Knowledge base not loaded. Call initialize() first or use getAllFeatures() (async).'
      );
    }
    const seen = new Set<string>();
    const features: FeatureKnowledge[] = [];

    for (const [, feature] of this.knowledge.entries()) {
      if (!seen.has(feature.name)) {
        seen.add(feature.name);
        features.push(feature);
      }
    }

    return features;
  }

  /**
   * Reload knowledge from provider (useful for hot-reloading in development)
   */
  async reload(): Promise<void> {
    this.loaded = false;
    await this.initialize();
  }
}
