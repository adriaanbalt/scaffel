/**
 * Database schema checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class DatabaseGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    // Feature-specific schema generation
    if (feature.name.toLowerCase().includes('auth')) {
      items.push(
        this.createNestedItem('Create authentication tables', [
          this.createItem('users table (if not using Supabase auth)'),
          this.createItem('sessions table (if not using Supabase auth)'),
          this.createItem('password_reset_tokens table'),
          this.createItem('email_verification_tokens table'),
          this.createItem('oauth_accounts table (for OAuth providers)'),
        ])
      );
    } else if (feature.name.toLowerCase().includes('payment')) {
      items.push(
        this.createNestedItem('Create payment tables', [
          this.createItem(
            'subscriptions table (id, user_id, plan_id, status, current_period_start, current_period_end)'
          ),
          this.createItem('invoices table (id, subscription_id, amount, status, due_date)'),
          this.createItem('payment_methods table (id, user_id, provider, provider_id, is_default)'),
          this.createItem('transactions table (id, subscription_id, amount, status, created_at)'),
        ])
      );
    } else if (
      feature.name.toLowerCase().includes('user') &&
      !feature.name.toLowerCase().includes('auth')
    ) {
      items.push(
        this.createNestedItem('Create user profile tables', [
          this.createItem('user_profiles table (id, user_id, name, avatar_url, bio, preferences)'),
          this.createItem('user_settings table (id, user_id, key, value)'),
        ])
      );
    } else {
      // Generic schema
      items.push(
        this.createNestedItem('Design database schema', [
          this.createItem(`Create ${feature.name.toLowerCase().replace(/\s+/g, '_')} table`),
          this.createItem('Define primary key (UUID recommended)'),
          this.createItem('Add foreign keys for relationships'),
          this.createItem('Add indexes for frequently queried columns'),
          this.createItem('Add constraints (NOT NULL, UNIQUE, CHECK)'),
          this.createItem('Add timestamps (created_at, updated_at)'),
        ])
      );
    }

    // Common schema tasks
    items.push(
      this.createNestedItem('Add indexes', [
        this.createItem('Index on foreign keys'),
        this.createItem('Index on frequently queried columns'),
        this.createItem('Composite indexes for common query patterns'),
      ])
    );

    items.push(
      this.createNestedItem('Add RLS policies (if using Supabase)', [
        ...(techStack?.backend === 'supabase'
          ? [
              this.createItem('Enable RLS on all tables', undefined, true),
              this.createItem('Create policies for SELECT operations', undefined, true),
              this.createItem('Create policies for INSERT operations', undefined, true),
              this.createItem('Create policies for UPDATE operations', undefined, true),
              this.createItem('Create policies for DELETE operations', undefined, true),
            ]
          : []),
      ])
    );

    items.push(
      this.createNestedItem('Create migration files', [
        this.createItem('Create up migration'),
        this.createItem('Create down migration (rollback)'),
        this.createItem('Test migrations'),
      ])
    );

    return items;
  }
}
