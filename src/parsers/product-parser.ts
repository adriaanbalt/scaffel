/**
 * Product input parser
 */

import type { ProductInput } from '../core/generator';

export class ProductParser {
  parse(input: {
    name: string;
    description?: string;
    type?: string;
    domain?: string;
  }): ProductInput {
    return {
      name: input.name,
      description: input.description,
      type: this.parseType(input.type),
      domain: input.domain,
    };
  }

  private parseType(type?: string): ProductInput['type'] {
    const validTypes: ProductInput['type'][] = ['saas', 'ecommerce', 'mobile', 'api', 'other'];
    if (type && validTypes.includes(type as ProductInput['type'])) {
      return type as ProductInput['type'];
    }
    return 'saas'; // Default
  }

  validate(product: ProductInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!product.name || product.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (product.name && product.name.length > 255) {
      errors.push('Product name must be 255 characters or less');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

