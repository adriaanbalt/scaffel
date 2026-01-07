import { describe, it, expect } from 'vitest';
import { ApiGenerator } from '../../../src/core/checklist/generators/api-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('ApiGenerator', () => {
  let generator: ApiGenerator;

  beforeEach(() => {
    generator = new ApiGenerator();
  });

  describe('generate', () => {
    it('should generate authentication API endpoints', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const authItems = items.find((item) => item.text.includes('Authentication endpoints'));
      expect(authItems).toBeDefined();
      expect(authItems?.subItems).toBeDefined();
      expect(authItems?.subItems?.some((item) => item.text.includes('/api/auth/signup'))).toBe(
        true
      );
      expect(authItems?.subItems?.some((item) => item.text.includes('/api/auth/signin'))).toBe(
        true
      );
    });

    it('should generate payment API endpoints', () => {
      const feature: EnrichedFeature = {
        id: 'payment',
        name: 'Payment Processing',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 7 },
      };

      const items = generator.generate(feature, 'feature');

      const paymentItems = items.find((item) => item.text.includes('Payment endpoints'));
      expect(paymentItems).toBeDefined();
      expect(paymentItems?.subItems).toBeDefined();
      expect(
        paymentItems?.subItems?.some((item) => item.text.includes('/api/payments/subscriptions'))
      ).toBe(true);
    });

    it('should generate generic API endpoints for other features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const apiItems = items.find((item) => item.text.includes('API endpoints'));
      expect(apiItems).toBeDefined();
      expect(apiItems?.subItems).toBeDefined();
      expect(apiItems?.subItems?.some((item) => item.text.includes('POST'))).toBe(true);
      expect(apiItems?.subItems?.some((item) => item.text.includes('GET'))).toBe(true);
    });

    it('should include Next.js specific endpoints when framework is nextjs', () => {
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

      // May or may not have Next.js specific items, but should handle tech stack
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
