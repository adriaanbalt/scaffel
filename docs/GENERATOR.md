# Scaffel - Code Generation System

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:** adriaanbalt

---

## Overview

The code generation system transforms roadmap specifications into working code. It reads specifications (database schemas, API contracts, component specs) and generates actual code files that can be used immediately.

---

## Generation Flow

```
Specifications → Code Generators → Code Files → Validation → Output
```

### Step-by-Step Process

1. **Read Specifications**
   - Database schemas from roadmap
   - API contracts (OpenAPI)
   - Component specifications
   - Integration specifications

2. **Select Generators**
   - Choose appropriate generator for each spec type
   - Load templates for code generation
   - Prepare generation context

3. **Generate Code**
   - Generate code files from templates
   - Apply patterns and best practices
   - Generate tests and documentation

4. **Validate Generated Code**
   - Syntax validation
   - Type checking (TypeScript)
   - Linting
   - Compilation check

5. **Write Output**
   - Write files to output directory
   - Create directory structure
   - Generate configuration files

---

## Generator Types

### 1. Database Generator

**Purpose:** Generate database migrations and schemas.

**Input:** Database schema specification
**Output:** SQL migration files, TypeScript types

**Example:**

```typescript
// Input: Schema Specification
const schema = {
  name: 'users',
  columns: [
    { name: 'id', type: 'uuid', primary: true },
    { name: 'email', type: 'text', unique: true, notNull: true },
    { name: 'name', type: 'text' },
    { name: 'created_at', type: 'timestamptz', default: 'now()' }
  ],
  indexes: [
    { name: 'idx_users_email', columns: ['email'] }
  ],
  rls: true
};

// Output: Migration File
// migrations/001_create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**Generated Files:**
- `migrations/XXX_create_users_table.sql`
- `types/database/users.ts` (TypeScript types)
- `lib/database/users.ts` (Query helpers)

---

### 2. API Generator

**Purpose:** Generate API routes and handlers.

**Input:** OpenAPI specification
**Output:** API route files, handlers, validation

**Example:**

```typescript
// Input: API Specification
const apiSpec = {
  path: '/api/users',
  method: 'GET',
  summary: 'List users',
  parameters: [
    { name: 'page', type: 'number', required: false },
    { name: 'limit', type: 'number', required: false }
  ],
  responses: {
    200: { schema: 'UserListResponse' },
    401: { schema: 'ErrorResponse' }
  }
};

// Output: API Route File
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users';
import { requireAuth } from '@/lib/auth/server';
import { validateQuery } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    const query = {
      page: request.nextUrl.searchParams.get('page') || '1',
      limit: request.nextUrl.searchParams.get('limit') || '10'
    };
    
    const validated = validateQuery(query, {
      page: { type: 'number', min: 1 },
      limit: { type: 'number', min: 1, max: 100 }
    });
    
    const users = await UsersService.list({
      page: validated.page,
      limit: validated.limit
    });
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
```

**Generated Files:**
- `app/api/users/route.ts`
- `app/api/users/[id]/route.ts` (if GET by ID)
- `lib/validation/users.ts` (validation schemas)
- `tests/api/users.test.ts` (API tests)

---

### 3. Component Generator

**Purpose:** Generate React components and hooks.

**Input:** Component specification
**Output:** Component files, hooks, types

**Example:**

```typescript
// Input: Component Specification
const componentSpec = {
  name: 'UserList',
  type: 'list',
  props: [
    { name: 'users', type: 'User[]', required: true },
    { name: 'onSelect', type: '(user: User) => void', required: false }
  ],
  state: [
    { name: 'selectedUser', type: 'User | null' }
  ],
  hooks: ['useUsers'],
  ui: ['Card', 'Button', 'Avatar']
};

// Output: Component File
// components/UserList.tsx
'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Card, Button, Avatar } from '@/components/ui';
import type { User } from '@/types';

interface UserListProps {
  users: User[];
  onSelect?: (user: User) => void;
}

