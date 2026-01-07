import { describe, it, expect } from 'vitest';
import { FeatureParser } from '../../src/parsers/feature-parser';

describe('FeatureParser', () => {
  it('should parse feature string', () => {
    const parser = new FeatureParser();
    const features = parser.parseFromString('auth,payments,users');

    expect(features).toHaveLength(3);
    expect(features[0].name).toBe('auth');
    expect(features[0].id).toBe('auth');
  });

  it('should parse feature array', () => {
    const parser = new FeatureParser();
    const features = parser.parse(['auth', 'payments']);

    expect(features).toHaveLength(2);
    expect(features[0].name).toBe('auth');
  });

  it('should validate features', () => {
    const parser = new FeatureParser();
    const features = parser.parse(['auth', 'payments']);

    const validation = parser.validate(features);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should fail validation for duplicate IDs', () => {
    const parser = new FeatureParser();
    const features = [
      { id: 'auth', name: 'Auth' },
      { id: 'auth', name: 'Authentication' },
    ];

    const validation = parser.validate(features);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

