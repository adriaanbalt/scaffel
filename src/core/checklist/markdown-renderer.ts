/**
 * Markdown renderer for detailed checklists
 */

import type { DetailedFeatureChecklist, DetailedChecklistItem } from './types';
import type { TechStack } from '../../parsers/tech-stack-parser';

export class ChecklistMarkdownRenderer {
  /**
   * Generate markdown content from a detailed checklist
   */
  render(checklist: DetailedFeatureChecklist, techStack?: TechStack): string {
    const feature = checklist.feature;
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

    if (techStack) {
      content += `**Tech Stack:** ${techStack.framework || 'N/A'}, ${techStack.backend || 'N/A'}, ${techStack.database || 'N/A'}\n\n`;
    }

    content += `---\n\n`;

    // Prerequisites
    if (checklist.prerequisites.length > 0) {
      content += `## Prerequisites\n\n`;
      content = this.renderChecklistItems(content, checklist.prerequisites);
      content += `\n---\n\n`;
    }

    // File Structure
    if (checklist.fileStructure) {
      content += `## Code Structure\n\n`;
      content += `### Expected File Structure\n\n`;
      content += `\`\`\`\n${checklist.fileStructure}\n\`\`\`\n\n`;
      content += `---\n\n`;
    }

    // Database Schema
    if (checklist.databaseSchema.length > 0) {
      content += `## Database Schema\n\n`;
      content = this.renderChecklistItems(content, checklist.databaseSchema);
      content += `\n---\n\n`;
    }

    // API Endpoints
    if (checklist.apiEndpoints.length > 0) {
      content += `## API Endpoints\n\n`;
      content = this.renderChecklistItems(content, checklist.apiEndpoints);
      content += `\n---\n\n`;
    }

    // Services
    if (checklist.services.length > 0) {
      content += `## Services\n\n`;
      content = this.renderChecklistItems(content, checklist.services);
      content += `\n---\n\n`;
    }

    // Components
    if (checklist.components.length > 0) {
      content += `## Components\n\n`;
      content = this.renderChecklistItems(content, checklist.components);
      content += `\n---\n\n`;
    }

    // Security
    if (checklist.security.length > 0) {
      content += `## Security\n\n`;
      content = this.renderChecklistItems(content, checklist.security);
      content += `\n---\n\n`;
    }

    // Testing
    if (checklist.testing.length > 0) {
      content += `## Testing\n\n`;
      content = this.renderChecklistItems(content, checklist.testing);
      content += `\n---\n\n`;
    }

    // Deployment
    if (checklist.deployment.length > 0) {
      content += `## Deployment\n\n`;
      content = this.renderChecklistItems(content, checklist.deployment);
      content += `\n---\n\n`;
    }

    // Cross-Cutting Requirements
    if (checklist.checkpoints) {
      content += `## Cross-Cutting Requirements\n\n`;

      // Security Checkpoint
      if (checklist.checkpoints.security.length > 0) {
        content += `### Security Checkpoint\n\n`;
        content = this.renderChecklistItems(content, checklist.checkpoints.security);
        content += `\n`;
      }

      // Testing Checkpoint
      if (checklist.checkpoints.testing.length > 0) {
        content += `### Testing Checkpoint\n\n`;
        content = this.renderChecklistItems(content, checklist.checkpoints.testing);
        content += `\n`;
      }

      // Performance Checkpoint
      if (checklist.checkpoints.performance.length > 0) {
        content += `### Performance Checkpoint\n\n`;
        content = this.renderChecklistItems(content, checklist.checkpoints.performance);
        content += `\n`;
      }

      content += `---\n\n`;
    }

    // Code Snippets
    if (checklist.codeSnippets) {
      content += `## Code Examples\n\n`;

      // Service template
      if (checklist.codeSnippets.service) {
        const snippet = checklist.codeSnippets.service;
        content += `### ${snippet.name}\n\n`;
        content += `**File:** \`${snippet.filePath}\`\n\n`;
        content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
      }

      // API route templates
      if (checklist.codeSnippets.apiRoutes && checklist.codeSnippets.apiRoutes.length > 0) {
        content += `### API Route Templates\n\n`;
        for (const snippet of checklist.codeSnippets.apiRoutes) {
          content += `#### ${snippet.name}\n\n`;
          content += `**Description:** ${snippet.description}\n\n`;
          content += `**File:** \`${snippet.filePath}\`\n\n`;
          content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
        }
      }

      // Component templates
      if (checklist.codeSnippets.components && checklist.codeSnippets.components.length > 0) {
        content += `### Component Templates\n\n`;
        for (const snippet of checklist.codeSnippets.components) {
          content += `#### ${snippet.name}\n\n`;
          content += `**File:** \`${snippet.filePath}\`\n\n`;
          content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
        }
      }

      // Migration template
      if (checklist.codeSnippets.migration) {
        const snippet = checklist.codeSnippets.migration;
        content += `### Database Migration\n\n`;
        content += `**File:** \`${snippet.filePath}\`\n\n`;
        content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
      }

      // Validation schemas
      if (
        checklist.codeSnippets.validationSchemas &&
        checklist.codeSnippets.validationSchemas.length > 0
      ) {
        content += `### Validation Schemas\n\n`;
        for (const snippet of checklist.codeSnippets.validationSchemas) {
          content += `#### ${snippet.name}\n\n`;
          content += `**File:** \`${snippet.filePath}\`\n\n`;
          content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
        }
      }

      content += `---\n\n`;
    }

    return content;
  }

  /**
   * Render checklist items recursively
   */
  private renderChecklistItems(content: string, items: DetailedChecklistItem[]): string {
    let result = content;
    for (const item of items) {
      if (item.subItems && item.subItems.length > 0) {
        result += `### ${item.text}\n\n`;
        for (const subItem of item.subItems) {
          const marker = subItem.techStackSpecific ? '🔧' : '';
          result += `- [ ] ${marker} ${subItem.text}\n`;
          if (subItem.subItems && subItem.subItems.length > 0) {
            for (const subSubItem of subItem.subItems) {
              const subMarker = subSubItem.techStackSpecific ? '🔧' : '';
              result += `  - [ ] ${subMarker} ${subSubItem.text}\n`;
              if (subSubItem.subItems && subSubItem.subItems.length > 0) {
                for (const subSubSubItem of subSubItem.subItems) {
                  const subSubMarker = subSubSubItem.techStackSpecific ? '🔧' : '';
                  result += `    - [ ] ${subSubMarker} ${subSubSubItem.text}\n`;
                }
              }
            }
          }
        }
        result += `\n`;
      } else {
        result += `- [ ] ${item.text}\n`;
      }
    }
    return result;
  }
}
