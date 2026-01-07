# Scaffel

**Generate technical roadmaps and code foundations from product requirements.**

[![npm version](https://img.shields.io/npm/v/scaffel.svg)](https://www.npmjs.com/package/scaffel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Scaffel extracts the proven methodology from production applications and makes it reusable for any product. Generate complete technical roadmaps in minutes, not weeks.

---

## ✨ Features

- 🗺️ **Generate Technical Roadmaps** - Automatically create phase-organized implementation plans
- 🔗 **Dependency Resolution** - Automatically resolve feature dependencies and detect cycles
- 📊 **Timeline Estimation** - Calculate realistic timelines for each phase
- 🎯 **Smart Phase Organization** - Group features into logical implementation phases
- 📝 **Template-Based Output** - Generate markdown roadmaps using Handlebars templates
- ⚙️ **Flexible Input** - Support for CLI arguments, config files, or interactive mode
- 🚀 **Code Generation Ready** - Foundation for generating code scaffolds (coming soon)

---

## 🚀 Quick Start

### Installation

```bash
npm install -g scaffel
```

### Basic Usage

```bash
# Generate a roadmap from CLI arguments
scaffel generate \
  --product="My SaaS App" \
  --description="A modern SaaS platform" \
  --features="auth,payments,api,dashboard"

# Generate from a config file
scaffel generate --config=./scaffel.config.json

# Specify output directory
scaffel generate --product="My App" --features="auth,payments" --output=./roadmap
```

### Example Output

Scaffel generates a structured roadmap markdown file:

```markdown
# My SaaS App Implementation Roadmap

## Phase 1: Foundation
- Authentication
- Database Setup

## Phase 2: Core Features
- User Management (depends on: auth)
- Payments (depends on: auth)

## Phase 3: Advanced Features
- Dashboard (depends on: users, payments)
```

---

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **[Action Plan](./docs/ACTION-PLAN.md)** - Step-by-step implementation guide
- **[Architecture](./docs/ARCHITECTURE.md)** - Complete system architecture
- **[Design Principles](./docs/DESIGN.md)** - Design patterns and decisions
- **[API Reference](./docs/API.md)** - CLI and programmatic API
- **[Examples](./docs/EXAMPLES.md)** - Usage examples and case studies
- **[Templates](./docs/TEMPLATES.md)** - Template system documentation

---

## 💻 CLI Commands

### `generate`

Generate a technical roadmap from product requirements.

```bash
scaffel generate [options]

Options:
  -p, --product <name>        Product name
  -d, --description <text>    Product description
  -t, --type <type>           Product type (saas, ecommerce, mobile, api)
  -f, --features <list>       Comma-separated feature list
  -s, --tech-stack <stack>    Tech stack
  -c, --config <file>         Configuration file path
  -o, --output <dir>          Output directory (default: ./roadmap)
  -i, --interactive           Interactive mode
  -h, --help                  Display help
```

**Examples:**

```bash
# Simple generation
scaffel generate --product="My App" --features="auth,payments"

# With config file
scaffel generate --config=./scaffel.config.json --output=./my-roadmap

# Interactive mode
scaffel generate --interactive
```

### `scaffold` (Coming Soon)

Generate code scaffolds from roadmap.

```bash
scaffel scaffold --roadmap=./roadmap.md --phase=1 --output=./generated
```

### `status` (Coming Soon)

Show roadmap status and progress.

```bash
scaffel status --roadmap=./roadmap.md
```

### `validate` (Coming Soon)

Validate roadmap structure and dependencies.

```bash
scaffel validate --roadmap=./roadmap.md
```

---

## ⚙️ Configuration File

Create a `scaffel.config.json` file for more complex setups:

```json
{
  "product": {
    "name": "My SaaS App",
    "description": "A modern SaaS platform",
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
      "name": "Authentication",
      "priority": "critical",
      "dependencies": [],
      "estimatedTime": {
        "days": 5,
        "weeks": 1
      }
    },
    {
      "name": "User Management",
      "priority": "high",
      "dependencies": ["authentication"],
      "estimatedTime": {
        "days": 7,
        "weeks": 2
      }
    },
    {
      "name": "Payments",
      "priority": "high",
      "dependencies": ["authentication"],
      "estimatedTime": {
        "days": 10,
        "weeks": 2
      }
    }
  ],
  "options": {
    "multiTenant": false,
    "includeAdmin": true,
    "includeTests": true,
    "includeDocs": true
  }
}
```

---

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/scaffel/scaffel.git
cd scaffel

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
Scaffel/
├── src/              # Source code
│   ├── core/         # Core generation engine
│   ├── parsers/      # Input parsers
│   ├── templates/    # Template system
│   └── cli/          # CLI interface
├── templates/        # Template files
├── tests/            # Test files
└── docs/             # Documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of Conduct
- Development guidelines
- Pull request process
- Issue reporting

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more information.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js) for CLI
- Template engine powered by [Handlebars](https://handlebarsjs.com/)
- Inspired by production application development methodologies

---

## 📊 Status

**Current Version:** v0.1.0

**Status:** ✅ **MVP Complete** - Core functionality working

- ✅ Roadmap generation
- ✅ Dependency resolution
- ✅ Phase organization
- ✅ Timeline estimation
- ✅ Template system
- 🚧 Code generation (coming soon)
- 🚧 Interactive mode (coming soon)
- 🚧 Status tracking (coming soon)

---

## 🔗 Links

- **GitHub:** [github.com/scaffel/scaffel](https://github.com/scaffel/scaffel)
- **NPM:** [npmjs.com/package/scaffel](https://www.npmjs.com/package/scaffel)
- **Issues:** [github.com/scaffel/scaffel/issues](https://github.com/scaffel/scaffel/issues)

---

**Made with ❤️ by the Scaffel team**
