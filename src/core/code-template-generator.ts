/**
 * Code template generator - Generates code snippets and templates
 */

import type { Feature } from './generator';
import type { TechStack } from '../parsers/tech-stack-parser';

export interface CodeSnippet {
  name: string;
  description: string;
  language: string;
  code: string;
  filePath?: string;
}

export class CodeTemplateGenerator {
  generateServiceTemplate(
    feature: Feature,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _techStack?: TechStack
  ): CodeSnippet {
    // techStack parameter reserved for future use
    const featureName = feature.name;
    const serviceName = `${featureName}Service`;
    const featureSlug = featureName.toLowerCase().replace(/\s+/g, '-');
    const filePath = `lib/services/${featureSlug}-service.ts`;

    const code = `import type { ${featureName} } from '@/types/${featureSlug}';

export class ${serviceName} {
  private appId: string;

  constructor(appId: string) {
    if (!appId) {
      throw new Error('appId is required');
    }
    this.appId = appId;
  }

  async getAll(filters?: Record<string, unknown>, pagination?: { limit?: number; offset?: number }): Promise<${featureName}[]> {
    try {
      // TODO: Implement getAll logic
      // - Apply filters
      // - Apply pagination
      // - Add caching (1 minute TTL)
      // - Return results
      
      return [];
    } catch (error) {
      console.error(\`[${serviceName}] Error in getAll:\`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<${featureName} | null> {
    try {
      if (!id) {
        throw new Error('id is required');
      }
      
      // TODO: Implement getById logic
      // - Validate id format
      // - Add caching (1 minute TTL)
      // - Return result or null
      
      return null;
    } catch (error) {
      console.error(\`[${serviceName}] Error in getById:\`, error);
      throw error;
    }
  }

  async create(data: Record<string, unknown>): Promise<${featureName}> {
    try {
      // TODO: Implement create logic
      // - Validate input data (Zod schema)
      // - Add appId scoping
      // - Create entity
      // - Invalidate cache
      // - Return created entity
      
      throw new Error('Not implemented');
    } catch (error) {
      console.error(\`[${serviceName}] Error in create:\`, error);
      throw error;
    }
  }

  async update(id: string, data: Record<string, unknown>): Promise<${featureName}> {
    try {
      if (!id) {
        throw new Error('id is required');
      }
      
      // TODO: Implement update logic
      // - Validate id parameter
      // - Validate input data (Zod schema)
      // - Check resource ownership
      // - Update entity
      // - Invalidate cache
      // - Return updated entity
      
      throw new Error('Not implemented');
    } catch (error) {
      console.error(\`[${serviceName}] Error in update:\`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('id is required');
      }
      
      // TODO: Implement delete logic
      // - Validate id parameter
      // - Check resource ownership
      // - Soft delete (set deleted_at timestamp)
      // - Invalidate cache
      
      throw new Error('Not implemented');
    } catch (error) {
      console.error(\`[${serviceName}] Error in delete:\`, error);
      throw error;
    }
  }
}`;

    return {
      name: `${serviceName} Template`,
      description: `Service class template for ${featureName}`,
      language: 'typescript',
      code,
      filePath,
    };
  }

  generateAPIRouteTemplate(
    feature: Feature,
    endpoint: { method: string; path: string; description: string },
    techStack?: TechStack
  ): CodeSnippet {
    const featureName = feature.name;
    const featureSlug = featureName.toLowerCase().replace(/\s+/g, '-');
    const method = endpoint.method.toUpperCase();

    // Extract path, removing /api prefix if present
    let cleanPath = endpoint.path;
    if (cleanPath.startsWith('/api/')) {
      cleanPath = cleanPath.substring(5); // Remove '/api/'
    } else if (cleanPath.startsWith('api/')) {
      cleanPath = cleanPath.substring(4); // Remove 'api/'
    }

    const pathParts = cleanPath.split('/').filter(Boolean);

    let filePath: string;
    if (techStack?.framework === 'nextjs') {
      // Next.js 15 app router structure
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && (lastPart.startsWith(':') || lastPart.startsWith('['))) {
        // Dynamic route: [id] or :id
        const dynamicPart = lastPart.startsWith(':') ? `[${lastPart.substring(1)}]` : lastPart;
        filePath = `app/api/${pathParts.slice(0, -1).join('/')}/${dynamicPart}/route.ts`;
      } else {
        filePath = `app/api/${pathParts.join('/')}/route.ts`;
      }
    } else {
      filePath = `src/api/${featureSlug}/routes.ts`;
    }

    const code =
      techStack?.framework === 'nextjs'
        ? this.generateNextJSRoute(endpoint, method)
        : this.generateGenericRoute(endpoint, method);

