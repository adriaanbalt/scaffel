import { describe, it, expect } from 'vitest';
import { BaseChecklistGenerator } from '../../../src/core/checklist/base-generator';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../../../src/core/checklist/types';

// Concrete implementation for testing
class TestGenerator extends BaseChecklistGenerator {
  generate(): DetailedChecklistItem[] {
    return [
      this.createItem('Test item'),
      this.createItem('Nested item', [
        this.createItem('Sub item 1'),
        this.createItem('Sub item 2'),
      ]),
      this.createItem('Tech stack item', undefined, true),
    ];
  }
}

describe('BaseChecklistGenerator', () => {
  let generator: TestGenerator;
  const mockFeature: EnrichedFeature = {
    id: 'test-feature',
    name: 'Test Feature',
    category: 'test',
    priority: 'high',
    estimatedTime: { days: 5 },
  };

  beforeEach(() => {
    generator = new TestGenerator();
  });

  describe('createItem', () => {
    it('should create a simple checklist item', () => {
      const item = generator['createItem']('Test item');

      expect(item.text).toBe('Test item');
      expect(item.subItems).toBeUndefined();
      expect(item.techStackSpecific).toBeUndefined();
    });

    it('should create an item with sub-items', () => {
      const subItems: DetailedChecklistItem[] = [{ text: 'Sub 1' }, { text: 'Sub 2' }];
      const item = generator['createItem']('Parent', subItems);

      expect(item.text).toBe('Parent');
      expect(item.subItems).toEqual(subItems);
    });

    it('should create an item with tech stack flag', () => {
      const item = generator['createItem']('Tech item', undefined, true);

      expect(item.text).toBe('Tech item');
      expect(item.techStackSpecific).toBe(true);
    });
  });

  describe('createNestedItem', () => {
    it('should create a nested item', () => {
      const subItems: DetailedChecklistItem[] = [{ text: 'Sub 1' }, { text: 'Sub 2' }];
      const item = generator['createNestedItem']('Parent', subItems);

      expect(item.text).toBe('Parent');
      expect(item.subItems).toEqual(subItems);
    });
  });

  describe('isCategory', () => {
    it('should return true when feature category matches', () => {
      const result = generator['isCategory'](mockFeature, 'test');
      expect(result).toBe(true);
    });

    it('should return false when feature category does not match', () => {
      const result = generator['isCategory'](mockFeature, 'other');
      expect(result).toBe(false);
    });
  });

  describe('getTechStackIndicator', () => {
    it('should return emoji when tech stack is provided', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };
      const result = generator['getTechStackIndicator'](techStack);
      expect(result).toBe('🔧');
    });

    it('should return empty string when tech stack is not provided', () => {
      const result = generator['getTechStackIndicator']();
      expect(result).toBe('');
    });
  });

  describe('generate', () => {
    it('should generate checklist items', () => {
      const items = generator.generate(mockFeature, 'test');

      expect(items).toHaveLength(3);
      expect(items[0].text).toBe('Test item');
      expect(items[1].text).toBe('Nested item');
      expect(items[1].subItems).toHaveLength(2);
      expect(items[2].techStackSpecific).toBe(true);
    });
  });
});
