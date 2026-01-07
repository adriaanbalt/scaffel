/**
 * Checklist generator - Generates detailed implementation checklists
 */

import type { Feature } from './generator';
import { FeatureKnowledgeBase } from './feature-knowledge-base';

export interface ChecklistItem {
  text: string;
  subItems?: ChecklistItem[];
}

export interface FeatureChecklist {
  feature: Feature;
  prerequisites: ChecklistItem[];
  implementationTasks: ChecklistItem[];
  testingTasks: ChecklistItem[];
  deploymentTasks: ChecklistItem[];
}

export class ChecklistGenerator {
  private knowledgeBase: FeatureKnowledgeBase;
  private initialized: boolean = false;

  constructor(knowledgeBase?: FeatureKnowledgeBase) {
    this.knowledgeBase = knowledgeBase || new FeatureKnowledgeBase();
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

  async generateChecklist(feature: Feature): Promise<FeatureChecklist> {
    await this.initialize();
    const enriched = await this.knowledgeBase.enrichFeature(feature);
    const category = enriched.category;

    return {
      feature: enriched,
      prerequisites: this.generatePrerequisites(enriched, category),
      implementationTasks: this.generateImplementationTasks(enriched),
      testingTasks: this.generateTestingTasks(enriched, category),
      deploymentTasks: this.generateDeploymentTasks(enriched, category),
    };
  }

  private generatePrerequisites(
    feature: Feature & { category?: string },
    category: string
  ): ChecklistItem[] {
    const items: ChecklistItem[] = [];

    // Common prerequisites
    items.push({ text: 'Database schema created (if needed)' });
    items.push({ text: 'Environment variables configured' });
    items.push({ text: 'Error handling system in place' });

    // Category-specific prerequisites
    if (category === 'foundation') {
      items.push({ text: 'Project structure set up' });
      items.push({ text: 'Development environment configured' });
    }

    if (category === 'core' || category === 'advanced') {
      items.push({ text: 'Authentication system implemented' });
    }

    // Feature-specific prerequisites
    if (feature.dependencies && feature.dependencies.length > 0) {
      items.push({
        text: `Dependencies completed: ${feature.dependencies.join(', ')}`,
      });
    }

    // Payment-specific
    if (feature.name.toLowerCase().includes('payment')) {
      items.push({ text: 'Payment provider account configured (Stripe, etc.)' });
      items.push({ text: 'Webhook endpoint configured' });
    }

    // File upload-specific
    if (
      feature.name.toLowerCase().includes('upload') ||
      feature.name.toLowerCase().includes('file')
    ) {
      items.push({ text: 'Storage provider configured (S3, Cloudinary, etc.)' });
      items.push({ text: 'CDN configured (if needed)' });
    }

    // API-specific
    if (feature.name.toLowerCase().includes('api')) {
      items.push({ text: 'API authentication middleware implemented' });
      items.push({ text: 'Rate limiting configured' });
    }

    return items;
  }

  private generateImplementationTasks(
    feature: Feature & { category?: string; checklistSections?: string[] }
  ): ChecklistItem[] {
    const items: ChecklistItem[] = [];

    // Use knowledge base sections if available
    if (feature.checklistSections && feature.checklistSections.length > 0) {
      for (const section of feature.checklistSections) {
        if (section === 'Prerequisites') continue;

        items.push({
          text: section,
          subItems: this.generateSectionTasks(section),
        });
      }
    } else {
      // Generic implementation tasks
      items.push({
        text: 'Core Implementation',
        subItems: [
          { text: 'Design data model' },
          { text: 'Create database schema/migrations' },
          { text: 'Implement core logic' },
          { text: 'Create API endpoints' },
          { text: 'Implement frontend components' },
        ],
      });

      items.push({
        text: 'Integration',
        subItems: [
          { text: 'Integrate with authentication' },
          { text: 'Add error handling' },
          { text: 'Add logging and monitoring' },
        ],
      });
    }

    return items;
  }

  private generateSectionTasks(section: string): ChecklistItem[] {
    const tasks: ChecklistItem[] = [];

    // Section-specific tasks based on common patterns
    if (section.includes('API') || section.includes('Endpoint')) {
      tasks.push({ text: 'Design API contract' });
      tasks.push({ text: 'Implement endpoint handlers' });
      tasks.push({ text: 'Add request validation' });
      tasks.push({ text: 'Add response formatting' });
      tasks.push({ text: 'Add error handling' });
    } else if (section.includes('Database') || section.includes('Schema')) {
      tasks.push({ text: 'Design table structure' });
      tasks.push({ text: 'Create migration files' });
      tasks.push({ text: 'Add indexes' });
      tasks.push({ text: 'Add constraints' });
      tasks.push({ text: 'Add relationships' });
    } else if (section.includes('Component') || section.includes('UI')) {
      tasks.push({ text: 'Design component structure' });
      tasks.push({ text: 'Implement components' });
      tasks.push({ text: 'Add styling' });
      tasks.push({ text: 'Add interactivity' });
      tasks.push({ text: 'Add error states' });
    } else if (section.includes('Security')) {
      tasks.push({ text: 'Add input validation' });
      tasks.push({ text: 'Add authorization checks' });
      tasks.push({ text: 'Add rate limiting' });
      tasks.push({ text: 'Add CSRF protection' });
      tasks.push({ text: 'Add security headers' });
    } else {
      // Generic tasks
      tasks.push({ text: `Implement ${section.toLowerCase()}` });
      tasks.push({ text: 'Add error handling' });
      tasks.push({ text: 'Add logging' });
    }

    return tasks;
  }

  private generateTestingTasks(
    feature: Feature & { category?: string },
    category: string
  ): ChecklistItem[] {
    const items: ChecklistItem[] = [];

    items.push({ text: 'Unit tests for core logic' });
    items.push({ text: 'Integration tests for API endpoints' });
    items.push({ text: 'Component tests for UI (if applicable)' });
    items.push({ text: 'End-to-end tests for critical flows' });
    items.push({ text: 'Error case testing' });
    items.push({ text: 'Edge case testing' });

    if (category === 'foundation') {
      items.push({ text: 'Security testing' });
      items.push({ text: 'Performance testing' });
    }

    return items;
  }

  private generateDeploymentTasks(
    feature: Feature & { category?: string },
    category: string
  ): ChecklistItem[] {
    const items: ChecklistItem[] = [];

    items.push({ text: 'Environment variables configured' });
    items.push({ text: 'Database migrations run' });
    items.push({ text: 'Feature flags configured (if needed)' });
    items.push({ text: 'Monitoring and alerts set up' });
    items.push({ text: 'Documentation updated' });

    if (category === 'foundation' || category === 'core') {
      items.push({ text: 'Backup strategy verified' });
      items.push({ text: 'Rollback plan prepared' });
    }

    return items;
  }

  generateChecklistMarkdown(checklist: FeatureChecklist): string {
    const feature = checklist.feature as Feature & { category?: string; description?: string };
    let content = `# ${feature.name} Implementation Checklist\n\n`;
    content += `**Feature:** ${feature.name}\n`;
    if (feature.category) {
      content += `**Category:** ${feature.category}\n`;
    }
    content += `**Estimated Time:** ${feature.estimatedTime?.days || 5} days\n`;
    content += `**Priority:** ${feature.priority || 'medium'}\n\n`;

    if (feature.description) {
      content += `## Description\n\n${feature.description}\n\n`;
    }

    if (feature.dependencies && feature.dependencies.length > 0) {
      content += `**Depends On:** ${feature.dependencies.join(', ')}\n\n`;
    }

    content += `---\n\n`;

    // Prerequisites
    content += `## Prerequisites\n\n`;
    for (const item of checklist.prerequisites) {
      content += `- [ ] ${item.text}\n`;
    }
    content += `\n---\n\n`;

    // Implementation Tasks
    content += `## Implementation Tasks\n\n`;
    for (const task of checklist.implementationTasks) {
      content += `### ${task.text}\n\n`;
      if (task.subItems) {
        for (const subItem of task.subItems) {
          content += `- [ ] ${subItem.text}\n`;
        }
      }
      content += `\n`;
    }
    content += `---\n\n`;

    // Testing
    content += `## Testing\n\n`;
    for (const item of checklist.testingTasks) {
      content += `- [ ] ${item.text}\n`;
    }
    content += `\n---\n\n`;

    // Deployment
    content += `## Deployment\n\n`;
    for (const item of checklist.deploymentTasks) {
      content += `- [ ] ${item.text}\n`;
    }
    content += `\n---\n\n`;

    return content;
  }
}
