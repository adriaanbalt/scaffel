/**
 * Template loader
 */

import type { TemplateManager } from './template-manager';

export class TemplateLoader {
  constructor(private manager: TemplateManager) {}

  loadBaseTemplates(): Record<string, string> {
    // TODO: Load base templates
    return {
      roadmap: '',
      status: '',
      readme: '',
    };
  }

  loadPhaseTemplates(): Record<string, string> {
    // TODO: Load phase templates
    return {};
  }

  loadCodeTemplates(): Record<string, string> {
    // TODO: Load code templates
    return {};
  }
}

