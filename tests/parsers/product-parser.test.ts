import { describe, it, expect } from 'vitest';
import { ProductParser } from '../../src/parsers/product-parser';

describe('ProductParser', () => {
  it('should parse product input', () => {
    const parser = new ProductParser();
    const input = {
      name: 'My App',
      description: 'A test app',
      type: 'saas',
    };

    const product = parser.parse(input);

    expect(product.name).toBe('My App');
    expect(product.description).toBe('A test app');
    expect(product.type).toBe('saas');
  });

  it('should validate product input', () => {
    const parser = new ProductParser();
    const product = parser.parse({ name: 'My App' });

    const validation = parser.validate(product);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should fail validation for missing name', () => {
    const parser = new ProductParser();
    const product = parser.parse({ name: '' });

    const validation = parser.validate(product);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

