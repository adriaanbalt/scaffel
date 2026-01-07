/**
 * Checkpoints checklist generator (security, testing, performance)
 */

import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class CheckpointsGenerator {
  private createItem(
    text: string,
    subItems?: DetailedChecklistItem[],
    techStackSpecific?: boolean
  ): DetailedChecklistItem {
    return {
      text,
      subItems,
      techStackSpecific,
    };
  }

  private createNestedItem(text: string, subItems: DetailedChecklistItem[]): DetailedChecklistItem {
    return this.createItem(text, subItems);
  }
  generateSecurity(feature: EnrichedFeature, category: string): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('Input validation', [
        this.createItem('All user inputs validated (whitelist, not blacklist)'),
        this.createItem('File uploads validated (type, size, content)'),
        this.createItem('SQL injection prevention (parameterized queries)'),
        this.createItem('XSS prevention (input sanitization, output encoding)'),
        this.createItem('Path traversal prevention (filename sanitization)'),
      ])
    );

    items.push(
      this.createNestedItem('Authentication & Authorization', [
        this.createItem('Authentication required for all protected endpoints'),
        this.createItem('Authorization checks implemented (resource ownership, permissions)'),
        this.createItem('Session security (HttpOnly, Secure, SameSite cookies)'),
        this.createItem('Token expiration and refresh implemented'),
      ])
    );

    items.push(
      this.createNestedItem('Data protection', [
        this.createItem('RLS policies enforced (if using Supabase)'),
        this.createItem('Sensitive data encrypted at rest'),
        this.createItem('Sensitive data encrypted in transit (HTTPS)'),
        this.createItem('API keys and secrets stored securely (environment variables)'),
      ])
    );

    if (category === 'foundation' || feature.name.toLowerCase().includes('auth')) {
      items.push(
        this.createNestedItem('Security hardening', [
          this.createItem('CSRF protection implemented'),
          this.createItem('Security headers configured (CSP, X-Frame-Options, etc.)'),
          this.createItem('Rate limiting implemented'),
          this.createItem('Account lockout after failed attempts'),
          this.createItem('Password strength requirements enforced'),
        ])
      );
    }

    items.push(
      this.createNestedItem('Security testing', [
        this.createItem('Security tests written (input validation, authorization)'),
        this.createItem('Penetration testing considered (for critical features)'),
        this.createItem('Security audit checklist completed'),
      ])
    );

    return items;
  }

  generateTesting(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('Unit tests', [
        this.createItem('Service methods tested (>80% coverage)'),
        this.createItem('Utility functions tested'),
        this.createItem('Validation logic tested'),
        this.createItem('Error handling tested'),
        this.createItem('Edge cases tested'),
      ])
    );

    items.push(
      this.createNestedItem('Integration tests', [
        this.createItem('API endpoints tested'),
        this.createItem('Database operations tested'),
        this.createItem('Authentication flow tested'),
        this.createItem('Error scenarios tested'),
      ])
    );

    if (techStack?.framework === 'nextjs' || techStack?.framework === 'react') {
      items.push(
        this.createNestedItem('Component tests', [
          this.createItem('Component rendering tested', undefined, true),
          this.createItem('User interactions tested', undefined, true),
          this.createItem('Loading states tested', undefined, true),
          this.createItem('Error states tested', undefined, true),
        ])
      );
    }

    items.push(
      this.createNestedItem('End-to-end tests', [
        this.createItem('Critical user flows tested'),
        this.createItem('Authentication flows tested'),
        this.createItem('Error recovery tested'),
      ])
    );

    items.push(
      this.createNestedItem('Test coverage', [
        this.createItem('Coverage > 80% for new code'),
        this.createItem('Critical paths 100% covered'),
        this.createItem('Test coverage report generated'),
      ])
    );

    return items;
  }

  generatePerformance(): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('API performance', [
        this.createItem('Response times < 200ms for standard operations'),
        this.createItem('Response times < 1s for complex operations'),
        this.createItem('Database queries optimized (indexes, query plans)'),
        this.createItem('N+1 query problems avoided'),
      ])
    );

    items.push(
      this.createNestedItem('Caching', [
        this.createItem('Frequently accessed data cached (1-5 minute TTL)'),
        this.createItem('Cache invalidation on mutations'),
        this.createItem('Cache hit rate monitored'),
      ])
    );

    items.push(
      this.createNestedItem('Resource optimization', [
        this.createItem('Database connection pooling configured'),
        this.createItem('API rate limiting configured'),
        this.createItem('File upload size limits enforced'),
        this.createItem('Pagination implemented for large datasets'),
      ])
    );

    items.push(
      this.createNestedItem('Performance testing', [
        this.createItem('Performance benchmarks established'),
        this.createItem('Load testing completed (if applicable)'),
        this.createItem('Performance monitoring configured'),
      ])
    );

    return items;
  }
}
