import { describe, it, expect } from 'vitest';
import { ChecklistMarkdownRenderer } from '../../../src/core/checklist/markdown-renderer';
import type {
  DetailedFeatureChecklist,
  DetailedChecklistItem,
} from '../../../src/core/checklist/types';
import type { EnrichedFeature } from '../../../src/core/generator';
import type { TechStack } from '../../../src/parsers/tech-stack-parser';

describe('ChecklistMarkdownRenderer', () => {
  let renderer: ChecklistMarkdownRenderer;
  const mockFeature: EnrichedFeature = {
    id: 'test-feature',
    name: 'Test Feature',
    category: 'test',
    priority: 'high',
    estimatedTime: { days: 5 },
    description: 'A test feature description',
    dependencies: ['auth'],
  };

  beforeEach(() => {
    renderer = new ChecklistMarkdownRenderer();
  });

  describe('render', () => {
    it('should render basic checklist with feature information', () => {
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [],
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('# Test Feature Implementation Checklist');
      expect(markdown).toContain('**Feature:** Test Feature');
      expect(markdown).toContain('**Category:** test');
      expect(markdown).toContain('**Estimated Time:** 5 days');
      expect(markdown).toContain('**Priority:** high');
      expect(markdown).toContain('A test feature description');
      expect(markdown).toContain('**Depends On:** auth');
    });

    it('should render prerequisites section', () => {
      const prerequisites: DetailedChecklistItem[] = [
        { text: 'Prerequisite 1' },
        { text: 'Prerequisite 2' },
      ];
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites,
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('## Prerequisites');
      expect(markdown).toContain('- [ ] Prerequisite 1');
      expect(markdown).toContain('- [ ] Prerequisite 2');
    });

    it('should render file structure section', () => {
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [],
        fileStructure: 'app/\n  test/\n    page.tsx',
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('## Code Structure');
      expect(markdown).toContain('### Expected File Structure');
      expect(markdown).toContain('```');
      expect(markdown).toContain('app/');
      expect(markdown).toContain('test/');
    });

    it('should render nested checklist items', () => {
      const prerequisites: DetailedChecklistItem[] = [
        {
          text: 'Parent Item',
          subItems: [{ text: 'Child 1' }, { text: 'Child 2' }],
        },
      ];
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites,
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('### Parent Item');
      expect(markdown).toContain('- [ ] Child 1');
      expect(markdown).toContain('- [ ] Child 2');
    });

    it('should render tech stack specific items with indicator', () => {
      const prerequisites: DetailedChecklistItem[] = [
        { text: 'Tech Item', techStackSpecific: true },
      ];
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites,
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('🔧 Tech Item');
    });

    it('should render all sections when present', () => {
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [{ text: 'Pre 1' }],
        fileStructure: 'test/',
        databaseSchema: [{ text: 'DB 1' }],
        apiEndpoints: [{ text: 'API 1' }],
        components: [{ text: 'Comp 1' }],
        services: [{ text: 'Service 1' }],
        security: [{ text: 'Sec 1' }],
        testing: [{ text: 'Test 1' }],
        deployment: [{ text: 'Deploy 1' }],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('## Prerequisites');
      expect(markdown).toContain('## Database Schema');
      expect(markdown).toContain('## API Endpoints');
      expect(markdown).toContain('## Components');
      expect(markdown).toContain('## Services');
      expect(markdown).toContain('## Security');
      expect(markdown).toContain('## Testing');
      expect(markdown).toContain('## Deployment');
    });

    it('should render checkpoints section when present', () => {
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [],
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
        checkpoints: {
          security: [{ text: 'Security checkpoint' }],
          testing: [{ text: 'Testing checkpoint' }],
          performance: [{ text: 'Performance checkpoint' }],
        },
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('## Cross-Cutting Requirements');
      expect(markdown).toContain('### Security Checkpoint');
      expect(markdown).toContain('### Testing Checkpoint');
      expect(markdown).toContain('### Performance Checkpoint');
    });

    it('should render code snippets when present', () => {
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [],
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
        codeSnippets: {
          service: {
            name: 'TestService',
            description: 'Test service',
            language: 'typescript',
            code: 'export class TestService {}',
            filePath: 'lib/services/test-service.ts',
          },
        },
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('## Code Examples');
      expect(markdown).toContain('### TestService');
      expect(markdown).toContain('**File:** `lib/services/test-service.ts`');
      expect(markdown).toContain('```typescript');
      expect(markdown).toContain('export class TestService {}');
    });

    it('should include tech stack information when provided', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites: [],
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist, techStack);

      expect(markdown).toContain('**Tech Stack:** nextjs, supabase, postgresql');
    });

    it('should handle features without description', () => {
      const featureWithoutDesc: EnrichedFeature = {
        ...mockFeature,
        description: undefined,
      };
      const checklist: DetailedFeatureChecklist = {
        feature: featureWithoutDesc,
        prerequisites: [],
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).not.toContain('## Description');
    });

    it('should handle deeply nested items', () => {
      const prerequisites: DetailedChecklistItem[] = [
        {
          text: 'Level 1',
          subItems: [
            {
              text: 'Level 2',
              subItems: [
                {
                  text: 'Level 3',
                  subItems: [{ text: 'Level 4' }],
                },
              ],
            },
          ],
        },
      ];
      const checklist: DetailedFeatureChecklist = {
        feature: mockFeature,
        prerequisites,
        databaseSchema: [],
        apiEndpoints: [],
        components: [],
        services: [],
        security: [],
        testing: [],
        deployment: [],
      };

      const markdown = renderer.render(checklist);

      expect(markdown).toContain('### Level 1');
      expect(markdown).toContain('- [ ] Level 2');
      expect(markdown).toContain('  - [ ] Level 3');
      expect(markdown).toContain('    - [ ] Level 4');
    });
  });
});
