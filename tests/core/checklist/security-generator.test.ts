import { describe, it, expect } from 'vitest';
import { SecurityGenerator } from '../../../src/core/checklist/generators/security-generator';
import type { EnrichedFeature } from '../../../src/core/generator';

describe('SecurityGenerator', () => {
  let generator: SecurityGenerator;

  beforeEach(() => {
    generator = new SecurityGenerator();
  });

  describe('generate', () => {
    it('should generate input validation items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const validationItems = items.find((item) => item.text.includes('Input validation'));
      expect(validationItems).toBeDefined();
      expect(validationItems?.subItems).toBeDefined();
      expect(
        validationItems?.subItems?.some((item) => item.text.includes('Validate all user inputs'))
      ).toBe(true);
    });

    it('should generate authorization items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const authItems = items.find((item) => item.text.includes('Authorization'));
      expect(authItems).toBeDefined();
      expect(authItems?.subItems).toBeDefined();
      expect(
        authItems?.subItems?.some((item) => item.text.includes('Check user permissions'))
      ).toBe(true);
    });

    it('should generate rate limiting items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const rateLimitItems = items.find((item) => item.text.includes('Rate limiting'));
      expect(rateLimitItems).toBeDefined();
      expect(rateLimitItems?.subItems).toBeDefined();
      expect(rateLimitItems?.subItems?.some((item) => item.text.includes('429 status'))).toBe(true);
    });

    it('should include security hardening for foundation features', () => {
      const feature: EnrichedFeature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const hardeningItems = items.find((item) => item.text.includes('Security hardening'));
      expect(hardeningItems).toBeDefined();
      expect(hardeningItems?.subItems).toBeDefined();
      expect(hardeningItems?.subItems?.some((item) => item.text.includes('CSRF protection'))).toBe(
        true
      );
    });

    it('should include security hardening for auth features', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const hardeningItems = items.find((item) => item.text.includes('Security hardening'));
      expect(hardeningItems).toBeDefined();
      expect(hardeningItems?.subItems).toBeDefined();
    });

    it('should not include security hardening for regular features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const hardeningItems = items.find((item) => item.text.includes('Security hardening'));
      expect(hardeningItems).toBeUndefined();
    });
  });
});
