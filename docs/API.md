# Scaffel - API & CLI Interface

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:**

---

## Overview

This document describes the API and CLI interface for Scaffel. It covers command-line usage, programmatic API, configuration options, and integration patterns.

---

## CLI Interface

### Installation

```bash
# NPM
npm install -g scaffel

# Yarn
yarn global add scaffel

# PNPM
pnpm add -g scaffel
```

### Basic Usage

```bash
# Generate roadmap
scaffel generate --product="My SaaS App"

# Generate with features
scaffel generate \
  --product="My SaaS App" \
  --features="auth,payments,api"

# Generate with config file
scaffel generate --config=scaffel.config.json

# Generate code scaffolds
scaffel scaffold --phase=1 --output=./my-app
```

---

## Commands

### `generate`

Generate a complete technical roadmap.

**Usage:**
```bash
scaffel generate [options]
```

**Options:**
- `--product, -p <name>` - Product name (required)
- `--description, -d <text>` - Product description
- `--type, -t <type>` - Product type (saas, ecommerce, mobile, api)
- `--features, -f <list>` - Comma-separated feature list
- `--tech-stack, -s <stack>` - Tech stack (nextjs, react, vue)
- `--config, -c <file>` - Configuration file path
- `--output, -o <dir>` - Output directory (default: ./roadmap)
- `--template-dir <dir>` - Custom templates directory
- `--format <format>` - Output format (markdown, json, yaml)
- `--interactive, -i` - Interactive mode (wizard)

**Examples:**
```bash
# Basic generation
scaffel generate --product="My App"

# With features
scaffel generate \
  --product="E-commerce Platform" \
  --type=ecommerce \
  --features="catalog,cart,checkout,payments"

# Interactive mode
roadmap generate --interactive

# Custom output
scaffel generate \
  --product="My App" \
  --output=./docs/roadmap \
  --format=json
```

---

### `scaffold`

Generate code scaffolds from roadmap.

**Usage:**
```bash
scaffel scaffold [options]
```

**Options:**
- `--roadmap, -r <file>` - Roadmap file path (required)
- `--phase <number>` - Generate specific phase (default: all)
- `--feature <name>` - Generate specific feature
- `--output, -o <dir>` - Output directory (required)
- `--format <format>` - Code format (nextjs, express, fastify)
- `--language <lang>` - Language (typescript, javascript)
- `--skip-tests` - Skip test generation
- `--skip-docs` - Skip documentation generation

**Examples:**
```bash
# Generate all phases
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --output=./my-app

# Generate specific phase
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --phase=1 \
  --output=./my-app

# Generate specific feature
scaffel scaffold \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --feature=authentication \
  --output=./my-app
```

---

### `update`

Update existing roadmap with new features or changes.

**Usage:**
```bash
scaffel update [options]
```

**Options:**
- `--roadmap, -r <file>` - Roadmap file path (required)
- `--add-feature <name>` - Add new feature
- `--remove-feature <name>` - Remove feature
- `--update-feature <name>` - Update feature
- `--reorganize` - Reorganize phases based on dependencies

**Examples:**
```bash
# Add feature
roadmap update \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --add-feature="analytics"

# Reorganize
roadmap update \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --reorganize
```

---

### `status`

Show roadmap status and progress.

**Usage:**
```bash
scaffel status [options]
```

**Options:**
- `--roadmap, -r <file>` - Roadmap file path
- `--status-file <file>` - Status file path
- `--format <format>` - Output format (table, json, markdown)

**Examples:**
```bash
# Show status
roadmap status --roadmap=./roadmap/00-implementation-roadmap.md

# JSON output
roadmap status \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --format=json
```

---

### `validate`

Validate roadmap structure and dependencies.

**Usage:**
```bash
scaffel validate [options]
```

**Options:**
- `--roadmap, -r <file>` - Roadmap file path (required)
- `--strict` - Strict validation (fail on warnings)

**Examples:**
```bash
# Validate roadmap
roadmap validate --roadmap=./roadmap/00-implementation-roadmap.md

# Strict validation
roadmap validate \
  --roadmap=./roadmap/00-implementation-roadmap.md \
  --strict
```

---

## Configuration File

### Format

Configuration file (`scaffel.config.json`):

```json
{
  "product": {
    "name": "My SaaS App",
    "description": "A SaaS platform for managing...",
    "type": "saas",
    "domain": "myapp.com"
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
      "priority": "critical",
      "dependencies": [],
      "estimatedTime": {
        "days": 5,
        "weeks": 1
      }
    },
    {
      "name": "payments",
      "priority": "high",
      "dependencies": ["authentication"],
      "estimatedTime": {
        "days": 7,
        "weeks": 1.5
      }
    }
  ],
  "options": {
    "multiTenant": true,
    "includeAdmin": true,
    "includeTests": true,
    "includeDocs": true,
    "codeGeneration": true
  },
  "templates": {
    "dir": "./custom-templates",
    "overrides": {
      "checklist": "./custom-templates/my-checklist.md"
    }
  },
  "output": {
    "dir": "./roadmap",
    "format": "markdown",
    "structure": "standard"
  }
}
```

