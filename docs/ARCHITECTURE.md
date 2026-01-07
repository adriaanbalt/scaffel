# Scaffel - System Architecture

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:** adriaanbalt

---

## Overview

This document describes the complete system architecture for Scaffel. The architecture is designed to be modular, extensible, and capable of generating both documentation and code from product requirements.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Input Layer                          │
│  (CLI, API, Config Files, Interactive Prompts)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Input Parser Layer                        │
│  - Product Description Parser                                │
│  - Feature List Parser                                       │
│  - Tech Stack Parser                                         │
│  - Requirements Parser                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Generator Engine                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Scaffel Generator                                     │  │
│  │  - Phase Organizer                                     │  │
│  │  - Dependency Resolver                                 │  │
│  │  - Timeline Estimator                                 │  │
│  │  - Checklist Generator                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Code Generator                                        │  │
│  │  - Schema Generator                                   │  │
│  │  - API Route Generator                                 │  │
│  │  - Component Generator                                 │  │
│  │  - Test Generator                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Template System                          │
│  - Base Templates (Roadmap Structure)                        │
│  - Phase Templates                                           │
│  - Checklist Templates                                       │
│  - Code Templates (Database, API, Components)              │
│  - Pattern Templates                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Output Layer                             │
│  - Markdown Files                                            │
│  - Code Files                                                │
│  - JSON/YAML Configs                                         │
│  - Progress Tracking Files                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Input Parser Layer

**Purpose:** Parse and validate user input, extract structured data.

**Components:**

#### Product Description Parser
- Extracts product name, description, domain
- Identifies product type (SaaS, E-commerce, Mobile, etc.)
- Extracts key requirements and constraints

#### Feature List Parser
- Parses feature list (from CLI args, config file, or interactive)
- Validates feature names and dependencies
- Categorizes features by type (auth, payments, content, etc.)

#### Tech Stack Parser
- Identifies technology choices (Next.js, Supabase, React, etc.)
- Maps tech stack to appropriate templates
- Validates compatibility

#### Requirements Parser
- Extracts non-functional requirements (security, performance, compliance)
- Identifies integration requirements
- Extracts business constraints

**Input Formats:**
- CLI arguments: `--features="auth,payments,api"`
- Config files: `roadmap.config.json`
- Interactive prompts: Step-by-step wizard
- Product description: Natural language parsing

---

### 2. Core Generator Engine

**Purpose:** Generate roadmap structure and code from parsed input.

#### Scaffel Generator

**Phase Organizer**
- Groups features into logical phases
- Determines phase order based on dependencies
- Estimates phase timelines

**Dependency Resolver**
- Builds dependency graph from features
- Identifies critical path
- Detects circular dependencies
- Suggests parallel work opportunities

**Timeline Estimator**
- Estimates time per feature based on:
  - Feature complexity
  - Team size
  - Tech stack complexity
  - Historical data (if available)

**Checklist Generator**
- Generates detailed checklists for each feature
- Includes implementation tasks
- Includes testing requirements
- Includes documentation requirements
- Includes completion criteria

**Specification Generator**
- Generates database schemas
- Generates API contracts (OpenAPI)
- Generates error handling specs
- Generates integration specs

#### Code Generator

**Schema Generator**
- Generates database migration files
- Creates table definitions with constraints
- Generates indexes and RLS policies
- Creates TypeScript types from schemas

**API Route Generator**
- Generates API route files from OpenAPI specs
- Creates request/response handlers
- Generates validation middleware
- Creates error handling

**Component Generator**
- Generates React components from specs
- Creates hooks and context providers
- Generates UI components with styling
- Creates form components

**Test Generator**
- Generates unit test files
- Creates integration test templates
- Generates E2E test scenarios
- Creates test utilities

---

### 3. Template System

**Purpose:** Provide configurable templates for different product types and tech stacks.

**Template Hierarchy:**