    return {
      name: `${method} ${endpoint.path} Route`,
      description: endpoint.description,
      language: 'typescript',
      code,
      filePath,
    };
  }

  private generateNextJSRoute(endpoint: { method: string; path: string }, method: string): string {
    return `import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { requireAuth } from '@/lib/middleware/auth';
// import { ${endpoint.method === 'POST' ? 'create' : endpoint.method === 'PATCH' ? 'update' : 'get'}Service } from '@/lib/services/${endpoint.path.split('/')[2]}-service';

export async function ${method}(request: NextRequest) {
  try {
    // Get cookies for session management
    const cookieStore = await cookies();
    
    // TODO: Add authentication middleware
    // const user = await requireAuth(request);
    
    if (request.method === '${method}') {
      ${
        method === 'GET'
          ? `// TODO: Implement GET logic
      // - Get query parameters: const { searchParams } = new URL(request.url);
      // - Call service method
      // - Return response
      
      return NextResponse.json({ message: 'Not implemented' }, { status: 501 });`
          : method === 'POST' || method === 'PATCH'
            ? `// TODO: Implement ${method} logic
      // - Parse request body: const body = await request.json();
      // - Validate input (Zod schema)
      // - Call service method
      // - Return response
      
      return NextResponse.json({ message: 'Not implemented' }, { status: 501 });`
            : `// TODO: Implement ${method} logic
      // - Get route parameters
      // - Call service method
      // - Return response
      
      return NextResponse.json({ message: 'Not implemented' }, { status: 501 });`
      }
    }
    
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error: unknown) {
    console.error(\`[API] Error in ${method} ${endpoint.path}:\`, error);
    
    // Handle different error types
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;
  }

  private generateGenericRoute(endpoint: { method: string; path: string }, method: string): string {
    return `import { Request, Response } from 'express';
// import { requireAuth } from '@/middleware/auth';
// import { ${endpoint.method === 'POST' ? 'create' : endpoint.method === 'PATCH' ? 'update' : 'get'}Service } from '@/services/${endpoint.path.split('/')[2]}-service';

export async function ${method.toLowerCase()}${endpoint.path
      .split('/')
      .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')}Handler(
  req: Request,
  res: Response
) {
  try {
    // TODO: Add authentication middleware
    // const user = await requireAuth(req);
    
    ${
      method === 'GET'
        ? `// TODO: Implement GET logic
    // - Get query parameters: req.query
    // - Call service method
    // - Return response
    
    res.status(501).json({ message: 'Not implemented' });`
        : method === 'POST' || method === 'PATCH'
          ? `// TODO: Implement ${method} logic
    // - Parse request body: req.body
    // - Validate input (Zod schema)
    // - Call service method
    // - Return response
    
    res.status(501).json({ message: 'Not implemented' });`
          : `// TODO: Implement ${method} logic
    // - Get route parameters: req.params
    // - Call service method
    // - Return response
    
    res.status(501).json({ message: 'Not implemented' });`
    }
  } catch (error: unknown) {
    console.error(\`[API] Error in ${method} ${endpoint.path}:\`, error);
    
    // Handle different error types
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}`;
  }

  generateComponentTemplate(
    feature: Feature,
    componentName: string,
    techStack?: TechStack
  ): CodeSnippet {
    const featureName = feature.name;
    const featureSlug = featureName.toLowerCase().replace(/\s+/g, '-');
    const filePath =
      techStack?.framework === 'nextjs'
        ? `app/${featureSlug}/${componentName.toLowerCase()}/page.tsx`
        : `src/components/${featureSlug}/${componentName}.tsx`;

    const code =
      techStack?.framework === 'nextjs'
        ? this.generateNextJSComponent(componentName, featureName)
        : this.generateReactComponent(componentName, featureName);

    return {
      name: `${componentName} Component`,
      description: `${componentName} component for ${featureName}`,
      language: 'typescript',
      code,
      filePath,
    };
  }

  private generateNextJSComponent(componentName: string, featureName: string): string {
    return `'use client';

import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/auth/hooks';

export default function ${componentName}() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with proper type based on your API response
  const [data, setData] = useState<unknown[]>([]);
  
  // TODO: Add authentication
  // const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // TODO: Fetch data from API
        // const response = await fetch('/api/${featureName.toLowerCase().replace(/\s+/g, '-')}');
        // const result = await response.json();
        // setData(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-text-light">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-text mb-4">${componentName}</h1>
      {/* TODO: Implement component UI */}
    </div>
  );
}`;
  }

  private generateReactComponent(componentName: string, featureName: string): string {
    return `import React, { useState, useEffect } from 'react';

interface ${componentName}Props {
  // TODO: Define props
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with proper type based on your API response
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // TODO: Fetch data from API
        // const response = await fetch('/api/${featureName.toLowerCase().replace(/\s+/g, '-')}');
        // const result = await response.json();
        // setData(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>${componentName}</h1>
      {/* TODO: Implement component UI */}
    </div>
  );
};`;
  }

  generateMigrationTemplate(feature: Feature, techStack?: TechStack): CodeSnippet {
    const featureName = feature.name;
    const featureSlug = featureName.toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const fileName = `${timestamp}_create_${featureSlug}_table.sql`;

    let code: string;
    if (techStack?.database === 'postgresql' || techStack?.backend === 'supabase') {
      code = this.generatePostgreSQLMigration(featureName, featureSlug);
    } else {
      code = this.generateGenericMigration(featureName, featureSlug);
    }

    return {
      name: `Migration: Create ${featureName} Table`,
      description: `Database migration for ${featureName}`,
      language: 'sql',
      code,
      filePath: `migrations/${fileName}`,
    };
  }

  private generatePostgreSQLMigration(featureName: string, featureSlug: string): string {
    return `-- Migration: Create ${featureName} table
-- Created: ${new Date().toISOString()}

-- Create table
CREATE TABLE IF NOT EXISTS ${featureSlug} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL,
  -- TODO: Add feature-specific columns
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Foreign keys
  CONSTRAINT fk_${featureSlug}_app FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_${featureSlug}_app_id ON ${featureSlug}(app_id);
CREATE INDEX IF NOT EXISTS idx_${featureSlug}_status ON ${featureSlug}(status);
CREATE INDEX IF NOT EXISTS idx_${featureSlug}_created_at ON ${featureSlug}(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_${featureSlug}_updated_at
  BEFORE UPDATE ON ${featureSlug}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (if using Supabase)
-- ALTER TABLE ${featureSlug} ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (if using Supabase)
-- CREATE POLICY "${featureSlug}_select_policy" ON ${featureSlug}
--   FOR SELECT
--   USING (app_id IN (SELECT app_id FROM app_members WHERE user_id = auth.uid()));
--
-- CREATE POLICY "${featureSlug}_insert_policy" ON ${featureSlug}
--   FOR INSERT
--   WITH CHECK (app_id IN (SELECT app_id FROM app_members WHERE user_id = auth.uid()));
--
-- CREATE POLICY "${featureSlug}_update_policy" ON ${featureSlug}
--   FOR UPDATE
--   USING (app_id IN (SELECT app_id FROM app_members WHERE user_id = auth.uid()));
--
-- CREATE POLICY "${featureSlug}_delete_policy" ON ${featureSlug}
--   FOR DELETE
--   USING (app_id IN (SELECT app_id FROM app_members WHERE user_id = auth.uid()));

-- Rollback (down migration)
-- DROP TRIGGER IF EXISTS update_${featureSlug}_updated_at ON ${featureSlug};
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS ${featureSlug};`;
  }

  private generateGenericMigration(featureName: string, featureSlug: string): string {
    return `-- Migration: Create ${featureName} table
-- Created: ${new Date().toISOString()}

-- Create table
CREATE TABLE IF NOT EXISTS ${featureSlug} (
  id VARCHAR(36) PRIMARY KEY,
  app_id VARCHAR(36) NOT NULL,
  -- TODO: Add feature-specific columns
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  -- Foreign keys
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_${featureSlug}_app_id ON ${featureSlug}(app_id);
CREATE INDEX idx_${featureSlug}_status ON ${featureSlug}(status);
CREATE INDEX idx_${featureSlug}_created_at ON ${featureSlug}(created_at);

-- Rollback (down migration)
-- DROP TABLE IF EXISTS ${featureSlug};`;
  }

  generateValidationSchemaTemplate(feature: Feature, operation: 'create' | 'update'): CodeSnippet {
    const featureName = feature.name;
    const featureSlug = featureName.toLowerCase().replace(/\s+/g, '-');
    const filePath = `lib/validation/${featureSlug}-schema.ts`;

    const code = `import { z } from 'zod';

export const ${operation === 'create' ? 'create' : 'update'}${featureName.replace(/\s+/g, '')}Schema = z.object({
  // TODO: Add validation fields
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export type ${operation === 'create' ? 'Create' : 'Update'}${featureName.replace(/\s+/g, '')}Input = z.infer<typeof ${operation === 'create' ? 'create' : 'update'}${featureName.replace(/\s+/g, '')}Schema>;`;

    return {
      name: `${operation === 'create' ? 'Create' : 'Update'} ${featureName} Validation Schema`,
      description: `Zod validation schema for ${operation} ${featureName}`,
      language: 'typescript',
      code,
      filePath,
    };
  }
}
