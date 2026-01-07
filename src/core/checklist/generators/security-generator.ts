/**
 * Security checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { DetailedChecklistItem } from '../types';

export class SecurityGenerator extends BaseChecklistGenerator {
  generate(feature: EnrichedFeature, category: string): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('Input validation', [
        this.createItem('Validate all user inputs'),
        this.createItem('Sanitize string inputs'),
        this.createItem('Validate data types'),
        this.createItem('Validate data ranges'),
        this.createItem('Validate required fields'),
      ])
    );

    items.push(
      this.createNestedItem('Authorization', [
        this.createItem('Check user permissions for all operations'),
        this.createItem('Verify resource ownership'),
        this.createItem('Implement role-based access control (if needed)'),
        this.createItem('Prevent unauthorized data access'),
      ])
    );

    items.push(
      this.createNestedItem('Rate limiting', [
        this.createItem('Add rate limiting to API endpoints'),
        this.createItem('Configure limits per user/IP'),
        this.createItem('Return 429 status on rate limit exceeded'),
      ])
    );

    if (category === 'foundation' || feature.name.toLowerCase().includes('auth')) {
      items.push(
        this.createNestedItem('Security hardening', [
          this.createItem('Add CSRF protection'),
          this.createItem('Add security headers (CSP, X-Frame-Options, etc.)'),
          this.createItem('Implement account lockout after failed attempts'),
          this.createItem('Use secure password hashing (bcrypt, argon2)'),
          this.createItem('Implement session security (HttpOnly, Secure cookies)'),
        ])
      );
    }

    return items;
  }
}
