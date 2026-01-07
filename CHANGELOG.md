# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Code generation from roadmaps
- Interactive mode for roadmap creation
- Status tracking and progress monitoring
- Roadmap validation command
- Additional template types
- Plugin system for custom templates

## [0.1.0] - 2026-01-06

### Added
- Initial release of Scaffel
- Core roadmap generation functionality
- CLI interface with `generate` command
- Product and feature parsing
- Dependency resolution with cycle detection
- Phase organization system
- Timeline estimation
- Handlebars template engine
- Base templates (roadmap, status, checklists)
- Config file support (JSON)
- Comprehensive test suite
- Documentation in `docs/` folder

### Features
- **Roadmap Generation**: Generate structured technical roadmaps from product requirements
- **Dependency Resolution**: Automatically resolve feature dependencies and detect circular dependencies
- **Phase Organization**: Smart grouping of features into logical implementation phases
- **Timeline Estimation**: Calculate realistic timelines for phases and total project
- **Template System**: Flexible template-based output using Handlebars
- **CLI Interface**: Easy-to-use command-line interface
- **Config Files**: Support for JSON configuration files
- **Validation**: Input validation for products and features

### Technical Details
- Built with TypeScript
- Uses Commander.js for CLI
- Handlebars for templating
- Vitest for testing
- ESLint and Prettier for code quality

### Documentation
- Complete architecture documentation
- API reference
- Usage examples
- Contributing guidelines
- Code of conduct

---

## Version History

- **0.1.0** (2026-01-06) - Initial MVP release

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

