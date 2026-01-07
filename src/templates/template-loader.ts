/**
 * Template loader
 *
 * Loads templates from the file system using TemplateManager.
 * Handles base templates, phase templates, and code templates.
 */

import fs from 'fs';
import path from 'path';
import type { TemplateManager } from './template-manager';

export class TemplateLoader {
  constructor(private manager: TemplateManager) {}

  /**
   * Load base templates (roadmap, status, readme)
   */
  loadBaseTemplates(): Record<string, string> {
    const templates: Record<string, string> = {};
    const baseTemplateNames = ['roadmap', 'status', 'readme'];

    for (const name of baseTemplateNames) {
      try {
        const templatePath = this.manager.getTemplatePath('base', `${name}.md`);
        if (fs.existsSync(templatePath)) {
          const template = this.manager.loadTemplate(`base/${name}.md`);
          templates[name] = template.content;
        }
      } catch (error) {
        // Template doesn't exist, skip it
        // This is okay - not all templates are required
      }
    }

    return templates;
  }

  /**
   * Load phase-specific templates
   * Looks for templates in templates/phases/ directory
   */
  loadPhaseTemplates(): Record<string, string> {
    const templates: Record<string, string> = {};
    const templateDir = path.join(
      path.dirname(this.manager.getTemplatePath('base', 'roadmap.md')),
      'phases'
    );

    if (!fs.existsSync(templateDir)) {
      return templates;
    }

    try {
      const files = fs.readdirSync(templateDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const templateName = path.basename(file, '.md');
          try {
            const template = this.manager.loadTemplate(`phases/${file}`);
            templates[templateName] = template.content;
          } catch (error) {
            // Skip if template can't be loaded
          }
        }
      }
    } catch (error) {
      // Phases directory doesn't exist or can't be read, return empty
    }

    return templates;
  }

  /**
   * Load code templates
   * Looks for templates in templates/code/ directory
   */
  loadCodeTemplates(): Record<string, string> {
    const templates: Record<string, string> = {};
    const templateDir = path.join(
      path.dirname(this.manager.getTemplatePath('base', 'roadmap.md')),
      'code'
    );

    if (!fs.existsSync(templateDir)) {
      return templates;
    }

    try {
      const files = fs.readdirSync(templateDir);
      for (const file of files) {
        if (
          file.endsWith('.ts') ||
          file.endsWith('.tsx') ||
          file.endsWith('.js') ||
          file.endsWith('.jsx')
        ) {
          const templateName = path.basename(file, path.extname(file));
          try {
            const template = this.manager.loadTemplate(`code/${file}`);
            templates[templateName] = template.content;
          } catch (error) {
            // Skip if template can't be loaded
          }
        }
      }
    } catch (error) {
      // Code directory doesn't exist or can't be read, return empty
    }

    return templates;
  }

  /**
   * Load checklist templates
   * Looks for templates in templates/checklists/ directory
   */
  loadChecklistTemplates(): Record<string, string> {
    const templates: Record<string, string> = {};
    const templateDir = path.join(
      path.dirname(this.manager.getTemplatePath('base', 'roadmap.md')),
      'checklists'
    );

    if (!fs.existsSync(templateDir)) {
      return templates;
    }

    try {
      const files = fs.readdirSync(templateDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const templateName = path.basename(file, '.md');
          try {
            const template = this.manager.loadTemplate(`checklists/${file}`);
            templates[templateName] = template.content;
          } catch (error) {
            // Skip if template can't be loaded
          }
        }
      }
    } catch (error) {
      // Checklists directory doesn't exist or can't be read, return empty
    }

    return templates;
  }

  /**
   * Load all templates
   */
  loadAllTemplates(): {
    base: Record<string, string>;
    phases: Record<string, string>;
    code: Record<string, string>;
    checklists: Record<string, string>;
  } {
    return {
      base: this.loadBaseTemplates(),
      phases: this.loadPhaseTemplates(),
      code: this.loadCodeTemplates(),
      checklists: this.loadChecklistTemplates(),
    };
  }
}
