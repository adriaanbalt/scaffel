# Scaffel - Template System

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:** adriaanbalt

---

## Overview

The template system is the core of Scaffel. It provides configurable templates that generate both documentation and code from product requirements. This document describes the template system architecture, template structure, and how templates are used.

---

## Template System Architecture

### Template Hierarchy

```
Templates
├── Base Templates (Roadmap Structure)
│   ├── roadmap.md
│   ├── status.md
│   └── README.md
│
├── Phase Templates
│   ├── foundation.md
│   ├── core-features.md
│   └── ...
│
├── Checklist Templates
│   ├── database-checklist.md
│   ├── api-checklist.md
│   └── ...
│
├── Specification Templates
│   ├── database-schema.sql
│   ├── api-contract.yaml
│   └── ...
│
└── Code Templates
    ├── database/
    ├── api/
    ├── components/
    └── tests/
```

### Template Engine

The template system uses a template engine (e.g., Handlebars, Mustache, or custom) that supports:

- **Variables:** `{{variableName}}`
- **Conditionals:** `{{#if condition}}...{{/if}}`
- **Loops:** `{{#each items}}...{{/each}}`
- **Includes:** `{{> partial}}`
- **Helpers:** `{{formatDate date}}`

---

## Base Templates

### Roadmap Template

**File:** `templates/base/roadmap.md`

```markdown
# {{product.name}} Implementation Roadmap

**Creation Date:** {{date}}
**Updated Date:** {{date}}
**Github username:** {{author}}

---

## Overview

This document provides a sequential implementation plan for {{product.name}}'s technical features.

**Estimated Total Timeline:** {{timeline.total}} weeks

---

## Implementation Phases

{{#each phases}}
### Phase {{number}}: {{name}} (Weeks {{timeline.start}}-{{timeline.end}})
**Goal:** {{goal}}

{{#each features}}
#### {{number}}. {{name}}
**File:** `../technical-implementation-guide.md#{{slug}}`
**Estimated Time:** {{estimatedTime.days}} days
**Priority:** {{priority}}