---

## Programmatic API

### JavaScript/TypeScript

```typescript
import { ScaffelGenerator, CodeGenerator } from 'scaffel';

// Generate roadmap
const generator = new ScaffelGenerator({
  product: {
    name: 'My SaaS App',
    description: 'A SaaS platform...',
    type: 'saas'
  },
  features: [
    { name: 'authentication', priority: 'critical' },
    { name: 'payments', priority: 'high', dependencies: ['authentication'] }
  ],
  techStack: {
    framework: 'nextjs',
    backend: 'supabase',
    database: 'postgresql',
    language: 'typescript'
  }
});

const roadmap = await generator.generate();

// Generate code
const codeGenerator = new CodeGenerator({
  roadmap,
  outputDir: './my-app',
  format: 'nextjs',
  language: 'typescript'
});

const codeFiles = await codeGenerator.generate();
```

### Node.js

```javascript
const { generateRoadmap, generateCode } = require('scaffel');

// Generate roadmap
const roadmap = await generateRoadmap({
  product: {
    name: 'My SaaS App',
    type: 'saas'
  },
  features: ['auth', 'payments'],
  techStack: {
    framework: 'nextjs',
    backend: 'supabase'
  }
});

// Generate code
const codeFiles = await generateCode({
  roadmap,
  outputDir: './my-app',
  phase: 1
});
```

---

## REST API (SaaS Version)

### Endpoints

#### `POST /api/v1/roadmaps`

Create a new roadmap.

**Request:**
```json
{
  "product": {
    "name": "My SaaS App",
    "type": "saas"
  },
  "features": ["auth", "payments"],
  "techStack": {
    "framework": "nextjs"
  }
}
```

**Response:**
```json
{
  "id": "roadmap_123",
  "product": {
    "name": "My SaaS App"
  },
  "phases": [...],
  "createdAt": "2026-01-06T20:31:00Z"
}
```

#### `GET /api/v1/roadmaps/:id`

Get roadmap by ID.

**Response:**
```json
{
  "id": "roadmap_123",
  "product": {...},
  "phases": [...],
  "status": {...}
}
```

#### `POST /api/v1/roadmaps/:id/scaffold`

Generate code scaffolds.

**Request:**
```json
{
  "phase": 1,
  "format": "nextjs",
  "language": "typescript"
}
```

**Response:**
```json
{
  "files": [
    {
      "path": "app/api/users/route.ts",
      "content": "..."
    }
  ],
  "totalFiles": 42
}
```

---

## Interactive Mode

### Wizard Flow

```bash
$ scaffel generate --interactive

? Product name: My SaaS App
? Product description: A SaaS platform for...
? Product type: (Use arrow keys)
  ❯ SaaS
    E-commerce
    Mobile App
    API Service
    Other

? Select features: (Press <space> to select)
  ◯ Authentication
  ◯ Payments
  ◯ User Management
  ◯ Admin Panel
  ◯ API

? Tech stack:
  Framework: (Use arrow keys)
    ❯ Next.js
      React
      Vue
      Angular

  Backend: (Use arrow keys)
    ❯ Supabase
      Firebase
      Custom

? Output directory: ./roadmap
? Generate code scaffolds? (y/N) y

Generating roadmap...
✓ Roadmap generated successfully
✓ Code scaffolds generated
```

---

## Integration Examples

### CI/CD Integration

```yaml
# .github/workflows/roadmap.yml
name: Generate Roadmap

on:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g scaffel
      - run: scaffel generate --config=scaffel.config.json
      - run: scaffel scaffold --phase=1 --output=./generated
      - uses: actions/upload-artifact@v3
        with:
          name: roadmap
          path: ./roadmap
```

### VS Code Extension

```typescript
// Extension integration
import { generateRoadmap } from 'scaffel';

vscode.commands.registerCommand('roadmap.generate', async () => {
  const product = await vscode.window.showInputBox({
    prompt: 'Product name'
  });
  
  const roadmap = await generateRoadmap({ product });
  
  // Open generated roadmap
  const doc = await vscode.workspace.openTextDocument(
    vscode.Uri.file('./roadmap/00-implementation-roadmap.md')
  );
  
  await vscode.window.showTextDocument(doc);
});
```

---

## Error Handling

### Error Codes

```typescript
enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED = 'MISSING_REQUIRED',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  FILE_ERROR = 'FILE_ERROR'
}
```

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid product type",
    "details": {
      "field": "product.type",
      "value": "invalid",
      "allowed": ["saas", "ecommerce", "mobile", "api"]
    }
  }
}
```

---

## Output Formats

### Markdown (Default)

Standard markdown files in directory structure.

### JSON

```json
{
  "product": {...},
  "phases": [...],
  "dependencyGraph": {...},
  "timeline": {...}
}
```

### YAML

```yaml
product:
  name: My SaaS App
  type: saas

phases:
  - number: 1
    name: Foundation
    features: [...]
```

---

**Last Updated:** January 6, 2026 at 8:31 PM

