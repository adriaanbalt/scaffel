# Scaffel - Architecture & Design

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:**

---

## Overview

Scaffel is a tool that transforms product requirements into comprehensive technical roadmaps and generates working code foundations. It extracts the proven methodology from the Markense technical roadmap and makes it reusable for any product.

**Value Proposition:**
- Generate complete technical roadmaps in minutes (not weeks)
- Automatically create code scaffolds from specifications
- Based on proven methodology used to build production applications
- Save 3-6 months of planning and foundation work

---

## Quick Start

```bash
# Install
npm install -g scaffel

# Generate roadmap for your product
scaffel generate --product="My SaaS App" --features="auth,payments,api"

# Generate foundation code
scaffel scaffold --phase=1 --output=./my-app
```

---

## Architecture Overview

```
Scaffel/
├── README.md                    # This file
├── ARCHITECTURE.md              # Complete architecture documentation
├── DESIGN.md                    # Design principles and patterns
├── TEMPLATES.md                 # Template system documentation
├── GENERATOR.md                 # Code generation system
├── API.md                       # API/CLI interface design
├── EXAMPLES.md                  # Usage examples
│
├── src/                         # Source code
│   ├── core/                    # Core generator engine
│   ├── templates/               # Template system
│   ├── generators/              # Code generators
│   ├── parsers/                 # Input parsers
│   └── cli/                     # CLI interface
│
├── templates/                   # Roadmap templates
│   ├── base/                   # Base roadmap structure
│   ├── phases/                 # Phase templates
│   ├── checklists/             # Checklist templates
│   └── patterns/               # Pattern templates
│
└── examples/                    # Example outputs
    ├── markense/               # Markense example
    ├── ecommerce/              # E-commerce example
    └── saas/                   # SaaS example
```

---

## Core Concepts

### 1. Methodology Extraction
The tool extracts the **methodology** (how to organize) from the **content** (what to build), making it reusable for any product.

### 2. Template-Based Generation
Uses configurable templates that can be customized per product type, tech stack, and requirements.

### 3. Code Scaffolding
Generates actual working code from roadmap specifications, not just documentation.

### 4. Progressive Enhancement
Start with basic roadmap, add features incrementally, generate code as needed.

---

## Key Features

- ✅ **Roadmap Generation** - Complete technical roadmap from product description
- ✅ **Code Scaffolding** - Generate foundation code from specifications
- ✅ **Template System** - Customizable templates for different product types
- ✅ **Dependency Management** - Automatic dependency resolution
- ✅ **Progress Tracking** - Built-in status tracking system
- ✅ **Pattern Library** - Reusable patterns extracted from real projects
- ✅ **Multi-Format Output** - Markdown, JSON, YAML, code files

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture
- **[DESIGN.md](./DESIGN.md)** - Design principles and patterns
- **[TEMPLATES.md](./TEMPLATES.md)** - Template system documentation
- **[GENERATOR.md](./GENERATOR.md)** - Code generation system
- **[API.md](./API.md)** - API/CLI interface design
- **[EXAMPLES.md](./EXAMPLES.md)** - Usage examples and case studies

---

## License

Proprietary - All rights reserved

---

**Last Updated:** January 6, 2026 at 8:31 PM

