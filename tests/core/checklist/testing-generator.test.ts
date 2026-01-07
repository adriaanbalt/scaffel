import { describe, it, expect } from 'vitest';
import { TestingGenerator } from '../../../src/core/checklist/generators/testing-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('TestingGenerator', () => {
  let generator: TestingGenerator;

  beforeEach(() => {
    generator = new TestingGenerator();
  });

  describe('generate', () => {
    it('should generate unit test items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const unitItems = items.find((item) => item.text.includes('Unit tests'));
      expect(unitItems).toBeDefined();
      expect(unitItems?.subItems).toBeDefined();
      expect(unitItems?.subItems?.some((item) => item.text.includes('service methods'))).toBe(true);
    });

    it('should generate integration test items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const integrationItems = items.find((item) => item.text.includes('Integration tests'));
      expect(integrationItems).toBeDefined();
      expect(integrationItems?.subItems).toBeDefined();
      expect(integrationItems?.subItems?.some((item) => item.text.includes('API endpoints'))).toBe(
        true
      );
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

      const items = generator.generate(feature, 'feature', techStack);

      const componentItems = items.find((item) => item.text.includes('Component tests'));
      expect(componentItems).toBeDefined();
      expect(componentItems?.subItems).toBeDefined();
      const allSubItems = componentItems?.subItems || [];
      expect(allSubItems.every((item) => item.techStackSpecific)).toBe(true);
    });

    it('should include component tests when framework is react', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };
      const techStack: TechStack = {
        framework: 'react',
        backend: 'node',
        database: 'postgresql',
      };

      const items = generator.generate(feature, 'feature', techStack);

      const componentItems = items.find((item) => item.text.includes('Component tests'));
      expect(componentItems).toBeDefined();
    });

    it('should generate end-to-end test items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const e2eItems = items.find((item) => item.text.includes('End-to-end tests'));
      expect(e2eItems).toBeDefined();
      expect(e2eItems?.subItems).toBeDefined();
    });

    it('should include security tests for foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const securityItems = items.find((item) => item.text.includes('Security tests'));
      expect(securityItems).toBeDefined();
      expect(securityItems?.subItems).toBeDefined();
      expect(securityItems?.subItems?.some((item) => item.text.includes('SQL injection'))).toBe(
        true
      );
    });

    it('should include performance tests for foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const perfItems = items.find((item) => item.text.includes('Performance tests'));
      expect(perfItems).toBeDefined();
      expect(perfItems?.subItems).toBeDefined();
    });

    it('should not include security or performance tests for regular features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const securityItems = items.find((item) => item.text.includes('Security tests'));
      const perfItems = items.find((item) => item.text.includes('Performance tests'));
      expect(securityItems).toBeUndefined();
      expect(perfItems).toBeUndefined();
    });
  });
});
