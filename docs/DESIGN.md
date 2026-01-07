# Scaffel - Design Principles & Patterns

**Creation Date:** January 6, 2026 at 8:31 PM
**Updated Date:** January 6, 2026 at 8:31 PM
**Github username:** adriaanbalt

---

## Overview

This document describes the design principles, patterns, and architectural decisions that guide Scaffel. These principles ensure the tool is maintainable, extensible, and produces high-quality output.

---

## Design Principles

### 1. Methodology Over Content

**Principle:** Extract the **how** (methodology) from the **what** (content).

**Rationale:**
- The methodology (phase organization, checklist structure, dependency management) is reusable
- The content (specific features, schemas, APIs) is product-specific
- By separating methodology from content, we create a reusable tool

**Implementation:**
- Templates contain methodology structure
- Content is injected via variables
- Users provide product-specific content
- Tool provides proven structure

---

### 2. Progressive Enhancement

**Principle:** Start simple, add complexity incrementally.

**Rationale:**
- Users may not know all requirements upfront
- Can start with basic roadmap, enhance later
- Supports iterative development
- Reduces initial complexity

**Implementation:**
- Basic roadmap generation (minimal input)
- Optional code generation (advanced feature)
- Incremental feature addition
- Template customization (expert feature)

---

### 3. Convention Over Configuration

**Principle:** Sensible defaults, minimal configuration required.

**Rationale:**
- Most products follow similar patterns
- Reduces decision fatigue
- Faster to get started
- Can override defaults when needed

**Implementation:**
- Default phase structure (Foundation → Core → Advanced → Production)
- Default checklist structure (Prerequisites → Implementation → Testing → Documentation)
- Default code patterns (API routes, components, tests)
- Configurable overrides for customization

---

### 4. Template-Driven Architecture

**Principle:** All output is generated from templates.

**Rationale:**
- Templates are easy to modify
- Supports multiple output formats
- Enables customization
- Separates structure from content

**Implementation:**
- All files generated from templates
- Template variables for customization
- Template inheritance for reuse
- Template composition for complex structures

---

### 5. Specification-First Code Generation

**Principle:** Generate code from specifications, not templates alone.

**Rationale:**
- Specifications define what to build
- Code is generated from specs
- Ensures consistency
- Supports validation

**Implementation:**
- Generate specifications first (schemas, API contracts)
- Generate code from specifications
- Validate specifications before code generation
- Use specifications as source of truth

---

### 6. Dependency-Aware Generation

**Principle:** Understand and respect feature dependencies.

**Rationale:**
- Features have dependencies
- Must generate in correct order
- Must respect blocking relationships
- Enables parallel work identification

**Implementation:**
- Build dependency graph from features
- Generate features in dependency order
- Identify critical path
- Suggest parallel work opportunities

---

## Design Patterns

### 1. Generator Pattern

**Pattern:** Separate generation logic from output format.

**Structure:**
```typescript
interface Generator<TInput, TOutput> {
  generate(input: TInput): TOutput;
}

class ScaffelGenerator implements Generator<ProductInput, Roadmap> {
  generate(input: ProductInput): Roadmap {
    // Generate roadmap structure
  }
}

class CodeGenerator implements Generator<Roadmap, CodeFiles> {
  generate(roadmap: Roadmap): CodeFiles {
    // Generate code files
  }
}
```

**Benefits:**
- Separation of concerns
- Easy to test
- Easy to extend
- Supports multiple generators

---

### 2. Template Method Pattern

**Pattern:** Define algorithm skeleton, let subclasses fill details.

**Structure:**
```typescript
abstract class FeatureGenerator {
  // Template method
  generate(feature: Feature): FeatureOutput {
    const checklist = this.generateChecklist(feature);
    const spec = this.generateSpecification(feature);
    const code = this.generateCode(feature, spec);
    return { checklist, spec, code };
  }
  
  // Abstract methods (subclasses implement)
  protected abstract generateChecklist(feature: Feature): Checklist;
  protected abstract generateSpecification(feature: Feature): Specification;
  protected abstract generateCode(feature: Feature, spec: Specification): Code;
}

class DatabaseFeatureGenerator extends FeatureGenerator {
  protected generateChecklist(feature: Feature): Checklist {
    // Database-specific checklist
  }
  
  protected generateSpecification(feature: Feature): Specification {
    // Database schema specification
  }
  
  protected generateCode(feature: Feature, spec: Specification): Code {
    // Migration files
  }
}
```

