/**
 * Shared types for checklist generation
 */

import type { Feature } from '../generator';
import type { CodeSnippet } from '../code-template-generator';

export interface DetailedChecklistItem {
  text: string;
  subItems?: DetailedChecklistItem[];
  techStackSpecific?: boolean; // Whether this task varies by tech stack
}

export interface DetailedFeatureChecklist {
  feature: Feature;
  prerequisites: DetailedChecklistItem[];
  fileStructure?: string; // File structure tree
  databaseSchema: DetailedChecklistItem[];
  apiEndpoints: DetailedChecklistItem[];
  components: DetailedChecklistItem[];
  services: DetailedChecklistItem[];
  security: DetailedChecklistItem[];
  testing: DetailedChecklistItem[];
  deployment: DetailedChecklistItem[];
  checkpoints?: {
    security: DetailedChecklistItem[];
    testing: DetailedChecklistItem[];
    performance: DetailedChecklistItem[];
  };
  codeSnippets?: {
    service?: CodeSnippet;
    apiRoutes?: CodeSnippet[];
    components?: CodeSnippet[];
    migration?: CodeSnippet;
    validationSchemas?: CodeSnippet[];
  };
}
