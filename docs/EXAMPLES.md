# Scaffel - Examples & Case Studies

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:** adriaanbalt

---

## Overview

This document provides practical examples and case studies of using Scaffel. It demonstrates real-world usage patterns and shows how the tool can be applied to different types of products.

---

## Quick Start Examples

### Example 1: Basic SaaS App

**Goal:** Generate a roadmap for a simple SaaS application with authentication and user management.

**Command:**
```bash
scaffel generate \
  --product="TaskManager Pro" \
  --type=saas \
  --features="auth,users,tasks" \
  --tech-stack=nextjs,supabase,typescript
```

**Output:**
- Complete roadmap with 3 phases
- 8 features organized by dependencies
- Checklists for each feature
- Estimated timeline: 6-8 weeks

---

### Example 2: E-commerce Platform

**Goal:** Generate a roadmap for an e-commerce platform with product catalog, cart, and payments.

**Command:**
```bash
scaffel generate \
  --product="ShopEasy" \
  --type=ecommerce \
  --features="catalog,cart,checkout,payments,inventory" \
  --tech-stack=nextjs,postgresql,typescript
```

**Output:**
- Complete roadmap with 4 phases
- 12 features with proper dependencies
- Database schemas for products, orders, payments
- API contracts for all endpoints
- Estimated timeline: 10-12 weeks

---

### Example 3: Mobile App Backend

**Goal:** Generate a roadmap for a mobile app backend API.

**Command:**
```bash
scaffel generate \
  --product="FitnessTracker API" \
  --type=api \
  --features="auth,users,workouts,progress,notifications" \
  --tech-stack=express,postgresql,typescript
```

**Output:**
- API-focused roadmap
- RESTful API specifications
- Database schemas
- Authentication and authorization
- Estimated timeline: 8-10 weeks

---

## Configuration File Examples

### Example 1: Full SaaS Configuration

**File:** `scaffel.config.json`

```json
{
  "product": {
    "name": "ProjectManager SaaS",
    "description": "A project management SaaS platform for teams",
    "type": "saas",
    "domain": "projectmanager.com"
  },
  "techStack": {
    "framework": "nextjs",
    "backend": "supabase",
    "database": "postgresql",
    "language": "typescript",
    "styling": "tailwind"
  },
  "features": [
    {
      "name": "authentication",
      "description": "User authentication with email and OAuth",
      "priority": "critical",
      "dependencies": [],
      "estimatedTime": {
        "days": 5,
        "weeks": 1
      }
    },
    {
      "name": "projects",
      "description": "Project creation and management",
      "priority": "critical",
      "dependencies": ["authentication"],
      "estimatedTime": {
        "days": 7,
        "weeks": 1.5
      }
    },
    {
      "name": "tasks",
      "description": "Task management within projects",
      "priority": "high",
      "dependencies": ["projects"],
      "estimatedTime": {
        "days": 5,
        "weeks": 1
      }
    },
    {
      "name": "payments",
      "description": "Subscription and payment processing",
      "priority": "high",
      "dependencies": ["authentication"],
      "estimatedTime": {
        "days": 10,
        "weeks": 2
      }
    }
  ],
  "options": {
    "multiTenant": true,
    "includeAdmin": true,
    "includeTests": true,
    "includeDocs": true,
    "codeGeneration": true
  }
}
```

**Usage:**
```bash
scaffel generate --config=scaffel.config.json
```

---

### Example 2: Minimal Configuration

**File:** `scaffel.config.json`

```json
{
  "product": {
    "name": "Simple Blog",
    "type": "saas"
  },
  "features": [
    "auth",
    "posts",
    "comments"
  ],
  "techStack": {
    "framework": "nextjs"
  }
}
```

**Usage:**
```bash
scaffel generate --config=scaffel.config.json
```

---

## Code Generation Examples

### Example 1: Generate Phase 1 Foundation

**Command:**
```bash
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --phase=1 \
  --output=./my-app \
  --format=nextjs \
  --language=typescript
```

**Generated Files:**
```
my-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── signup/route.ts
│   │       └── callback/route.ts
│   └── (auth)/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── lib/
│   ├── auth/
│   │   ├── adapter.ts
│   │   └── server.ts
│   └── services/
│       └── auth-service.ts
├── database/
│   └── migrations/
│       ├── 001_create_users_table.sql
│       └── 002_create_sessions_table.sql
└── tests/
    ├── api/auth.test.ts
    └── lib/auth.test.ts
```

---

