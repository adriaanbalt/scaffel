/**
 * Prerequisites checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class PrerequisitesGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    // Foundation prerequisites
    if (category === 'foundation') {
      items.push(this.createItem('Project structure set up'));
      items.push(this.createItem('Development environment configured'));
      if (techStack?.framework === 'nextjs') {
        items.push(this.createItem('Next.js project initialized', undefined, true));
        items.push(this.createItem('TypeScript configured', undefined, true));
      }
    }

    // Database prerequisites
    items.push(
      this.createNestedItem('Database configured', [
        this.createItem(
          techStack?.database === 'postgresql' ? 'PostgreSQL database created' : 'Database created'
        ),
        this.createItem('Connection string configured'),
        this.createItem('Migration system set up'),
        ...(techStack?.backend === 'supabase'
          ? [
              this.createItem('Supabase project created', undefined, true),
              this.createItem('Supabase client configured', undefined, true),
            ]
          : []),
      ])
    );

    // Error handling
    items.push(
      this.createNestedItem('Error handling system in place', [
        this.createItem('Error types defined'),
        this.createItem('Error handler middleware created'),
        this.createItem('Error logging configured'),
      ])
    );

    // Authentication prerequisites (if needed)
    if (category !== 'foundation' && !feature.name.toLowerCase().includes('auth')) {
      items.push(this.createItem('Authentication system implemented'));
    }

    // Feature-specific prerequisites
    if (feature.dependencies && feature.dependencies.length > 0) {
      items.push(this.createItem(`Dependencies completed: ${feature.dependencies.join(', ')}`));
    }

    // Payment-specific
    if (feature.name.toLowerCase().includes('payment')) {
      items.push(
        this.createNestedItem('Payment provider configured', [
          this.createItem('Stripe account created'),
          this.createItem('API keys configured'),
          this.createItem('Webhook endpoint URL registered'),
          this.createItem('Webhook secret configured'),
        ])
      );
    }

    // File upload-specific
    if (
      feature.name.toLowerCase().includes('upload') ||
      feature.name.toLowerCase().includes('file')
    ) {
      items.push(
        this.createNestedItem('Storage provider configured', [
          this.createItem('Storage account created (S3, Cloudinary, etc.)'),
          this.createItem('Access keys configured'),
          this.createItem('CDN configured (if needed)'),
        ])
      );
    }

    return items;
  }
}