**Benefits:**
- Consistent generation flow
- Customizable per feature type
- Reusable algorithm
- Easy to add new feature types

---

### 3. Strategy Pattern

**Pattern:** Encapsulate algorithms, make them interchangeable.

**Structure:**
```typescript
interface TimelineStrategy {
  estimate(feature: Feature): TimeEstimate;
}

class SimpleTimelineStrategy implements TimelineStrategy {
  estimate(feature: Feature): TimeEstimate {
    // Simple estimation based on feature type
  }
}

class MLTimelineStrategy implements TimelineStrategy {
  estimate(feature: Feature): TimeEstimate {
    // ML-based estimation using historical data
  }
}

class TimelineEstimator {
  constructor(private strategy: TimelineStrategy) {}
  
  estimate(feature: Feature): TimeEstimate {
    return this.strategy.estimate(feature);
  }
}
```

**Benefits:**
- Interchangeable algorithms
- Easy to add new strategies
- Testable in isolation
- Supports A/B testing

---

### 4. Builder Pattern

**Pattern:** Construct complex objects step by step.

**Structure:**
```typescript
class RoadmapBuilder {
  private product: Product;
  private features: Feature[] = [];
  private phases: Phase[] = [];
  
  setProduct(product: Product): this {
    this.product = product;
    return this;
  }
  
  addFeature(feature: Feature): this {
    this.features.push(feature);
    return this;
  }
  
  organizePhases(): this {
    this.phases = this.organizeFeaturesIntoPhases(this.features);
    return this;
  }
  
  build(): Roadmap {
    return new Roadmap(this.product, this.phases);
  }
}

// Usage
const roadmap = new RoadmapBuilder()
  .setProduct(product)
  .addFeature(authFeature)
  .addFeature(paymentFeature)
  .organizePhases()
  .build();
```

**Benefits:**
- Flexible construction
- Readable API
- Supports optional steps
- Easy to extend

---

### 5. Factory Pattern

**Pattern:** Create objects without specifying exact class.

**Structure:**
```typescript
interface GeneratorFactory {
  createGenerator(featureType: string): Generator;
}

class CodeGeneratorFactory implements GeneratorFactory {
  createGenerator(featureType: string): Generator {
    switch (featureType) {
      case 'database':
        return new DatabaseGenerator();
      case 'api':
        return new APIGenerator();
      case 'component':
        return new ComponentGenerator();
      default:
        throw new Error(`Unknown feature type: ${featureType}`);
    }
  }
}
```

**Benefits:**
- Centralized creation logic
- Easy to add new types
- Decouples creation from usage
- Supports dependency injection

---

### 6. Visitor Pattern

**Pattern:** Separate algorithm from object structure.

**Structure:**
```typescript
interface RoadmapVisitor {
  visitPhase(phase: Phase): void;
  visitFeature(feature: Feature): void;
  visitChecklist(checklist: Checklist): void;
}

class MarkdownGenerator implements RoadmapVisitor {
  private output: string = '';
  
  visitPhase(phase: Phase): void {
    this.output += `# Phase ${phase.number}: ${phase.name}\n\n`;
    phase.features.forEach(f => f.accept(this));
  }
  
  visitFeature(feature: Feature): void {
    this.output += `## ${feature.name}\n\n`;
    feature.checklist.accept(this);
  }
  
  visitChecklist(checklist: Checklist): void {
    checklist.items.forEach(item => {
      this.output += `- [ ] ${item.description}\n`;
    });
  }
  
  getOutput(): string {
    return this.output;
  }
}
```

**Benefits:**
- Separates traversal from operations
- Easy to add new operations
- Supports multiple output formats
- Maintains object structure

---

## Architectural Patterns

### 1. Layered Architecture

**Structure:**
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (CLI, API, Web Interface)           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Application Layer            │
│  (Orchestration, Business Logic)     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Domain Layer                │
│  (Generators, Resolvers, Estimators) │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Infrastructure Layer          │
│  (File System, Templates, Parsers)   │
└─────────────────────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer
- Supports multiple interfaces
- Maintainable structure

---

### 2. Plugin Architecture

**Structure:**
```typescript
interface Plugin {
  name: string;
  version: string;
  beforeGenerate?(input: Input): Input;
  afterGenerate?(output: Output): Output;
  registerGenerators?(registry: GeneratorRegistry): void;
}

