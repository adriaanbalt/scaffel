/**
 * Template engine
 */

import type { TemplateManager } from './template-manager';

export class TemplateEngine {
  constructor(private manager: TemplateManager) {
    this.manager.registerHelpers();
  }

  render(templateName: string, variables: Record<string, any>): string {
    const template = this.manager.loadTemplate(templateName);
    return this.manager.renderTemplate(template, variables);
  }

  renderString(templateContent: string, variables: Record<string, any>): string {
    const Handlebars = require('handlebars');
    const template = Handlebars.compile(templateContent);
    return template(variables);
  }
}

