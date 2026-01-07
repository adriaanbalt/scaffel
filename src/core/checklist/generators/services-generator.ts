/**
 * Services checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class ServicesGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    const featureName = feature.name;
    const serviceName = `${featureName}Service`;

    items.push(
      this.createNestedItem(`Create ${serviceName} class`, [
        this.createNestedItem(
          `Create file: lib/services/${featureName.toLowerCase().replace(/\s+/g, '-')}-service.ts`,
          [
            this.createItem(`Define class: export class ${serviceName}`),
            this.createItem(`Add constructor: constructor(appId: string)`),
            this.createItem(`Add appId property: private appId: string`),
            this.createItem(`Add validation: validateAppId(appId) in constructor`),
          ]
        ),
        this.createNestedItem('Implement getAll method', [
          this.createItem(
            `Method signature: async getAll(filters?: Filters, pagination?: Pagination): Promise<${featureName}[]>`
          ),
          this.createItem('Add filter support (status, date range, etc.)'),
          this.createItem('Add pagination (limit, offset)'),
          this.createItem('Add caching: cache.get(key) with 1 minute TTL'),
          this.createItem('Add error handling: try/catch with logging'),
          this.createItem('Return empty array if no results'),
        ]),
        this.createNestedItem('Implement getById method', [
          this.createItem(
            `Method signature: async getById(id: string): Promise<${featureName} | null>`
          ),
          this.createItem('Validate id parameter (not empty, valid format)'),
          this.createItem('Add caching: cache.get(key) with 1 minute TTL'),
          this.createItem('Add error handling: try/catch with logging'),
          this.createItem('Return null if not found'),
        ]),
        this.createNestedItem('Implement create method', [
          this.createItem(
            `Method signature: async create(data: Create${featureName}Input): Promise<${featureName}>`
          ),
          this.createItem('Validate input data (Zod schema recommended)'),
          this.createItem('Add appId scoping (if multi-tenant)'),
          this.createItem('Invalidate cache: cache.delete(pattern)'),
          this.createItem('Add error handling: try/catch with logging'),
          this.createItem('Return created entity'),
        ]),
        this.createNestedItem('Implement update method', [
          this.createItem(
            `Method signature: async update(id: string, data: Update${featureName}Input): Promise<${featureName}>`
          ),
          this.createItem('Validate id parameter'),
          this.createItem('Validate input data (Zod schema)'),
          this.createItem('Check resource ownership (if needed)'),
          this.createItem('Invalidate cache: cache.delete(pattern)'),
          this.createItem('Add error handling: try/catch with logging'),
          this.createItem('Return updated entity'),
        ]),
        this.createNestedItem('Implement delete method', [
          this.createItem(`Method signature: async delete(id: string): Promise<void>`),
          this.createItem('Validate id parameter'),
          this.createItem('Check resource ownership (if needed)'),
          this.createItem('Soft delete: set deleted_at timestamp (recommended)'),
          this.createItem('Invalidate cache: cache.delete(pattern)'),
          this.createItem('Add error handling: try/catch with logging'),
        ]),
        this.createNestedItem('Add logging to all methods', [
          this.createItem('Log method entry with parameters'),
          this.createItem('Log method success with result summary'),
          this.createItem('Log errors with full context'),
          this.createItem('Use structured logging (JSON format)'),
        ]),
        this.createNestedItem('Add error handling to all methods', [
          this.createItem('Wrap all operations in try/catch'),
          this.createItem('Map database errors to user-friendly messages'),
          this.createItem('Throw appropriate error types (ValidationError, NotFoundError, etc.)'),
          this.createItem('Log errors before throwing'),
        ]),
      ])
    );

    if (techStack?.backend === 'supabase') {
      items.push(
        this.createNestedItem('Supabase integration', [
          this.createItem('Use Supabase client for queries', undefined, true),
          this.createItem('Implement RLS policy checks', undefined, true),
          this.createItem('Use connection pooling', undefined, true),
          this.createItem('Handle Supabase-specific errors', undefined, true),
        ])
      );
    }

    items.push(
      this.createNestedItem('Caching strategy', [
        this.createItem('Cache frequently accessed data (1-5 minute TTL)'),
        this.createItem('Invalidate cache on mutations'),
        this.createItem('Use Redis or in-memory cache'),
      ])
    );

    return items;
  }
}