### Example 2: Generate Specific Feature

**Command:**
```bash
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --feature=payments \
  --output=./my-app \
  --format=nextjs
```

**Generated Files:**
```
my-app/
├── app/
│   └── api/
│       └── payments/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── webhook/route.ts
├── lib/
│   ├── services/
│   │   └── payments-service.ts
│   └── integrations/
│       └── stripe-adapter.ts
├── database/
│   └── migrations/
│       └── 010_create_payments_table.sql
└── tests/
    └── api/payments.test.ts
```

---

## Programmatic API Examples

### Example 1: Generate Roadmap Programmatically

```typescript
import { ScaffelGenerator } from 'scaffel';

const generator = new ScaffelGenerator({
  product: {
    name: 'My SaaS App',
    description: 'A SaaS platform for...',
    type: 'saas'
  },
  features: [
    {
      name: 'authentication',
      priority: 'critical',
      dependencies: []
    },
    {
      name: 'payments',
      priority: 'high',
      dependencies: ['authentication']
    }
  ],
  techStack: {
    framework: 'nextjs',
    backend: 'supabase',
    database: 'postgresql',
    language: 'typescript'
  }
});

const roadmap = await generator.generate();

// Save to file
await generator.save(roadmap, './roadmap');
```

---

### Example 2: Generate Code Scaffolds

```typescript
import { CodeGenerator } from 'scaffel';

const codeGenerator = new CodeGenerator({
  roadmap: roadmap, // From previous example
  outputDir: './my-app',
  format: 'nextjs',
  language: 'typescript',
  options: {
    includeTests: true,
    includeDocs: true
  }
});

const codeFiles = await codeGenerator.generate({
  phase: 1 // Generate only Phase 1
});

// codeFiles contains all generated files
console.log(`Generated ${codeFiles.length} files`);
```

---

### Example 3: Custom Generator

```typescript
import { Generator, Feature } from 'scaffel';

class CustomGenerator implements Generator {
  generate(feature: Feature): CodeFiles {
    // Custom generation logic
    return [
      {
        path: `custom/${feature.name}.ts`,
        content: this.generateCustomCode(feature)
      }
    ];
  }
  
  private generateCustomCode(feature: Feature): string {
    return `// Custom code for ${feature.name}`;
  }
}

// Register custom generator
const generator = new ScaffelGenerator({
  // ... config
  customGenerators: {
    'custom-feature': new CustomGenerator()
  }
});
```

---

## Case Studies

### Case Study 1: Markense (Original)

**Product:** Marketing Operations Platform  
**Type:** Multi-tenant SaaS  
**Features:** 38 features across 10 phases  
**Timeline:** 42 weeks estimated

**Roadmap Structure:**
- Phase 1: Foundation (Database, Auth, Multi-tenant)
- Phase 2: Core Features (Actions, Content, Playbooks)
- Phase 3: Advanced Features (AI, Brand Kit, Calendar)
- Phase 4: Integrations (OAuth, Webhooks, Email)
- Phase 5: Distribution (Multi-platform content distribution)
- Phase 6: Optimization (Caching, Performance)
- Phase 7: Business Logic (Subscriptions, Jobs)
- Phase 8: Production Ready (Security, Testing, Deployment)
- Phase 9: Admin Section (Platform administration)
- Phase 10: Compliance (GDPR, SOC2)

**Key Learnings:**
- Dependency management is critical
- Checklists ensure nothing is missed
- Specifications enable code generation
- Patterns ensure consistency

---

### Case Study 2: E-commerce Platform

**Product:** Online Store  
**Type:** E-commerce  
**Features:** 15 features across 4 phases  
**Timeline:** 12 weeks estimated

**Generated Roadmap:**
- Phase 1: Foundation (Catalog, Cart, Checkout)
- Phase 2: Core Features (Payments, Orders, Inventory)
- Phase 3: Advanced Features (Reviews, Recommendations, Search)
- Phase 4: Production (Performance, Security, Analytics)

**Generated Code:**
- Database: Products, Orders, Payments, Inventory tables
- API: RESTful endpoints for all operations
- Components: Product listing, Cart, Checkout flow
- Tests: Unit, integration, E2E tests

**Result:**
- 80% of foundation code generated automatically
- 2 weeks saved in initial setup
- Consistent code patterns throughout

---

### Case Study 3: Mobile App Backend

**Product:** Fitness Tracker API  
**Type:** REST API  
**Features:** 12 features across 3 phases  
**Timeline:** 8 weeks estimated

**Generated Roadmap:**
- Phase 1: Foundation (Auth, Users, Core API)
- Phase 2: Features (Workouts, Progress, Social)
- Phase 3: Advanced (Analytics, Notifications, Integrations)

**Generated Code:**
- API Routes: RESTful endpoints
- Database: Schemas for all entities
- Authentication: JWT-based auth
- Documentation: OpenAPI specs

**Result:**
- Complete API structure in 1 day
- All endpoints documented
- Ready for mobile app integration

---

## Advanced Usage

### Example 1: Custom Templates

**Create custom template:**
```bash
mkdir -p custom-templates/checklists
```

**Custom checklist template:** `custom-templates/checklists/database-checklist.md`
```markdown
# {{feature.name}} Database Checklist

