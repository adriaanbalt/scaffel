import { describe, it, expect } from 'vitest';
import { DeploymentGenerator } from '../../../src/core/checklist/generators/deployment-generator';
import type { EnrichedFeature } from '../../../src/core/generator';

describe('DeploymentGenerator', () => {
  let generator: DeploymentGenerator;

  beforeEach(() => {
    generator = new DeploymentGenerator();
  });

  describe('generate', () => {
    it('should generate environment configuration items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const envItems = items.find((item) => item.text.includes('Environment configuration'));
      expect(envItems).toBeDefined();
      expect(envItems?.subItems).toBeDefined();
      expect(envItems?.subItems?.some((item) => item.text.includes('environment variables'))).toBe(
        true
      );
    });

    it('should generate database migration items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const migrationItems = items.find((item) => item.text.includes('Database migrations'));
      expect(migrationItems).toBeDefined();
      expect(migrationItems?.subItems).toBeDefined();
      expect(migrationItems?.subItems?.some((item) => item.text.includes('staging'))).toBe(true);
    });

    it('should generate feature flag items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const flagItems = items.find((item) => item.text.includes('Feature flags'));
      expect(flagItems).toBeDefined();
      expect(flagItems?.subItems).toBeDefined();
    });

    it('should generate monitoring items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const monitoringItems = items.find((item) => item.text.includes('Monitoring'));
      expect(monitoringItems).toBeDefined();
      expect(monitoringItems?.subItems).toBeDefined();
      expect(monitoringItems?.subItems?.some((item) => item.text.includes('error tracking'))).toBe(
        true
      );
    });

    it('should generate documentation items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const docItems = items.find((item) => item.text.includes('Documentation'));
      expect(docItems).toBeDefined();
      expect(docItems?.subItems).toBeDefined();
    });

    it('should include backup and rollback for foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const backupItems = items.find((item) => item.text.includes('Backup and rollback'));
      expect(backupItems).toBeDefined();
      expect(backupItems?.subItems).toBeDefined();
    });

    it('should include backup and rollback for core features', () => {
      const feature: EnrichedFeature = {
        id: 'core',
        name: 'Core Feature',
        category: 'core',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'core');

      const backupItems = items.find((item) => item.text.includes('Backup and rollback'));
      expect(backupItems).toBeDefined();
    });

    it('should not include backup and rollback for regular features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const backupItems = items.find((item) => item.text.includes('Backup and rollback'));
      expect(backupItems).toBeUndefined();
    });
  });
});
