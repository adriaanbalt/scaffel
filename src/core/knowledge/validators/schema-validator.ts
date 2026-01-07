/**
 * Schema validator for feature knowledge entries
 *
 * Validates feature knowledge data against a strict schema to ensure
 * data integrity and prevent security issues.
 */

import { z } from 'zod';
import type { FeatureKnowledge } from '../types';

// Zod schema for FeatureKnowledge validation
const FeatureKnowledgeSchema = z.object({
  name: z
    .string()
    .min(1, 'Feature name must not be empty')
    .max(100, 'Feature name must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Feature name must contain only lowercase letters, numbers, and hyphens'
    ),
  aliases: z
    .array(z.string().min(1).max(100))
    .min(0, 'Aliases array must not be empty (can be empty array)')
    .max(20, 'Too many aliases (max 20)'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(['foundation', 'core', 'advanced', 'integration', 'optimization']),
  commonDependencies: z.array(z.string().min(1).max(100)).max(20, 'Too many dependencies (max 20)'),
  estimatedTime: z.object({
    days: z.number().int().min(0).max(365, 'Days must be reasonable (max 365)'),
    weeks: z.number().int().min(0).max(52, 'Weeks must be reasonable (max 52)'),
  }),
  checklistSections: z
    .array(z.string().min(1).max(100))
    .min(1, 'Must have at least one checklist section')
    .max(30, 'Too many checklist sections (max 30)'),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class SchemaValidator {
  /**
   * Validate a single feature knowledge entry
   */
  validate(feature: unknown): ValidationResult {
    const result = FeatureKnowledgeSchema.safeParse(feature);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join('.')}: ${issue.message}`);
      });
      return { valid: false, errors, warnings };
    }

    // Additional business logic validations
    const validated = result.data;

    // Validate that weeks and days are consistent
    const calculatedWeeks = Math.ceil(validated.estimatedTime.days / 5);
    if (Math.abs(validated.estimatedTime.weeks - calculatedWeeks) > 2) {
      warnings.push(
        `Estimated weeks (${validated.estimatedTime.weeks}) doesn't match calculated weeks from days (${calculatedWeeks})`
      );
    }

    // Validate that aliases don't duplicate the name
    if (validated.aliases.includes(validated.name)) {
      warnings.push('Aliases array contains the feature name itself');
    }

    // Validate that dependencies reference valid feature names
    validated.commonDependencies.forEach((dep) => {
      if (!/^[a-z0-9-]+$/.test(dep)) {
        errors.push(`Invalid dependency name format: ${dep}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate multiple feature knowledge entries
   */
  validateBatch(features: unknown[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    features.forEach((feature, index) => {
      const result = this.validate(feature);
      if (!result.valid) {
        errors.push(`Feature at index ${index}: ${result.errors.join(', ')}`);
      }
      warnings.push(...result.warnings.map((w) => `Feature at index ${index}: ${w}`));
    });

    // Check for duplicate names
    const names = new Set<string>();
    features.forEach((feature, index) => {
      if (this.validate(feature).valid) {
        const validated = FeatureKnowledgeSchema.parse(feature);
        if (names.has(validated.name)) {
          errors.push(`Duplicate feature name: ${validated.name} (at index ${index})`);
        }
        names.add(validated.name);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize feature knowledge entry (remove potentially dangerous content)
   */
  sanitize(feature: FeatureKnowledge): FeatureKnowledge {
    return {
      ...feature,
      name: feature.name.trim().toLowerCase(),
      aliases: feature.aliases
        .map((alias) => alias.trim().toLowerCase())
        .filter((alias) => alias.length > 0),
      description: feature.description.trim(),
      commonDependencies: feature.commonDependencies
        .map((dep) => dep.trim().toLowerCase())
        .filter((dep) => dep.length > 0),
      checklistSections: feature.checklistSections
        .map((section) => section.trim())
        .filter((section) => section.length > 0),
    };
  }
}
