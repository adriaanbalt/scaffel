/**
 * File structure generator
 */

import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';

export class FileStructureGenerator {
  generate(feature: EnrichedFeature, techStack?: TechStack): string | undefined {
    const featureName = feature.name.toLowerCase().replace(/\s+/g, '-');
    const featureSlug = featureName.replace(/[^a-z0-9-]/g, '');

    if (techStack?.framework === 'nextjs') {
      if (feature.name.toLowerCase().includes('auth')) {
        return `app/
├── api/
│   └── auth/
│       ├── signup/
│       │   └── route.ts
│       ├── signin/
│       │   └── route.ts
│       ├── signout/
│       │   └── route.ts
│       ├── oauth/
│       │   └── [provider]/
│       │       └── route.ts
│       ├── callback/
│       │   └── [provider]/
│       │       └── route.ts
│       ├── reset-password/
│       │   └── route.ts
│       ├── update-password/
│       │   └── route.ts
│       ├── verify-email/
│       │   └── route.ts
│       └── me/
│           └── route.ts
├── auth/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   ├── callback/
│   │   └── page.tsx
│   └── verify-email/
│       └── page.tsx
└── lib/
    ├── auth/
    │   ├── adapter.ts
    │   ├── supabase-adapter.ts
    │   ├── context.tsx
    │   ├── provider.tsx
    │   └── hooks.ts
    └── services/
        └── auth-service.ts`;
      } else if (feature.name.toLowerCase().includes('payment')) {
        return `app/
├── api/
│   └── payments/
│       ├── subscriptions/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── webhooks/
│       │   └── route.ts
│       ├── invoices/
│       │   └── route.ts
│       └── payment-methods/
│           └── route.ts
├── payments/
│   ├── subscriptions/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── invoices/
│   │   └── page.tsx
│   └── billing/
│       └── page.tsx
└── lib/
    └── services/
        └── payment-service.ts`;
      } else {
        // Generic feature structure
        return `app/
├── api/
│   └── ${featureSlug}/
│       ├── route.ts
│       └── [id]/
│           └── route.ts
├── ${featureSlug}/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── lib/
    └── services/
        └── ${featureSlug}-service.ts`;
      }
    }

    // Generic structure for non-Next.js
    return `src/
├── api/
│   └── ${featureSlug}/
│       ├── routes.ts
│       └── handlers.ts
├── services/
│   └── ${featureSlug}-service.ts
└── components/
    └── ${featureSlug}/`;
  }
}