```
templates/
├── base/                          # Base roadmap structure
│   ├── roadmap.md                 # Main roadmap template
│   ├── status.md                  # Status tracking template
│   └── README.md                  # README template
│
├── phases/                        # Phase templates
│   ├── foundation.md              # Phase 1 template
│   ├── core-features.md           # Phase 2 template
│   └── ...
│
├── checklists/                    # Checklist templates
│   ├── database-checklist.md      # Database checklist template
│   ├── api-checklist.md           # API checklist template
│   └── ...
│
├── code/                          # Code generation templates
│   ├── database/                  # Database templates
│   │   ├── migration.sql         # Migration template
│   │   └── schema.ts             # Schema type template
│   ├── api/                       # API templates
│   │   ├── route.ts              # API route template
│   │   └── handler.ts            # Handler template
│   ├── components/               # Component templates
│   │   ├── component.tsx         # Component template
│   │   └── hook.ts               # Hook template
│   └── tests/                    # Test templates
│       ├── unit.test.ts         # Unit test template
│       └── integration.test.ts  # Integration test template
│
└── patterns/                      # Pattern templates
    ├── api-patterns.md           # API patterns
    ├── database-patterns.md      # Database patterns
    └── ...
```

**Template Variables:**

Templates use variables that get replaced during generation:

```typescript
interface TemplateVariables {
  // Product info
  productName: string;
  productDescription: string;
  productType: 'saas' | 'ecommerce' | 'mobile' | 'api';
  
  // Tech stack
  framework: string;        // 'nextjs', 'react', 'vue', etc.
  backend: string;         // 'supabase', 'firebase', 'custom', etc.
  database: string;        // 'postgresql', 'mysql', 'mongodb', etc.
  language: string;        // 'typescript', 'javascript', etc.
  
  // Features
  features: Feature[];
  phases: Phase[];
  
  // Configuration
  includeAuth: boolean;
  includePayments: boolean;
  includeAdmin: boolean;
  multiTenant: boolean;
  
  // Metadata
  author: string;
  date: string;
  version: string;
}
```

**Template Engine:**

Uses a template engine (e.g., Handlebars, Mustache, or custom) to:
- Replace variables with actual values
- Support conditionals (if/else based on features)
- Support loops (iterate over features, phases)
- Support includes (include sub-templates)
- Support helpers (format dates, capitalize, etc.)

---

### 4. Output Layer

**Purpose:** Generate files in appropriate formats.

**Output Types:**

#### Documentation Files
- `README.md` - Project overview
- `00-implementation-roadmap.md` - Main roadmap
- `00-implementation-status.md` - Status tracking
- `checklists/*.md` - Feature checklists
- `guides/*.md` - Phase guides
- `patterns/*.md` - Pattern documentation

#### Code Files
- Database migrations (`migrations/*.sql`)
- API routes (`app/api/**/*.ts`)
- Components (`components/**/*.tsx`)
- Hooks (`hooks/**/*.ts`)
- Types (`types/**/*.ts`)
- Tests (`tests/**/*.test.ts`)

#### Configuration Files
- `roadmap.config.json` - Roadmap configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `.env.example` - Environment variables

---

## Data Flow

### Roadmap Generation Flow

```
1. User Input
   ↓
2. Parse Input (Product, Features, Tech Stack)
   ↓
3. Resolve Dependencies
   ↓
4. Organize into Phases
   ↓
5. Generate Checklists
   ↓
6. Generate Specifications
   ↓
7. Render Templates
   ↓
8. Write Files
   ↓
9. Generate Code Scaffolds (optional)
```

### Code Generation Flow

```
1. Read Specifications (from roadmap)
   ↓
2. Select Appropriate Templates
   ↓
3. Generate Code Files
   ↓
4. Apply Patterns
   ↓
5. Write to Output Directory
```

---

## Module Structure

### Core Modules

```typescript
// src/core/generator.ts
export class ScaffelGenerator {
  generate(input: ProductInput): Roadmap;
  generateCode(roadmap: Roadmap, phase: number): CodeFiles;
}

// src/core/dependency-resolver.ts
export class DependencyResolver {
  resolve(features: Feature[]): DependencyGraph;
  getCriticalPath(graph: DependencyGraph): Feature[];
}

// src/core/timeline-estimator.ts
export class TimelineEstimator {
  estimate(feature: Feature, context: Context): TimeEstimate;
  estimatePhase(phase: Phase): TimeEstimate;
}

// src/core/checklist-generator.ts
export class ChecklistGenerator {
  generate(feature: Feature): Checklist;
  generatePhase(phase: Phase): Checklist[];
}
```

### Template Modules

