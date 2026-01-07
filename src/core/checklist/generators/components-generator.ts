/**
 * Components checklist generator
 */

import { BaseChecklistGenerator } from '../base-generator';
import type { EnrichedFeature } from '../../generator';
import type { TechStack } from '../../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from '../types';

export class ComponentsGenerator extends BaseChecklistGenerator {
  generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[] {
    const items: DetailedChecklistItem[] = [];

    // Feature-specific components
    if (feature.name.toLowerCase().includes('auth')) {
      items.push(
        this.createNestedItem('Authentication components', [
          this.createItem('LoginForm component (email, password, OAuth buttons)'),
          this.createItem('SignupForm component (email, password, confirm password)'),
          this.createItem('PasswordResetForm component'),
          this.createItem('AuthProvider context (manages auth state)'),
          this.createItem('useAuth hook (access auth context)'),
          this.createItem('ProtectedRoute component (redirects if not authenticated)'),
        ])
      );
    } else if (feature.name.toLowerCase().includes('payment')) {
      items.push(
        this.createNestedItem('Payment components', [
          this.createItem('SubscriptionForm component'),
          this.createItem('PaymentMethodForm component'),
          this.createItem('InvoiceList component'),
          this.createItem('BillingHistory component'),
        ])
      );
    } else {
      // Generic components
      const featureName = feature.name;
      items.push(
        this.createNestedItem(`${featureName} components`, [
          this.createItem(`${featureName}List component (display list)`),
          this.createItem(`${featureName}Item component (display single item)`),
          this.createItem(`${featureName}Form component (create/edit)`),
          this.createItem(`${featureName}Detail component (view details)`),
        ])
      );
    }

    // Common component tasks
    items.push(
      this.createNestedItem('Component structure', [
        this.createItem('Define TypeScript interfaces for props'),
        this.createItem('Add loading states'),
        this.createItem('Add error states'),
        this.createItem('Add empty states'),
        this.createItem('Add success states'),
      ])
    );

    if (techStack?.framework === 'nextjs' || techStack?.framework === 'react') {
      items.push(
        this.createNestedItem('React patterns', [
          this.createItem('Use React hooks for state management', undefined, true),
          this.createItem('Implement error boundaries', undefined, true),
          this.createItem('Add loading skeletons', undefined, true),
          this.createItem('Optimize re-renders (useMemo, useCallback)', undefined, true),
        ])
      );
    }

    if (techStack?.styling === 'tailwind') {
      items.push(
        this.createNestedItem('Styling', [
          this.createItem('Use Tailwind utility classes', undefined, true),
          this.createItem('Use semantic design tokens', undefined, true),
          this.createItem('Ensure responsive design', undefined, true),
          this.createItem('Add dark mode support', undefined, true),
        ])
      );
    }

    return items;
  }
}
