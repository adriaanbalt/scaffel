import { describe, it, expect } from 'vitest';
import { ScaffelGenerator } from '../../src/core/generator';

describe('ScaffelGenerator', () => {
  it('should generate a basic roadmap', () => {
    const generator = new ScaffelGenerator();
    const input = {
      name: 'Test App',
      description: 'A test application',
      type: 'saas' as const,
    };

    const roadmap = generator.generate(input);

    expect(roadmap.product.name).toBe('Test App');
    expect(roadmap.product.type).toBe('saas');
    expect(roadmap.phases).toBeDefined();
    expect(roadmap.metadata.generator).toBe('scaffel');
  });
});

