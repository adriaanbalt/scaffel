/**
 * Testing checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class TestingGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('Unit tests', [
        this.createItem('Test service methods'),
        this.createItem('Test utility functions'),
        this.createItem('Test validation logic'),
        this.createItem('Test error handling'),
        this.createItem('Test edge cases'),
      ])
    );

    items.push(
      this.createNestedItem('Integration tests', [
        this.createItem('Test API endpoints'),
        this.createItem('Test database operations'),
        this.createItem('Test authentication flow'),
        this.createItem('Test error scenarios'),
      ])
    );

    if (techStack?.framework === 'nextjs' || techStack?.framework === 'react') {
      items.push(
        this.createNestedItem('Component tests', [
          this.createItem('Test component rendering', undefined, true),
          this.createItem('Test user interactions', undefined, true),
          this.createItem('Test loading states', undefined, true),
          this.createItem('Test error states', undefined, true),
        ])
      );
    }

    items.push(
      this.createNestedItem('End-to-end tests', [
        this.createItem('Test critical user flows'),
        this.createItem('Test authentication flows'),
        this.createItem('Test error recovery'),
      ])
    );

    if (category === 'foundation') {
      items.push(
        this.createNestedItem('Security tests', [
          this.createItem('Test input validation'),
          this.createItem('Test authorization checks'),
          this.createItem('Test rate limiting'),
          this.createItem('Test SQL injection prevention'),
          this.createItem('Test XSS prevention'),
        ])
      );

      items.push(
        this.createNestedItem('Performance tests', [
          this.createItem('Test query performance'),
          this.createItem('Test API response times'),
          this.createItem('Test under load'),
        ])
      );
    }

    return items;
  }
}
