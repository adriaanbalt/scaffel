import { describe, it, expect } from 'vitest';
import { DatabaseGenerator } from '../../../src/core/checklist/generators/database-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('DatabaseGenerator', () => {
  let generator: DatabaseGenerator;

  beforeEach(() => {
    generator = new DatabaseGenerator();
  });

  describe('generate', () => {
    it('should generate authentication database schema', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const authItems = items.find((item) => item.text.includes('authentication tables'));
      expect(authItems).toBeDefined();
      expect(authItems?.subItems).toBeDefined();
      expect(authItems?.subItems?.some((item) => item.text.includes('users table'))).toBe(true);
    });

    it('should generate payment database schema', () => {
      const feature: EnrichedFeature = {
        id: 'payment',
        name: 'Payment Processing',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 7 },
      };

      const items = generator.generate(feature, 'feature');

      const paymentItems = items.find((item) => item.text.includes('payment tables'));
      expect(paymentItems).toBeDefined();
      expect(paymentItems?.subItems).toBeDefined();
      expect(
        paymentItems?.subItems?.some((item) => item.text.includes('subscriptions table'))
      ).toBe(true);
    });

    it('should generate user profile database schema', () => {
      const feature: EnrichedFeature = {
        id: 'users',
        name: 'User Management',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const userItems = items.find((item) => item.text.includes('user profile tables'));
      expect(userItems).toBeDefined();
      expect(userItems?.subItems).toBeDefined();
    });

    it('should include standard database items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((item) => item.text.includes('table'))).toBe(true);
    });

    it('should include Supabase-specific items when backend is supabase', () => {
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

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const supabaseItems = allItems.filter(
        (item) => item.techStackSpecific && item.text.toLowerCase().includes('supabase')
      );

      expect(supabaseItems.length).toBeGreaterThan(0);
    });
  });
});