class PluginManager {
  private plugins: Plugin[] = [];
  
  loadPlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
  
  async executeBeforeGenerate(input: Input): Promise<Input> {
    let result = input;
    for (const plugin of this.plugins) {
      if (plugin.beforeGenerate) {
        result = await plugin.beforeGenerate(result);
      }
    }
    return result;
  }
}
```

**Benefits:**
- Extensible without modification
- Supports third-party extensions
- Easy to enable/disable features
- Isolated plugin code

---

### 3. Pipeline Architecture

**Structure:**
```typescript
interface PipelineStage<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

class GenerationPipeline {
  private stages: PipelineStage<any, any>[] = [];
  
  addStage<TInput, TOutput>(stage: PipelineStage<TInput, TOutput>): this {
    this.stages.push(stage);
    return this;
  }
  
  execute(input: any): any {
    return this.stages.reduce(
      (result, stage) => stage.execute(result),
      input
    );
  }
}

// Usage
const pipeline = new GenerationPipeline()
  .addStage(new ParseInputStage())
  .addStage(new ResolveDependenciesStage())
  .addStage(new OrganizePhasesStage())
  .addStage(new GenerateChecklistsStage())
  .addStage(new GenerateCodeStage());

const output = pipeline.execute(userInput);
```

**Benefits:**
- Composable stages
- Easy to add/remove stages
- Testable stages
- Supports parallel execution

---

## Data Models

### Core Models

```typescript
// Product definition
interface Product {
  name: string;
  description: string;
  type: 'saas' | 'ecommerce' | 'mobile' | 'api' | 'other';
  domain?: string;
}

// Feature definition
interface Feature {
  id: string;
  name: string;
  description: string;
  type: FeatureType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];  // Feature IDs
  estimatedTime: TimeEstimate;
  phase?: number;
}

// Phase definition
interface Phase {
  number: number;
  name: string;
  goal: string;
  features: Feature[];
  estimatedTime: TimeEstimate;
}

// Roadmap definition
interface Roadmap {
  product: Product;
  phases: Phase[];
  dependencyGraph: DependencyGraph;
  timeline: Timeline;
  metadata: {
    generatedAt: Date;
    version: string;
    generator: string;
  };
}
```

### Generation Models

```typescript
// Checklist definition
interface Checklist {
  feature: Feature;
  prerequisites: ChecklistItem[];
  implementationTasks: ChecklistItem[];
  testingTasks: ChecklistItem[];
  documentationTasks: ChecklistItem[];
  completionCriteria: ChecklistItem[];
}

// Specification definition
interface Specification {
  type: 'database' | 'api' | 'component' | 'integration';
  content: any;  // Type-specific content
  format: 'sql' | 'yaml' | 'typescript' | 'markdown';
}

// Code file definition
interface CodeFile {
  path: string;
  content: string;
  type: 'migration' | 'route' | 'component' | 'test' | 'config';
}
```

---

## Error Handling

### Error Types

```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  FILE_ERROR = 'FILE_ERROR',
}

class ScaffelError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

### Error Handling Strategy

1. **Validation Errors:** Fail fast, show clear messages
2. **Dependency Errors:** Suggest fixes, show dependency graph
3. **Template Errors:** Fallback to default templates
4. **Generation Errors:** Partial generation, show what succeeded
5. **File Errors:** Retry with backup paths

---

## Testing Strategy

### Unit Tests

- Test each generator independently
- Mock dependencies
- Test error cases
- Test edge cases

### Integration Tests

- Test full generation flow
- Test with real templates
- Test file output
- Test error recovery

### E2E Tests

- Test CLI interface
- Test with example products
- Test generated code compiles
- Test generated code runs

---

## Performance Optimization

### Caching Strategy

- **Template Caching:** Load templates once, reuse
- **Dependency Graph Caching:** Cache resolved graphs
- **File System Caching:** Cache generated files
- **Specification Caching:** Cache generated specs

### Optimization Techniques

- **Lazy Loading:** Load templates on demand
- **Parallel Processing:** Generate files in parallel
- **Incremental Generation:** Only regenerate changed features
- **Streaming:** Stream large files instead of loading in memory

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

**Last Updated:** January 6, 2026 at 8:31 PM

