/**
 * Detailed checklist generator - Generates granular, actionable checklists
 *
 * Refactored to use modular generators for better maintainability.
 */

import type { Feature } from './generator';
import { FeatureKnowledgeBase } from './feature-knowledge-base';
import { CodeTemplateGenerator } from './code-template-generator';
import type { TechStack } from '../parsers/tech-stack-parser';
import type { DetailedFeatureChecklist } from './checklist/types';
import {
  PrerequisitesGenerator,
  FileStructureGenerator,
  DatabaseGenerator,
  ApiGenerator,
  ComponentsGenerator,
  ServicesGenerator,
  SecurityGenerator,
  TestingGenerator,
  DeploymentGenerator,
  CheckpointsGenerator,
} from './checklist/generators';
import { ChecklistMarkdownRenderer } from './checklist/markdown-renderer';

// Re-export types for backward compatibility
export type { DetailedChecklistItem, DetailedFeatureChecklist } from './checklist/types';

export class DetailedChecklistGenerator {
  private knowledgeBase: FeatureKnowledgeBase;
  private codeTemplateGenerator: CodeTemplateGenerator;
  private initialized: boolean = false;

  // Modular generators
  private prerequisitesGenerator: PrerequisitesGenerator;
  private fileStructureGenerator: FileStructureGenerator;
  private databaseGenerator: DatabaseGenerator;
  private apiGenerator: ApiGenerator;
  private componentsGenerator: ComponentsGenerator;
  private servicesGenerator: ServicesGenerator;
  private securityGenerator: SecurityGenerator;
  private testingGenerator: TestingGenerator;
  private deploymentGenerator: DeploymentGenerator;
  private checkpointsGenerator: CheckpointsGenerator;
  private markdownRenderer: ChecklistMarkdownRenderer;

  constructor(knowledgeBase?: FeatureKnowledgeBase) {
    this.knowledgeBase = knowledgeBase || new FeatureKnowledgeBase();
    this.codeTemplateGenerator = new CodeTemplateGenerator();

    // Initialize modular generators
    this.prerequisitesGenerator = new PrerequisitesGenerator();
    this.fileStructureGenerator = new FileStructureGenerator();
    this.databaseGenerator = new DatabaseGenerator();
    this.apiGenerator = new ApiGenerator();
    this.componentsGenerator = new ComponentsGenerator();
    this.servicesGenerator = new ServicesGenerator();
    this.securityGenerator = new SecurityGenerator();
    this.testingGenerator = new TestingGenerator();
    this.deploymentGenerator = new DeploymentGenerator();
    this.checkpointsGenerator = new CheckpointsGenerator();
    this.markdownRenderer = new ChecklistMarkdownRenderer();
  }

  /**
   * Initialize the knowledge base (call before using)
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.knowledgeBase.initialize();
      this.initialized = true;
    }
  }

  async generateDetailedChecklist(
    feature: Feature,
    techStack?: TechStack
  ): Promise<DetailedFeatureChecklist> {
    await this.initialize();
    const enriched = await this.knowledgeBase.enrichFeature(feature);
    const category = enriched.category;

    // Generate checklist sections using modular generators
    const apiEndpoints = this.apiGenerator.generate(enriched, category, techStack);
    const components = this.componentsGenerator.generate(enriched, category, techStack);

    // Extract API endpoint info for code generation
    const endpointInfo: Array<{ method: string; path: string; description: string }> = [];
    apiEndpoints.forEach((section) => {
      if (section.text.includes('endpoints') && section.subItems) {
        section.subItems.forEach((item) => {
          const match = item.text.match(
            /^(GET|POST|PATCH|DELETE|PUT)\s+(\/api\/[^\s]+)\s*-\s*(.+)$/
          );
          if (match) {
            endpointInfo.push({
              method: match[1],
              path: match[2],
              description: match[3],
            });
          }
        });
      }
    });

    // Generate code snippets
    const apiRouteSnippets = endpointInfo
      .slice(0, 3)
      .map((endpoint) =>
        this.codeTemplateGenerator.generateAPIRouteTemplate(enriched, endpoint, techStack)
      );

    const componentSnippets = components
      .flatMap((section) => section.subItems || [])
      .filter(
        (item) => item.text.includes('component') && !item.text.includes('Component structure')
      )
      .slice(0, 2)
      .map((item) => {
        // Extract component name, removing "component" and cleaning up
        let componentName = item.text.replace(/component/gi, '').trim();
        // Remove parenthetical descriptions like "(email, password, OAuth buttons)"
        componentName = componentName.replace(/\s*\([^)]*\)/g, '');
        // Clean up extra spaces and capitalize first letter
        componentName = componentName
          .split(/\s+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        // Fallback if empty
        if (!componentName) {
          componentName = `${enriched.name.charAt(0).toUpperCase() + enriched.name.slice(1)}List`;
        }
        return this.codeTemplateGenerator.generateComponentTemplate(
          enriched,
          componentName,
          techStack
        );
      });

    return {
      feature: enriched,
      prerequisites: this.prerequisitesGenerator.generate(enriched, category, techStack),
      fileStructure: this.fileStructureGenerator.generate(enriched, techStack),
      databaseSchema: this.databaseGenerator.generate(enriched, category, techStack),
      apiEndpoints,
      components,
      services: this.servicesGenerator.generate(enriched, category, techStack),
      security: this.securityGenerator.generate(enriched, category),
      testing: this.testingGenerator.generate(enriched, category, techStack),
      deployment: this.deploymentGenerator.generate(enriched, category),
      checkpoints: {
        security: this.checkpointsGenerator.generateSecurity(enriched, category),
        testing: this.checkpointsGenerator.generateTesting(enriched, category, techStack),
        performance: this.checkpointsGenerator.generatePerformance(),
      },
      codeSnippets: {
        service: this.codeTemplateGenerator.generateServiceTemplate(enriched, techStack),
        apiRoutes: apiRouteSnippets.length > 0 ? apiRouteSnippets : undefined,
        components: componentSnippets.length > 0 ? componentSnippets : undefined,
        migration: this.codeTemplateGenerator.generateMigrationTemplate(enriched, techStack),
        validationSchemas: [
          this.codeTemplateGenerator.generateValidationSchemaTemplate(enriched, 'create'),
          this.codeTemplateGenerator.generateValidationSchemaTemplate(enriched, 'update'),
        ],
      },
    };
  }

  /**
   * Generate markdown content from a detailed checklist
   * Delegates to the markdown renderer
   */
  generateDetailedChecklistMarkdown(
    checklist: DetailedFeatureChecklist,
    techStack?: TechStack
  ): string {
    return this.markdownRenderer.render(checklist, techStack);
  }
}
