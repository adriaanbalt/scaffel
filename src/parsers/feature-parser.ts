/**
 * Feature list parser
 */

import type { Feature } from '../core/generator';

export class FeatureParser {
  parse(features: string[] | Feature[]): Feature[] {
    if (features.length === 0) {
      return [];
    }

    // If already Feature objects, return as-is
    if (typeof features[0] === 'object' && 'id' in features[0]) {
      return features as Feature[];
    }

    // Parse string array into Feature objects
    return (features as string[]).map((name, index) => ({
      id: this.generateId(name, index),
      name: name.trim(),
      priority: 'medium' as const,
      dependencies: [],
    }));
  }

  parseFromString(featureString: string): Feature[] {
    const features = featureString.split(',').map((f) => f.trim()).filter(Boolean);
    return this.parse(features);
  }

  private generateId(name: string, index: number): string {
    return name.toLowerCase().replace(/\s+/g, '-') || `feature-${index}`;
  }

  validate(features: Feature[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const ids = new Set<string>();

    for (const feature of features) {
      if (!feature.id || feature.id.trim().length === 0) {
        errors.push(`Feature "${feature.name}" has no ID`);
      }

      if (ids.has(feature.id)) {
        errors.push(`Duplicate feature ID: ${feature.id}`);
      }

      ids.add(feature.id);

      if (!feature.name || feature.name.trim().length === 0) {
        errors.push(`Feature with ID "${feature.id}" has no name`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

