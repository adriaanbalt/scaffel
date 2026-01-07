import { describe, it, expect } from 'vitest';
import { CheckpointsGenerator } from '../../../src/core/checklist/generators/checkpoints-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('CheckpointsGenerator', () => {
  let generator: CheckpointsGenerator;

  beforeEach(() => {
    generator = new CheckpointsGenerator();
  });

  describe('generateSecurity', () => {
    it('should generate security checkpoint items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generateSecurity(feature, 'feature');

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((item) => item.text.includes('Input validation'))).toBe(true);
      expect(items.some((item) => item.text.includes('Authentication & Authorization'))).toBe(true);
    });

    it('should include security hardening for foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generateSecurity(feature, 'foundation');

      const hardeningItems = items.find((item) => item.text.includes('Security hardening'));
      expect(hardeningItems).toBeDefined();
      expect(hardeningItems?.subItems).toBeDefined();
    });

    it('should include security hardening for auth features', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generateSecurity(feature, 'feature');

      const hardeningItems = items.find((item) => item.text.includes('Security hardening'));
      expect(hardeningItems).toBeDefined();
    });

    it('should include security testing items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generateSecurity(feature, 'feature');

      const testingItems = items.find((item) => item.text.includes('Security testing'));
      expect(testingItems).toBeDefined();
      expect(testingItems?.subItems).toBeDefined();
    });
  });

  describe('generateTesting', () => {
    it('should generate testing checkpoint items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generateTesting(feature, 'feature');

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((item) => item.text.includes('Unit tests'))).toBe(true);
      expect(items.some((item) => item.text.includes('Integration tests'))).toBe(true);
    });

    it('should include component tests when framework is nextjs', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const items = generator.generateTesting(feature, 'feature', techStack);

      const componentItems = items.find((item) => item.text.includes('Component tests'));
      expect(componentItems).toBeDefined();
      expect(componentItems?.subItems).toBeDefined();
      const allSubItems = componentItems?.subItems || [];
      expect(allSubItems.every((item) => item.techStackSpecific)).toBe(true);
    });

    it('should include test coverage items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generateTesting(feature, 'feature');

      const coverageItems = items.find((item) => item.text.includes('Test coverage'));
      expect(coverageItems).toBeDefined();
      expect(coverageItems?.subItems).toBeDefined();
      expect(coverageItems?.subItems?.some((item) => item.text.includes('80%'))).toBe(true);
    });
  });

  describe('generatePerformance', () => {
    it('should generate performance checkpoint items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generatePerformance(feature, 'feature');

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((item) => item.text.includes('API performance'))).toBe(true);
      expect(items.some((item) => item.text.includes('Caching'))).toBe(true);
    });

    it('should include performance testing items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generatePerformance(feature, 'feature');

      const testingItems = items.find((item) => item.text.includes('Performance testing'));
      expect(testingItems).toBeDefined();
      expect(testingItems?.subItems).toBeDefined();
    });

    it('should include resource optimization items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generatePerformance(feature, 'feature');

      const resourceItems = items.find((item) => item.text.includes('Resource optimization'));
      expect(resourceItems).toBeDefined();
      expect(resourceItems?.subItems).toBeDefined();
    });
  });
});
