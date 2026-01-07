/**
 * Template manager
 */

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export interface Template {
  name: string;
  content: string;
  path: string;
  compiled?: HandlebarsTemplateDelegate;
}

export class TemplateManager {
  private cache: Map<string, Template> = new Map();
  private templateDir: string;

  constructor(templateDir?: string) {
    this.templateDir = templateDir || path.join(__dirname, '../../templates');
  }

  loadTemplate(name: string): Template {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const templatePath = path.join(this.templateDir, name);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const content = fs.readFileSync(templatePath, 'utf-8');
    const compiled = Handlebars.compile(content);
    
    const template: Template = {
      name,
      content,
      path: templatePath,
      compiled,
    };

    this.cache.set(name, template);
    return template;
  }

  renderTemplate(template: Template, variables: Record<string, any>): string {
    if (!template.compiled) {
      template.compiled = Handlebars.compile(template.content);
    }
    return template.compiled(variables);
  }

  getTemplatePath(type: string, name: string): string {
    return path.join(this.templateDir, type, name);
  }

  // Register Handlebars helpers
  registerHelpers(): void {
    Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    Handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
    Handlebars.registerHelper('gt', (a: number, b: number) => a > b);
    Handlebars.registerHelper('lt', (a: number, b: number) => a < b);
    Handlebars.registerHelper('and', (a: any, b: any) => a && b);
    Handlebars.registerHelper('or', (a: any, b: any) => a || b);
    Handlebars.registerHelper('not', (a: any) => !a);
    Handlebars.registerHelper('formatDate', (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    });
  }
}