**Prerequisites:**
{{#each prerequisites}}
- {{this}}
{{/each}}

**Dependencies:**
{{#each dependencies}}
- {{this}}
{{/each}}

**Blocks:**
{{#each blocks}}
- {{this}}
{{/each}}

**Checklist:** See [checklists/{{number}}-{{slug}}-checklist.md](./checklists/{{number}}-{{slug}}-checklist.md)

**Key Deliverables:**
{{#each deliverables}}
- {{this}}
{{/each}}

---
{{/each}}
{{/each}}
```

### Status Template

**File:** `templates/base/status.md`

```markdown
# {{product.name}} Implementation Status

**Creation Date:** {{date}}
**Updated Date:** {{date}}
**Github username:** {{author}}

---

## Overview

This document tracks the implementation progress of {{product.name}}'s technical features.

**Status Legend:**
- ✅ **Complete** - Feature fully implemented, tested, documented
- 🚧 **In Progress** - Currently being worked on
- ⏳ **Pending** - Not started yet
- 🔴 **Blocked** - Cannot proceed due to dependencies

---

## Overall Progress

**Total Features:** {{features.total}}
**Completed:** {{features.completed}}
**In Progress:** {{features.inProgress}}
**Pending:** {{features.pending}}
**Blocked:** {{features.blocked}}

**Completion:** {{features.percentage}}%

---

{{#each phases}}
## Phase {{number}}: {{name}}

**Status:** {{status}}
**Started:** {{started}}
**Completed:** {{completed}}
**Target Completion:** {{target}}

### Features

{{#each features}}
#### {{number}}. {{name}}
- **Status:** {{status}}
- **Started:** {{started}}
- **Completed:** {{completed}}
- **Blocked By:** {{blockedBy}}
- **Blocks:** {{blocks}}
- **Notes:** {{notes}}
- **Checklist:** [checklists/{{number}}-{{slug}}-checklist.md](./checklists/{{number}}-{{slug}}-checklist.md)

---
{{/each}}
{{/each}}
```

---

## Checklist Templates

### Database Checklist Template

**File:** `templates/checklists/database-checklist.md`

```markdown
# {{feature.name}} Implementation Checklist

**Feature:** {{feature.name}}
**Phase:** {{phase.number}} - {{phase.name}}
**Estimated Time:** {{feature.estimatedTime.days}} days
**Priority:** {{feature.priority}}

---

## Prerequisites

{{#each prerequisites}}
- [ ] {{this}}
{{/each}}

---

## Implementation Tasks

### 1. Core Implementation

{{#each implementationTasks}}
- [ ] {{this}}
{{/each}}

### 2. API Routes

{{#if includeAPI}}
{{#each apiRoutes}}
- [ ] {{this}}
{{/each}}
{{/if}}

### 3. React Components

{{#if includeComponents}}
{{#each components}}
- [ ] {{this}}
{{/each}}
{{/if}}

### 4. Testing

{{#each testingTasks}}
- [ ] {{this}}
{{/each}}

### 5. Documentation

{{#each documentationTasks}}
- [ ] {{this}}
{{/each}}

---

## Completion Criteria

{{#each completionCriteria}}
- [ ] {{this}}
{{/each}}

---

## Notes

*Implementation notes, deviations, or considerations*
```

---

## Code Templates

### Database Migration Template

**File:** `templates/code/database/migration.sql`

```sql
-- Migration: {{migration.name}}
-- Created: {{date}}
-- Feature: {{feature.name}}

{{#if createTable}}
CREATE TABLE IF NOT EXISTS {{table.name}} (
  {{#each table.columns}}
  {{name}} {{type}}{{#if constraints}} {{constraints}}{{/if}}{{#if notNull}} NOT NULL{{/if}}{{#if default}} DEFAULT {{default}}{{/if}}{{#unless @last}},{{/unless}}
  {{/each}}
);

{{#if indexes}}
{{#each indexes}}
CREATE INDEX IF NOT EXISTS {{name}} ON {{table.name}} ({{columns}});
{{/each}}
{{/if}}

{{#if foreignKeys}}
{{#each foreignKeys}}
ALTER TABLE {{table.name}} ADD CONSTRAINT {{name}} FOREIGN KEY ({{column}}) REFERENCES {{references.table}} ({{references.column}}) ON DELETE {{onDelete}};
{{/each}}
{{/if}}

{{#if rls}}
ALTER TABLE {{table.name}} ENABLE ROW LEVEL SECURITY;

{{#each rlsPolicies}}
CREATE POLICY {{name}} ON {{table.name}} FOR {{operation}} USING ({{condition}});
{{/each}}
{{/if}}
{{/if}}

{{#if alterTable}}
ALTER TABLE {{table.name}}
{{#each alterations}}
  {{operation}} {{details}}{{#unless @last}},{{/unless}}
{{/each}};
{{/if}}
```

### API Route Template

**File:** `templates/code/api/route.ts`

```typescript
// API Route: {{route.path}}
// Method: {{route.method}}
// Feature: {{feature.name}}

import { NextRequest, NextResponse } from 'next/server';
import { {{serviceName}} } from '@/lib/services/{{serviceSlug}}';
import { requireAuth } from '@/lib/auth/server';
import { validateRequest } from '@/lib/validation';
import { handleError } from '@/lib/errors';

{{#if requestSchema}}
const {{requestSchemaName}} = {{requestSchema}};
{{/if}}

export async function {{route.methodFunction}}(request: NextRequest) {
  try {
    // Authentication
    {{#if requireAuth}}
    const user = await requireAuth(request);
    {{/if}}
    
    // Validation
    {{#if requestBody}}
    const body = await request.json();
    const validated = validateRequest({{requestSchemaName}}, body);
    {{/if}}
    
    // Business Logic
    {{#if query}}
    const result = await {{serviceName}}.{{method}}({{#if requestBody}}validated{{/if}}{{#if queryParams}}, request.nextUrl.searchParams{{/if}});
    {{else}}
    const result = await {{serviceName}}.{{method}}({{#if requestBody}}validated{{/if}});
    {{/if}}
    
    // Response
    return NextResponse.json(result, { status: {{statusCode}} });
  } catch (error) {
    return handleError(error);
  }
}
```

### React Component Template

**File:** `templates/code/components/component.tsx`

```typescript
// Component: {{component.name}}
// Feature: {{feature.name}}

'use client';

import { useState, useEffect } from 'react';
import { {{hookName}} } from '@/hooks/{{hookSlug}}';
{{#if uiComponents}}
import { {{uiComponents}} } from '@/components/ui';
{{/if}}

interface {{component.name}}Props {
  {{#each props}}
  {{name}}{{#unless required}}?{{/unless}}: {{type}};
  {{/each}}
}

export function {{component.name}}({{#if props}}{ {{propsString}} }: {{component.name}}Props{{/if}}) {
  {{#if useHook}}
  const { {{hookReturn}} } = {{hookName}}({{hookArgs}});
  {{/if}}
  
  {{#if state}}
  const [{{state.name}}, set{{state.name}}] = useState<{{state.type}}>({{state.initial}});
  {{/if}}
  
  {{#if effects}}
  useEffect(() => {
    {{effectLogic}}
  }, [{{dependencies}}]);
  {{/if}}
  
  return (
    <div className="{{className}}">
      {{#if children}}
      {children}
      {{/if}}
    </div>
  );
}
```

---

## Template Variables

### Product Variables

```typescript
{
  product: {
    name: string;
    description: string;
    type: 'saas' | 'ecommerce' | 'mobile' | 'api';
    domain?: string;
  };
}
```

### Feature Variables

```typescript
{
  feature: {
    id: string;
    name: string;
    description: string;
    type: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedTime: {
      days: number;
      weeks: number;
    };
    prerequisites: string[];
    dependencies: string[];
    blocks: string[];
    deliverables: string[];
  };
}
```

### Phase Variables

```typescript
{
  phase: {
    number: number;
    name: string;
    goal: string;
    features: Feature[];
    estimatedTime: TimeEstimate;
    timeline: {
      start: number;
      end: number;
    };
  };
}
```

### Tech Stack Variables

```typescript
{
  techStack: {
    framework: 'nextjs' | 'react' | 'vue' | 'angular';
    backend: 'supabase' | 'firebase' | 'custom';
    database: 'postgresql' | 'mysql' | 'mongodb';
    language: 'typescript' | 'javascript';
    styling: 'tailwind' | 'css' | 'styled-components';
  };
}
```

---

## Template Customization

### Custom Templates

Users can provide custom templates:

```bash
scaffel generate \
  --template-dir=./custom-templates \
  --product="My App"
```

### Template Overrides

Users can override specific templates:

```json
{
  "templateOverrides": {
    "checklist": "./custom-templates/my-checklist.md",
    "api-route": "./custom-templates/my-api-route.ts"
  }
}
```

### Template Inheritance

Templates can inherit from base templates:

```markdown
{{!-- templates/custom/checklist.md --}}
{{> base/checklist}}

{{!-- Custom additions --}}
## Custom Section

{{customContent}}
```

---

## Template Helpers

### Built-in Helpers

```typescript
// Date formatting
{{formatDate date 'YYYY-MM-DD'}}

// String manipulation
{{capitalize string}}
{{lowercase string}}
{{uppercase string}}
{{slugify string}}

// Array operations
{{join array ', '}}
{{length array}}
{{first array}}
{{last array}}

// Conditional helpers
{{#ifEquals a b}}...{{/ifEquals}}
{{#ifGreater a b}}...{{/ifGreater}}

// Number formatting
{{formatNumber number}}
{{formatTime time}}
```

### Custom Helpers

Users can register custom helpers:

```typescript
templateEngine.registerHelper('featureType', (feature: Feature) => {
  return feature.type.toLowerCase();
});

templateEngine.registerHelper('estimatedDays', (feature: Feature) => {
  return feature.estimatedTime.days;
});
```

---

## Template Loading

### Template Resolution

Templates are resolved in this order:

1. User-provided custom templates
2. Product-type-specific templates
3. Tech-stack-specific templates
4. Default base templates

### Template Caching

Templates are cached after first load:

```typescript
class TemplateManager {
  private cache: Map<string, Template> = new Map();
  
  loadTemplate(name: string): Template {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    
    const template = this.loadFromDisk(name);
    this.cache.set(name, template);
    return template;
  }
}
```

---

## Template Validation

### Template Syntax Validation

Templates are validated before use:

```typescript
interface TemplateValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

function validateTemplate(template: Template): TemplateValidation {
  // Check syntax
  // Check required variables
  // Check helper availability
  // Check includes
}
```

### Variable Validation

Variables are validated before rendering:

```typescript
function validateVariables(
  template: Template,
  variables: Variables
): ValidationResult {
  const required = extractRequiredVariables(template);
  const missing = required.filter(v => !(v in variables));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required variables: ${missing.join(', ')}`]
    };
  }
  
  return { valid: true };
}
```

---

## Template Examples

### Example: SaaS Product

```markdown
# {{product.name}} Roadmap

## Phase 1: Foundation
- Authentication
- Database Schema
- Multi-Tenant Setup

## Phase 2: Core Features
- User Management
- Subscription System
- Payment Integration
```

### Example: E-commerce Product

```markdown
# {{product.name}} Roadmap

## Phase 1: Foundation
- Product Catalog
- Shopping Cart
- Checkout System

## Phase 2: Core Features
- Payment Processing
- Order Management
- Inventory System
```

---

**Last Updated:** January 6, 2026 at 8:31 PM