## Custom Prerequisites
{{#each customPrerequisites}}
- [ ] {{this}}
{{/each}}

## Standard Implementation
{{> base/checklists/database-checklist}}
```

**Use custom template:**
```bash
scaffel generate \
  --product="My App" \
  --template-dir=./custom-templates
```

---

### Example 2: Incremental Generation

**Generate initial roadmap:**
```bash
scaffel generate --product="My App" --features="auth,users"
```

**Add feature later:**
```bash
scaffel update \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --add-feature="payments"
```

**Regenerate only changed:**
```bash
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --feature=payments \
  --output=./my-app
```

---

### Example 3: Multi-Format Output

**Generate in multiple formats:**
```bash
# Markdown (default)
scaffel generate --product="My App" --format=markdown

# JSON
scaffel generate --product="My App" --format=json

# YAML
scaffel generate --product="My App" --format=yaml
```

---

## Integration Examples

### Example 1: GitHub Actions

**.github/workflows/roadmap.yml:**
```yaml
name: Generate Roadmap

on:
  push:
    branches: [main]
    paths:
      - 'scaffel.config.json'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g scaffel
      - run: scaffel generate --config=scaffel.config.json
      - run: scaffel scaffold --phase=1 --output=./generated
      - uses: actions/upload-artifact@v3
        with:
          name: roadmap
          path: |
            ./roadmap
            ./generated
```

---

### Example 2: VS Code Task

**.vscode/tasks.json:**
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Generate Roadmap",
      "type": "shell",
      "command": "scaffel generate --config=scaffel.config.json",
      "problemMatcher": []
    },
    {
      "label": "Scaffold Code",
      "type": "shell",
      "command": "scaffel scaffold --roadmap=./roadmap/00-implementation-roadmap.md --phase=1 --output=./src",
      "problemMatcher": []
    }
  ]
}
```

---

## Best Practices

### 1. Start Simple

Begin with basic features, add complexity incrementally:

```bash
# Start with foundation
scaffel generate --product="My App" --features="auth"

# Add features later
scaffel update --add-feature="payments"
```

### 2. Use Configuration Files

For complex products, use configuration files:

```bash
scaffel generate --config=scaffel.config.json
```

### 3. Validate Before Generating Code

Always validate roadmap before generating code:

```bash
scaffel validate --roadmap=./roadmap/00-implementation-roadmap.md
scaffel scaffold --roadmap=./roadmap/00-implementation-roadmap.md
```

### 4. Version Control

Commit roadmap and generated code:

```bash
git add roadmap/
git add generated/
git commit -m "Add roadmap and generated foundation code"
```

### 5. Customize Templates

Create custom templates for your team's conventions:

```bash
scaffel generate \
  --product="My App" \
  --template-dir=./team-templates
```

---

## Troubleshooting

### Issue: Circular Dependencies

**Error:**
```
Error: Circular dependency detected: auth -> payments -> auth
```

**Solution:**
```bash
# Review dependencies
scaffel validate --roadmap=./roadmap/00-implementation-roadmap.md

# Fix in config file
{
  "features": [
    {
      "name": "payments",
      "dependencies": ["auth"] // Remove circular dependency
    }
  ]
}
```

### Issue: Missing Templates

**Error:**
```
Error: Template not found: custom-checklist.md
```

**Solution:**
```bash
# Check template directory
ls custom-templates/checklists/

# Use correct path
scaffel generate --template-dir=./custom-templates
```

### Issue: Invalid Configuration

**Error:**
```
Error: Invalid product type: invalid
```

**Solution:**
```json
{
  "product": {
    "type": "saas" // Use valid type: saas, ecommerce, mobile, api
  }
}
```

---

**Last Updated:** January 6, 2026 at 8:31 PM