export function UserList({ users, onSelect }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data, isLoading } = useUsers();
  
  const handleSelect = (user: User) => {
    setSelectedUser(user);
    onSelect?.(user);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <div className="flex items-center space-x-4">
            <Avatar src={user.avatar} alt={user.name} />
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <Button onClick={() => handleSelect(user)}>
              Select
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

**Generated Files:**
- `components/UserList.tsx`
- `hooks/useUsers.ts` (if needed)
- `types/components.ts` (component types)
- `tests/components/UserList.test.tsx` (component tests)

---

### 4. Test Generator

**Purpose:** Generate test files.

**Input:** Feature specification, code files
**Output:** Test files (unit, integration, E2E)

**Example:**

```typescript
// Input: Feature with API route
const feature = {
  name: 'User Management',
  apiRoutes: [
    { path: '/api/users', method: 'GET' },
    { path: '/api/users', method: 'POST' }
  ]
};

// Output: Test File
// tests/api/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const request = new NextRequest('http://localhost/api/users');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
    
    it('should require authentication', async () => {
      // Test without auth
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Test user creation
    });
    
    it('should validate input', async () => {
      // Test validation
    });
  });
});
```

**Generated Files:**
- `tests/api/users.test.ts` (API tests)
- `tests/components/UserList.test.tsx` (component tests)
- `tests/integration/users.test.ts` (integration tests)

---

## Generation Patterns

### Pattern Application

Generators apply patterns from the pattern library:

```typescript
class APIGenerator {
  generateRoute(spec: APISpec): RouteFile {
    const template = this.loadTemplate('api-route');
    const patterns = this.loadPatterns('api-patterns');
    
    // Apply patterns
    const code = template.render({
      ...spec,
      errorHandling: patterns.errorHandling,
      validation: patterns.validation,
      auth: patterns.auth
    });
    
    return { path: spec.path, content: code };
  }
}
```

### Pattern Examples

**Error Handling Pattern:**
```typescript
// Applied to all API routes
try {
  // Route logic
} catch (error) {
  return handleError(error);
}
```

**Validation Pattern:**
```typescript
// Applied to routes with request body
const body = await request.json();
const validated = validateRequest(schema, body);
```

**Authentication Pattern:**
```typescript
// Applied to protected routes
const user = await requireAuth(request);
```

---

## Code Quality

### Generated Code Standards

All generated code follows these standards:

1. **TypeScript:** Fully typed, no `any` types
2. **Error Handling:** Comprehensive error handling
3. **Validation:** Input validation on all endpoints
4. **Testing:** Tests generated for all code
5. **Documentation:** Comments and JSDoc
6. **Linting:** Follows project linting rules
7. **Formatting:** Consistent code formatting

### Code Validation

Generated code is validated before writing:

```typescript
class CodeValidator {
  validate(code: string, type: CodeType): ValidationResult {
    const checks = [
      this.checkSyntax(code, type),
      this.checkTypes(code, type),
      this.checkLinting(code, type),
      this.checkCompilation(code, type)
    ];
    
    return {
      valid: checks.every(c => c.valid),
      errors: checks.flatMap(c => c.errors),
      warnings: checks.flatMap(c => c.warnings)
    };
  }
}
```

---

## Incremental Generation

### Partial Generation

Generate only changed features:

```typescript
class IncrementalGenerator {
  generate(features: Feature[], previousOutput: Output): Output {
    const changed = this.detectChanges(features, previousOutput);
    
    return {
      new: this.generateNew(changed.new),
      updated: this.generateUpdated(changed.updated),
      unchanged: previousOutput.unchanged
    };
  }
}
```

### Change Detection

Detect what changed:

```typescript
function detectChanges(
  current: Feature[],
  previous: Feature[]
): ChangeSet {
  return {
    new: current.filter(f => !previous.find(p => p.id === f.id)),
    updated: current.filter(f => {
      const prev = previous.find(p => p.id === f.id);
      return prev && !deepEqual(f, prev);
    }),
    deleted: previous.filter(p => !current.find(f => f.id === p.id))
  };
}
```

---

## Multi-Format Generation

### Output Formats

Generate code in multiple formats:

```typescript
interface GenerationOptions {
  format: 'nextjs' | 'express' | 'fastify' | 'nest';
  language: 'typescript' | 'javascript';
  style: 'functional' | 'class-based';
  testing: 'vitest' | 'jest' | 'mocha';
}
```

### Format Adapters

Format-specific adapters:

```typescript
class FormatAdapter {
  adapt(code: Code, format: Format): Code {
    switch (format) {
      case 'nextjs':
        return this.adaptToNextJS(code);
      case 'express':
        return this.adaptToExpress(code);
      case 'fastify':
        return this.adaptToFastify(code);
    }
  }
}
```

---

## Code Organization

### Directory Structure

Generated code follows consistent structure:

```
generated/
├── app/                    # Application code
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── pages/             # Pages (if applicable)
├── lib/                    # Library code
│   ├── services/         # Business logic
│   ├── hooks/            # React hooks
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
├── tests/                 # Tests
│   ├── api/              # API tests
│   ├── components/       # Component tests
│   └── integration/      # Integration tests
└── database/              # Database
    └── migrations/       # Migration files
```

### File Naming

Consistent file naming conventions:

- Components: `PascalCase.tsx` (e.g., `UserList.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useUsers.ts`)
- Services: `PascalCase.ts` with `Service` suffix (e.g., `UsersService.ts`)
- Types: `camelCase.ts` (e.g., `users.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

---

## Configuration Generation

### Package.json

Generate `package.json` with dependencies:

```typescript
function generatePackageJson(options: Options): PackageJson {
  return {
    name: options.product.name.toLowerCase(),
    version: '0.1.0',
    dependencies: {
      'next': '^14.0.0',
      'react': '^18.0.0',
      'typescript': '^5.0.0',
      ...getDependenciesForFeatures(options.features)
    },
    devDependencies: {
      'vitest': '^1.0.0',
      '@types/node': '^20.0.0',
      ...getDevDependencies(options)
    }
  };
}
```

### TypeScript Config

Generate `tsconfig.json`:

```typescript
function generateTsConfig(options: Options): TsConfig {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      lib: ['ES2020', 'DOM'],
      jsx: 'preserve',
      strict: true,
      ...getCompilerOptions(options)
    },
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  };
}
```

### Environment Variables

Generate `.env.example`:

```typescript
function generateEnvExample(options: Options): string {
  const vars = [
    'DATABASE_URL=',
    'NEXT_PUBLIC_API_URL=',
    ...getEnvVarsForFeatures(options.features)
  ];
  
  return vars.join('\n');
}
```

---

## Testing Generated Code

### Compilation Test

Ensure generated code compiles:

```typescript
async function testCompilation(code: CodeFiles): Promise<boolean> {
  const result = await exec('tsc --noEmit', {
    cwd: code.directory
  });
  
  return result.exitCode === 0;
}
```

### Runtime Test

Ensure generated code runs:

```typescript
async function testRuntime(code: CodeFiles): Promise<boolean> {
  // Start dev server
  const server = await startDevServer(code.directory);
  
  // Run tests
  const result = await exec('npm test', {
    cwd: code.directory
  });
  
  // Stop server
  await server.stop();
  
  return result.exitCode === 0;
}
```

---

## Best Practices

### Do's

- ✅ Generate fully functional code
- ✅ Include comprehensive tests
- ✅ Follow project conventions
- ✅ Generate documentation
- ✅ Validate before writing
- ✅ Support incremental generation

### Don'ts

- ❌ Generate placeholder code
- ❌ Skip error handling
- ❌ Ignore type safety
- ❌ Generate untested code
- ❌ Overwrite user code
- ❌ Generate incomplete implementations

---

**Last Updated:** January 6, 2026 at 8:31 PM