```typescript
// src/templates/manager.ts
export class TemplateManager {
  loadTemplate(name: string): Template;
  renderTemplate(template: Template, vars: Variables): string;
  getTemplatePath(type: string, name: string): string;
}

// src/templates/loader.ts
export class TemplateLoader {
  loadBaseTemplates(): BaseTemplates;
  loadPhaseTemplates(): PhaseTemplates;
  loadCodeTemplates(): CodeTemplates;
}
```

### Generator Modules

```typescript
// src/generators/schema-generator.ts
export class SchemaGenerator {
  generate(feature: Feature): SchemaDefinition;
  generateMigration(schema: SchemaDefinition): MigrationFile;
}

// src/generators/api-generator.ts
export class APIGenerator {
  generateRoutes(spec: APISpec): RouteFiles;
  generateHandlers(spec: APISpec): HandlerFiles;
}

// src/generators/component-generator.ts
export class ComponentGenerator {
  generateComponent(spec: ComponentSpec): ComponentFile;
  generateHook(spec: HookSpec): HookFile;
}
```

---

## Configuration System

### Configuration File Format

```json
{
  "product": {
    "name": "My SaaS App",
    "description": "A SaaS platform for...",
    "type": "saas"
  },
  "techStack": {
    "framework": "nextjs",
    "backend": "supabase",
    "database": "postgresql",
    "language": "typescript"
  },
  "features": [
    {
      "name": "authentication",
      "priority": "critical",
      "dependencies": []
    },
    {
      "name": "payments",
      "priority": "high",
      "dependencies": ["authentication"]
    }
  ],
  "options": {
    "multiTenant": true,
    "includeAdmin": true,
    "includeTests": true,
    "includeDocs": true
  }
}
```

### Runtime Configuration

Configuration can be provided via:
- Config file (`roadmap.config.json`)
- CLI arguments (`--config=path/to/config.json`)
- Environment variables (`ROADMAP_PRODUCT_NAME=...`)
- Interactive prompts (wizard mode)

---

## Extension Points

### Custom Templates

Users can provide custom templates:

```bash
scaffel generate \
  --template-dir=./custom-templates \
  --product="My App"
```

### Custom Generators

Users can extend with custom generators:

```typescript
// custom-generator.ts
export class CustomGenerator implements Generator {
  generate(input: Input): Output {
    // Custom generation logic
  }
}
```

### Plugins

Plugin system for extending functionality:

```typescript
// plugin.ts
export class MyPlugin implements Plugin {
  beforeGenerate(input: Input): Input {
    // Modify input
  }
  
  afterGenerate(output: Output): Output {
    // Modify output
  }
}
```

---

## Performance Considerations

### Caching

- Template caching: Load templates once, reuse
- Dependency graph caching: Cache resolved graphs
- File system caching: Cache generated files

### Incremental Generation

- Only regenerate changed features
- Track what's been generated
- Support partial regeneration

### Parallel Processing

- Generate multiple files in parallel
- Process phases in parallel (where possible)
- Parallel template rendering

---

## Security Considerations

### Input Validation

- Validate all user input
- Sanitize file paths
- Prevent path traversal attacks
- Validate template variables

### Template Security

- Sandbox template execution
- Prevent arbitrary code execution
- Validate template includes
- Limit template access

### Output Security

- Validate generated code
- Prevent injection attacks
- Sanitize file names
- Validate file permissions

---

## Testing Strategy

### Unit Tests

- Test each generator independently
- Test template rendering
- Test dependency resolution
- Test timeline estimation

### Integration Tests

- Test full generation flow
- Test with real templates
- Test file output
- Test error handling

### E2E Tests

- Test CLI interface
- Test with example products
- Test generated code compiles
- Test generated code runs

---

## Deployment

### Distribution

- NPM package for CLI tool
- Docker image for containerized use
- Standalone binary for easy distribution
- SaaS version (web interface)

### Installation

```bash
# NPM
npm install -g scaffel

# Docker
docker pull scaffel:latest

# Binary
curl -L https://github.com/.../scaffel | install
```

---

## Future Enhancements

### AI Integration

- Use AI to extract features from product descriptions
- AI-powered dependency resolution
- AI-generated specifications
- AI code generation

### Cloud Integration

- Generate directly to GitHub repos
- Deploy to cloud platforms
- CI/CD integration
- Cloud-based templates

### Collaboration Features

- Multi-user roadmap editing
- Version control integration
- Progress tracking dashboard
- Team collaboration tools

---

**Last Updated:** January 6, 2026 at 8:31 PM

