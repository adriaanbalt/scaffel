/**
 * Template engine
 */

import type { TemplateManager } from './template-manager';
import { TemplateError } from '../core/errors';

export class TemplateEngine {
  constructor(private manager: TemplateManager) {
    this.manager.registerHelpers();
  }

  render(templateName: string, variables: Record<string, unknown>): string {
    try {
      const template = this.manager.loadTemplate(templateName);
      return this.manager.renderTemplate(template, variables);
    } catch (error) {
      throw new TemplateError(
        `Failed to render template: ${templateName}`,
        templateName,
        error instanceof Error ? error : undefined
      );
    }
  }

  renderString(templateContent: string, variables: Record<string, unknown>): string {
    try {
      // Use dynamic import for Handlebars to avoid require
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const Handlebars = require('handlebars') as typeof import('handlebars');
      const template = Handlebars.compile(templateContent);
      return template(variables);
    } catch (error) {
      throw new TemplateError(
        'Failed to render template string',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }
}
