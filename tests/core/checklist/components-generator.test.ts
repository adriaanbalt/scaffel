import { describe, it, expect } from 'vitest';
import { ComponentsGenerator } from '../../../src/core/checklist/generators/components-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('ComponentsGenerator', () => {
  let generator: ComponentsGenerator;

  beforeEach(() => {
    generator = new ComponentsGenerator();
  });

  describe('generate', () => {
    it('should generate authentication components', () => {
      const feature: EnrichedFeature = {
        id: 'auth',
        name: 'Authentication',
        category: 'foundation',
        priority: 'high',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'foundation');

      const authItems = items.find((item) => item.text.includes('Authentication components'));
      expect(authItems).toBeDefined();
      expect(authItems?.subItems).toBeDefined();
      expect(authItems?.subItems?.some((item) => item.text.includes('LoginForm'))).toBe(true);
      expect(authItems?.subItems?.some((item) => item.text.includes('SignupForm'))).toBe(true);
      expect(authItems?.subItems?.some((item) => item.text.includes('AuthProvider'))).toBe(true);
    });

    it('should generate payment components', () => {
      const feature: EnrichedFeature = {
        id: 'payment',
        name: 'Payment Processing',
        category: 'feature',
        priority: 'high',
        estimatedTime: { days: 7 },
      };

      const items = generator.generate(feature, 'feature');

      const paymentItems = items.find((item) => item.text.includes('Payment components'));
      expect(paymentItems).toBeDefined();
      expect(paymentItems?.subItems).toBeDefined();
      expect(paymentItems?.subItems?.some((item) => item.text.includes('SubscriptionForm'))).toBe(
        true
      );
    });

    it('should generate generic components for other features', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const genericItems = items.find((item) => item.text.includes('Test Feature components'));
      expect(genericItems).toBeDefined();
      expect(genericItems?.subItems).toBeDefined();
      expect(genericItems?.subItems?.some((item) => item.text.includes('List'))).toBe(true);
      expect(genericItems?.subItems?.some((item) => item.text.includes('Form'))).toBe(true);
    });

    it('should include common component structure items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 3 },
      };

      const items = generator.generate(feature, 'feature');

      const structureItems = items.find((item) => item.text.includes('Component structure'));
      expect(structureItems).toBeDefined();
      expect(structureItems?.subItems).toBeDefined();
      expect(
        structureItems?.subItems?.some((item) => item.text.includes('TypeScript interfaces'))
      ).toBe(true);
      expect(structureItems?.subItems?.some((item) => item.text.includes('loading states'))).toBe(
        true
      );
      expect(structureItems?.subItems?.some((item) => item.text.includes('error states'))).toBe(
        true
      );
    });

    it('should include React patterns when framework is nextjs', () => {
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

      const reactItems = items.find((item) => item.text.includes('React patterns'));
      expect(reactItems).toBeDefined();
      expect(reactItems?.subItems).toBeDefined();
      const allSubItems = reactItems?.subItems || [];
      expect(allSubItems.every((item) => item.techStackSpecific)).toBe(true);
    });

    it('should include React patterns when framework is react', () => {
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

      const reactItems = items.find((item) => item.text.includes('React patterns'));
      expect(reactItems).toBeDefined();
    });

    it('should include Tailwind styling items when styling is tailwind', () => {
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
        styling: 'tailwind',
      };

      const items = generator.generate(feature, 'feature', techStack);

      const stylingItems = items.find((item) => item.text.includes('Styling'));
      expect(stylingItems).toBeDefined();
      expect(stylingItems?.subItems).toBeDefined();
      const allSubItems = stylingItems?.subItems || [];
      expect(allSubItems.every((item) => item.techStackSpecific)).toBe(true);
      expect(allSubItems.some((item) => item.text.includes('Tailwind utility classes'))).toBe(true);
    });
  });
});
