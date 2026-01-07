/**
 * API endpoints checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class ApiGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    // Feature-specific API endpoints
    if (feature.name.toLowerCase().includes('auth')) {
      items.push(
        this.createNestedItem('Authentication endpoints', [
          this.createItem('POST /api/auth/signup - User registration'),
          this.createItem('POST /api/auth/signin - User login'),
          this.createItem('POST /api/auth/signout - User logout'),
          this.createItem('GET /api/auth/oauth/:provider - Initiate OAuth flow'),
          this.createItem('GET /api/auth/callback/:provider - OAuth callback handler'),
          this.createItem('POST /api/auth/reset-password - Request password reset'),
          this.createItem('POST /api/auth/update-password - Update password'),
          this.createItem('POST /api/auth/verify-email - Verify email address'),
          this.createItem('GET /api/auth/me - Get current user'),
        ])
      );
    } else if (feature.name.toLowerCase().includes('payment')) {
      items.push(
        this.createNestedItem('Payment endpoints', [
          this.createItem('POST /api/payments/subscriptions - Create subscription'),
          this.createItem('GET /api/payments/subscriptions - List subscriptions'),
          this.createItem('GET /api/payments/subscriptions/:id - Get subscription'),
          this.createItem('PATCH /api/payments/subscriptions/:id - Update subscription'),
          this.createItem('DELETE /api/payments/subscriptions/:id - Cancel subscription'),
          this.createItem('POST /api/payments/webhooks - Stripe webhook handler'),
          this.createItem('GET /api/payments/invoices - List invoices'),
          this.createItem('GET /api/payments/payment-methods - List payment methods'),
        ])
      );
    } else {
      // Generic API endpoints
      const featureSlug = feature.name.toLowerCase().replace(/\s+/g, '-');
      items.push(
        this.createNestedItem('API endpoints', [
          this.createItem(`GET /api/${featureSlug} - List all items`),
          this.createItem(`GET /api/${featureSlug}/:id - Get single item`),
          this.createItem(`POST /api/${featureSlug} - Create new item`),
          this.createItem(`PATCH /api/${featureSlug}/:id - Update item`),
          this.createItem(`DELETE /api/${featureSlug}/:id - Delete item`),
        ])
      );
    }

    // Common API tasks
    items.push(
      this.createNestedItem('Request validation', [
        this.createNestedItem('Create validation schemas', [
          this.createItem('Create Zod schema for request body'),
          this.createItem('Create Zod schema for request parameters'),
          this.createItem('Create Zod schema for query parameters'),
          this.createItem('Add type inference: z.infer<typeof schema>'),
        ]),
        this.createNestedItem('Implement validation middleware', [
          this.createItem('Validate request body: schema.parse(body)'),
          this.createItem('Validate request parameters: schema.parse(params)'),
          this.createItem('Validate query parameters: schema.parse(query)'),
          this.createItem('Handle validation errors: catch ZodError'),
          this.createItem('Return 400 status with error details'),
          this.createItem('Format error messages for client'),
        ]),
      ])
    );

    items.push(
      this.createNestedItem('Authentication middleware', [
        this.createNestedItem('Create authentication middleware', [
          this.createItem('Create file: lib/middleware/auth.ts'),
          this.createItem('Function: async function requireAuth(request: Request)'),
          this.createItem('Extract token from Authorization header: Bearer <token>'),
          this.createItem('Validate token format (not empty, proper structure)'),
          this.createItem('Verify token signature and expiration'),
          this.createItem('Extract user from token payload'),
          this.createItem('Cache user lookup (1 minute TTL)'),
          this.createItem('Throw AuthenticationError if invalid'),
          this.createItem('Return AuthUser on success'),
        ]),
        this.createNestedItem('Add authorization checks', [
          this.createItem('Check user permissions for operation'),
          this.createItem('Verify resource ownership (if applicable)'),
          this.createItem('Check role-based access (if applicable)'),
          this.createItem('Throw AuthorizationError if denied'),
        ]),
        this.createNestedItem('Handle unauthenticated requests', [
          this.createItem('Return 401 status code'),
          this.createItem('Include WWW-Authenticate header'),
          this.createItem('Return error message: "Authentication required"'),
          this.createItem('Log authentication failures'),
        ]),
      ])
    );

    items.push(
      this.createNestedItem('Error handling', [
        this.createItem('Handle validation errors (400)'),
        this.createItem('Handle authentication errors (401)'),
        this.createItem('Handle authorization errors (403)'),
        this.createItem('Handle not found errors (404)'),
        this.createItem('Handle server errors (500)'),
        this.createItem('Log errors appropriately'),
      ])
    );

    if (techStack?.framework === 'nextjs') {
      items.push(
        this.createNestedItem('Next.js API route structure', [
          this.createNestedItem('Create route.ts file structure', [
            this.createItem(
              `Create file: app/api/${feature.name.toLowerCase().replace(/\s+/g, '-')}/route.ts`,
              undefined,
              true
            ),
            this.createItem('Export async function for each HTTP method', undefined, true),
            this.createItem('Export async function GET(request: Request)', undefined, true),
            this.createItem('Export async function POST(request: Request)', undefined, true),
            this.createItem('Export async function PATCH(request: Request)', undefined, true),
            this.createItem('Export async function DELETE(request: Request)', undefined, true),
          ]),
          this.createNestedItem('Implement route handlers', [
            this.createItem('Use Next.js 15 route handlers (async functions)', undefined, true),
            this.createItem(
              'Use cookies() helper: const cookieStore = await cookies()',
              undefined,
              true
            ),
            this.createItem('Parse request body: await request.json()', undefined, true),
            this.createItem(
              'Get query parameters: new URL(request.url).searchParams',
              undefined,
              true
            ),
            this.createItem(
              'Return Response with JSON: Response.json(data, { status })',
              undefined,
              true
            ),
          ]),
        ])
      );
    }

    return items;
  }
}
