import { describe, it, expect } from 'vitest';
import { PrerequisitesGenerator } from '../../../src/core/checklist/generators/prerequisites-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('PrerequisitesGenerator', () => {
  let generator: PrerequisitesGenerator;

  beforeEach(() => {
    generator = new PrerequisitesGenerator();
  });

  describe('generate', () => {
    it('should generate foundation prerequisites', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((item) => item.text.includes('Project structure'))).toBe(true);
      expect(items.some((item) => item.text.includes('Development environment'))).toBe(true);
    });

    it('should include Next.js specific prerequisites when framework is nextjs', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const items = generator.generate(feature, 'foundation', techStack);

      const nextjsItems = items.filter(
        (item) => item.techStackSpecific && item.text.includes('Next.js')
      );
      expect(nextjsItems.length).toBeGreaterThan(0);
    });

    it('should include database prerequisites', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const dbItems = items.find((item) => item.text.includes('Database configured'));
      expect(dbItems).toBeDefined();
      expect(dbItems?.subItems).toBeDefined();
      expect(dbItems?.subItems?.length).toBeGreaterThan(0);
    });

    it('should include Supabase specific prerequisites when backend is supabase', () => {
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

      const supabaseItems = items
        .flatMap((item) => item.subItems || [])
        .filter((item) => item.techStackSpecific && item.text.includes('Supabase'));

      expect(supabaseItems.length).toBeGreaterThan(0);
    });

    it('should include error handling prerequisites', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const errorItems = items.find((item) => item.text.includes('Error handling system'));
      expect(errorItems).toBeDefined();
      expect(errorItems?.subItems).toBeDefined();
    });

    it('should include authentication prerequisites for non-foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const authItems = items.filter((item) => item.text.includes('Authentication system'));
      expect(authItems.length).toBeGreaterThan(0);
    });

    it('should include dependency prerequisites when feature has dependencies', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
        dependencies: ['auth', 'users'],
      };

      const items = generator.generate(feature, 'feature');

      const depItems = items.find((item) => item.text.includes('Dependencies completed'));
      expect(depItems).toBeDefined();
      expect(depItems?.text).toContain('auth');
      expect(depItems?.text).toContain('users');
    });

    it('should include payment prerequisites for payment features', () => {
      const feature: EnrichedFeature = {
        id: 'payment',
        name: 'Payment Processing',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 7 },
      };

      const items = generator.generate(feature, 'feature');

      const paymentItems = items.find((item) => item.text.includes('Payment provider configured'));
      expect(paymentItems).toBeDefined();
      expect(paymentItems?.subItems).toBeDefined();
      expect(paymentItems?.subItems?.some((item) => item.text.includes('Stripe'))).toBe(true);
    });

    it('should include file upload prerequisites for file upload features', () => {
      const feature: EnrichedFeature = {
        id: 'upload',
        name: 'File Upload',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const uploadItems = items.find((item) => item.text.includes('Storage provider configured'));
      expect(uploadItems).toBeDefined();
      expect(uploadItems?.subItems).toBeDefined();
    });
  });
});
