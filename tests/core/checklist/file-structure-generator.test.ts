import { describe, it, expect } from 'vitest';
import { FileStructureGenerator } from '../../../src/core/checklist/generators/file-structure-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('FileStructureGenerator', () => {
  let generator: FileStructureGenerator;

  beforeEach(() => {
    generator = new FileStructureGenerator();
  });

  describe('generate', () => {
    it('should generate Next.js auth file structure', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const structure = generator.generate(feature, techStack);

      expect(structure).toBeDefined();
      expect(structure).toContain('app/');
      expect(structure).toContain('api/');
      expect(structure).toContain('auth/');
      expect(structure).toContain('route.ts');
      expect(structure).toContain('page.tsx');
    });

    it('should generate Next.js payment file structure', () => {
      const feature: EnrichedFeature = {
        id: 'payment',
        name: 'Payment Processing',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 7 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const structure = generator.generate(feature, techStack);

      expect(structure).toBeDefined();
      expect(structure).toContain('app/');
      expect(structure).toContain('payments/');
      expect(structure).toContain('api/payments/');
    });

    it('should generate Next.js generic file structure', () => {
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

      const structure = generator.generate(feature, techStack);

      expect(structure).toBeDefined();
      expect(structure).toContain('app/');
      expect(structure).toContain('test-feature/');
      expect(structure).toContain('api/test-feature/');
    });

    it('should generate generic file structure for non-Next.js', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };
      const techStack: TechStack = {
        framework: 'express',
        backend: 'node',
        database: 'postgresql',
      };

      const structure = generator.generate(feature, techStack);

      expect(structure).toBeDefined();
      expect(structure).toContain('src/');
      expect(structure).toContain('api/');
      expect(structure).toContain('services/');
      expect(structure).toContain('components/');
    });

    it('should handle feature names with special characters', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature!',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const structure = generator.generate(feature, techStack);

      expect(structure).toBeDefined();
      // Should sanitize special characters
      expect(structure).not.toContain('!');
    });

    it('should return undefined when no tech stack provided', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const structure = generator.generate(feature);

      // Should return generic structure
      expect(structure).toBeDefined();
      expect(structure).toContain('src/');
    });
  });
});
