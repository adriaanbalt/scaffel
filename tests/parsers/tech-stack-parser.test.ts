import { describe, it, expect } from 'vitest';
import { TechStackParser } from '../../src/parsers/tech-stack-parser';

describe('TechStackParser', () => {
  it('should parse tech stack from string', () => {
    const parser = new TechStackParser();
    const stack = parser.parseFromString('nextjs,supabase,typescript,tailwind');

    expect(stack.framework).toBe('nextjs');
    expect(stack.backend).toBe('supabase');
    expect(stack.language).toBe('typescript');
    expect(stack.styling).toBe('tailwind');
  });

  it('should parse tech stack from object', () => {
    const parser = new TechStackParser();
    const stack = parser.parse({
      framework: 'nextjs',
      backend: 'supabase',
      database: 'postgresql',
      language: 'typescript',
    });

    expect(stack.framework).toBe('nextjs');
    expect(stack.backend).toBe('supabase');
    expect(stack.database).toBe('postgresql');
    expect(stack.language).toBe('typescript');
  });

  it('should use defaults for missing values', () => {
    const parser = new TechStackParser();
    const stack = parser.parse({});

    expect(stack.framework).toBe('nextjs');
    expect(stack.backend).toBe('supabase');
    expect(stack.database).toBe('postgresql');
    expect(stack.language).toBe('typescript');
  });
});

