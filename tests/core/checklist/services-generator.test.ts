import { describe, it, expect } from 'vitest';
import { ServicesGenerator } from '../../../src/core/checklist/generators/services-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('ServicesGenerator', () => {
  let generator: ServicesGenerator;

  beforeEach(() => {
    generator = new ServicesGenerator();
  });

  describe('generate', () => {
    it('should generate service class creation items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const serviceItems = items.find((item) => item.text.includes('TestFeatureService'));
      expect(serviceItems).toBeDefined();
      expect(serviceItems?.subItems).toBeDefined();
    });

    it('should include file creation item', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const fileItem = allItems.find((item) =>
        item.text.includes('lib/services/test-feature-service.ts')
      );
      expect(fileItem).toBeDefined();
    });

    it('should include getAll method implementation', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const getAllItem = allItems.find((item) => item.text.includes('Implement getAll method'));
      expect(getAllItem).toBeDefined();
      expect(getAllItem?.subItems).toBeDefined();
      expect(getAllItem?.subItems?.some((item) => item.text.includes('filter'))).toBe(true);
      expect(getAllItem?.subItems?.some((item) => item.text.includes('pagination'))).toBe(true);
    });

    it('should include getById method implementation', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const getByIdItem = allItems.find((item) => item.text.includes('Implement getById method'));
      expect(getByIdItem).toBeDefined();
      expect(getByIdItem?.subItems).toBeDefined();
    });

    it('should include create method implementation', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const createItem = allItems.find((item) => item.text.includes('Implement create method'));
      expect(createItem).toBeDefined();
      expect(createItem?.subItems).toBeDefined();
      expect(createItem?.subItems?.some((item) => item.text.includes('Zod schema'))).toBe(true);
    });

    it('should include update method implementation', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const updateItem = allItems.find((item) => item.text.includes('Implement update method'));
      expect(updateItem).toBeDefined();
      expect(updateItem?.subItems).toBeDefined();
    });

    it('should include delete method implementation', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const deleteItem = allItems.find((item) => item.text.includes('Implement delete method'));
      expect(deleteItem).toBeDefined();
      expect(deleteItem?.subItems).toBeDefined();
      expect(deleteItem?.subItems?.some((item) => item.text.includes('Soft delete'))).toBe(true);
    });

    it('should include logging items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const loggingItem = allItems.find((item) => item.text.includes('Add logging to all methods'));
      expect(loggingItem).toBeDefined();
      expect(loggingItem?.subItems).toBeDefined();
    });

    it('should include error handling items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const allItems = items.flatMap((item) => [item, ...(item.subItems || [])]);
      const errorItem = allItems.find((item) =>
        item.text.includes('Add error handling to all methods')
      );
      expect(errorItem).toBeDefined();
      expect(errorItem?.subItems).toBeDefined();
    });

    it('should include Supabase integration items when backend is supabase', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const items = generator.generate(feature, 'feature', techStack);

      const supabaseItems = items.find((item) => item.text.includes('Supabase integration'));
      expect(supabaseItems).toBeDefined();
      expect(supabaseItems?.subItems).toBeDefined();
      const allSubItems = supabaseItems?.subItems || [];
      expect(allSubItems.every((item) => item.techStackSpecific)).toBe(true);
    });

    it('should include caching strategy items', () => {
      const feature: EnrichedFeature = {
        id: 'test',
        name: 'Test Feature',
        category: 'feature',
        priority: 'medium',
        estimatedTime: { days: 5 },
      };

      const items = generator.generate(feature, 'feature');

      const cacheItems = items.find((item) => item.text.includes('Caching strategy'));
      expect(cacheItems).toBeDefined();
      expect(cacheItems?.subItems).toBeDefined();
    });
  });
});
