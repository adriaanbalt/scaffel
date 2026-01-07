/**
 * Deployment checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { DetailedChecklistItem } from '../types';

export class DeploymentGenerator extends BaseChecklistGenerator {
  generate(feature: EnrichedFeature, category: string): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    items.push(
      this.createNestedItem('Environment configuration', [
        this.createItem('Add required environment variables'),
        this.createItem('Update .env.example file'),
        this.createItem('Configure production environment variables'),
        this.createItem('Verify all secrets are set'),
      ])
    );

    items.push(
      this.createNestedItem('Database migrations', [
        this.createItem('Run migrations in staging'),
        this.createItem('Verify migration success'),
        this.createItem('Run migrations in production'),
        this.createItem('Verify rollback works'),
      ])
    );

    items.push(
      this.createNestedItem('Feature flags', [
        this.createItem('Create feature flag (if needed)'),
        this.createItem('Configure feature flag in production'),
        this.createItem('Test feature flag toggle'),
      ])
    );

    items.push(
      this.createNestedItem('Monitoring', [
        this.createItem('Add error tracking (Sentry, etc.)'),
        this.createItem('Add performance monitoring'),
        this.createItem('Set up alerts for errors'),
        this.createItem('Set up alerts for performance degradation'),
      ])
    );

    items.push(
      this.createNestedItem('Documentation', [
        this.createItem('Update API documentation'),
        this.createItem('Update component documentation'),
        this.createItem('Update deployment guide'),
      ])
    );

    if (category === 'foundation' || category === 'core') {
      items.push(
        this.createNestedItem('Backup and rollback', [
          this.createItem('Verify backup strategy'),
          this.createItem('Test rollback procedure'),
          this.createItem('Document rollback steps'),
        ])
      );
    }

    return items;
  }
}
