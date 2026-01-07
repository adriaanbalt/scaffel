import { describe, it, expect } from 'vitest';
import { CodeTemplateGenerator } from '../../src/core/code-template-generator';
import type { Feature } from '../../src/core/generator';
import type { TechStack } from '../../src/parsers/tech-stack-parser';

describe('CodeTemplateGenerator', () => {
  let generator: CodeTemplateGenerator;
  const mockFeature: Feature = {
    id: 'test-feature',
    name: 'Test Feature',
    category: 'feature',
    priority: 'medium',
    estimatedTime: { days: 5 },
  };

  beforeEach(() => {
    generator = new CodeTemplateGenerator();
  });

  describe('generateServiceTemplate', () => {
    it('should generate service template with correct structure', () => {
      const snippet = generator.generateServiceTemplate(mockFeature);

      expect(snippet.name).toContain('Service');
      expect(snippet.language).toBe('typescript');
      expect(snippet.filePath).toContain('lib/services');
      expect(snippet.code).toContain('export class');
      expect(snippet.code).toContain('TestFeatureService');
    });

    it('should use Record<string, unknown> instead of any for data parameters', () => {
      const snippet = generator.generateServiceTemplate(mockFeature);

      expect(snippet.code).toContain('Record<string, unknown>');
      expect(snippet.code).not.toContain(': any)');
      expect(snippet.code).not.toContain('data: any');
    });

    it('should include getAll, getById, create, update, delete methods', () => {
      const snippet = generator.generateServiceTemplate(mockFeature);

      expect(snippet.code).toContain('async getAll');
      expect(snippet.code).toContain('async getById');
      expect(snippet.code).toContain('async create');
      expect(snippet.code).toContain('async update');
      expect(snippet.code).toContain('async delete');
    });

    it('should include proper error handling', () => {
      const snippet = generator.generateServiceTemplate(mockFeature);

      expect(snippet.code).toContain('try {');
      expect(snippet.code).toContain('catch (error)');
      expect(snippet.code).toContain('console.error');
    });
  });

  describe('generateAPIRouteTemplate', () => {
    it('should generate Next.js route template when framework is nextjs', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };
      const endpoint = {
        method: 'GET',
        path: '/api/test',
        description: 'Test endpoint',
      };

      const snippet = generator.generateAPIRouteTemplate(mockFeature, endpoint, techStack);

      expect(snippet.language).toBe('typescript');
      expect(snippet.code).toContain('NextRequest');
      expect(snippet.code).toContain('NextResponse');
      expect(snippet.filePath).toContain('app/api');
    });

    it('should generate generic route template when framework is not nextjs', () => {
      const techStack: TechStack = {
        framework: 'express',
        backend: 'node',
        database: 'postgresql',
      };
      const endpoint = {
        method: 'GET',
        path: '/api/test',
        description: 'Test endpoint',
      };

      const snippet = generator.generateAPIRouteTemplate(mockFeature, endpoint, techStack);

      expect(snippet.code).toContain('Request');
      expect(snippet.code).toContain('Response');
      expect(snippet.code).toContain('express');
    });

    it('should use unknown instead of any for error handling', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };
      const endpoint = {
        method: 'GET',
        path: '/api/test',
        description: 'Test endpoint',
      };

      const snippet = generator.generateAPIRouteTemplate(mockFeature, endpoint, techStack);

      expect(snippet.code).toContain('catch (error: unknown)');
      expect(snippet.code).not.toContain('catch (error: any)');
      expect(snippet.code).toContain('error instanceof Error');
    });

    it('should handle dynamic routes correctly', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };
      const endpoint = {
        method: 'GET',
        path: '/api/test/:id',
        description: 'Get test by id',
      };

      const snippet = generator.generateAPIRouteTemplate(mockFeature, endpoint, techStack);

      expect(snippet.filePath).toContain('[id]');
    });
  });

  describe('generateComponentTemplate', () => {
    it('should generate Next.js component when framework is nextjs', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const snippet = generator.generateComponentTemplate(mockFeature, 'TestComponent', techStack);

      expect(snippet.language).toBe('typescript');
      expect(snippet.code).toContain("'use client'");
      expect(snippet.code).toContain('export default function');
      expect(snippet.filePath).toContain('app/');
    });

    it('should generate React component when framework is not nextjs', () => {
      const techStack: TechStack = {
        framework: 'react',
        backend: 'node',
        database: 'postgresql',
      };

      const snippet = generator.generateComponentTemplate(mockFeature, 'TestComponent', techStack);

      expect(snippet.code).toContain('React.FC');
      expect(snippet.code).toContain('export const');
      expect(snippet.filePath).toContain('src/components');
    });

    it('should use unknown[] instead of any[] for state', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const snippet = generator.generateComponentTemplate(mockFeature, 'TestComponent', techStack);

      expect(snippet.code).toContain('useState<unknown[]>');
      expect(snippet.code).not.toContain('useState<any[]>');
      expect(snippet.code).toContain('TODO: Replace with proper type');
    });

    it('should use unknown for error handling in components', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const snippet = generator.generateComponentTemplate(mockFeature, 'TestComponent', techStack);

      expect(snippet.code).toContain('catch (err: unknown)');
      expect(snippet.code).not.toContain('catch (err: any)');
      expect(snippet.code).toContain('err instanceof Error');
    });
  });

  describe('generateMigrationTemplate', () => {
    it('should generate PostgreSQL migration when database is postgresql', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const snippet = generator.generateMigrationTemplate(mockFeature, techStack);

      expect(snippet.language).toBe('sql');
      expect(snippet.code).toContain('CREATE TABLE');
      expect(snippet.code).toContain('UUID');
      expect(snippet.code).toContain('TIMESTAMPTZ');
      expect(snippet.filePath).toContain('migrations/');
    });

    it('should generate generic migration when database is not postgresql', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'node',
        database: 'mysql',
      };

      const snippet = generator.generateMigrationTemplate(mockFeature, techStack);

      expect(snippet.language).toBe('sql');
      expect(snippet.code).toContain('CREATE TABLE');
      expect(snippet.code).toContain('VARCHAR');
    });

    it('should include proper table structure', () => {
      const techStack: TechStack = {
        framework: 'nextjs',
        backend: 'supabase',
        database: 'postgresql',
      };

      const snippet = generator.generateMigrationTemplate(mockFeature, techStack);

      expect(snippet.code).toContain('id');
      expect(snippet.code).toContain('app_id');
      expect(snippet.code).toContain('created_at');
      expect(snippet.code).toContain('updated_at');
    });
  });

  describe('generateValidationSchemaTemplate', () => {
    it('should generate create validation schema', () => {
      const snippet = generator.generateValidationSchemaTemplate(mockFeature, 'create');

      expect(snippet.language).toBe('typescript');
      expect(snippet.code).toContain('z.object');
      expect(snippet.code).toContain('createTestFeatureSchema');
      expect(snippet.code).toContain('CreateTestFeatureInput');
    });

    it('should generate update validation schema', () => {
      const snippet = generator.generateValidationSchemaTemplate(mockFeature, 'update');

      expect(snippet.language).toBe('typescript');
      expect(snippet.code).toContain('z.object');
      expect(snippet.code).toContain('updateTestFeatureSchema');
      expect(snippet.code).toContain('UpdateTestFeatureInput');
    });

    it('should include proper Zod validation', () => {
      const snippet = generator.generateValidationSchemaTemplate(mockFeature, 'create');

      expect(snippet.code).toContain('z.string()');
      expect(snippet.code).toContain('z.enum');
      expect(snippet.code).toContain('z.infer');
    });
  });
});
