/**
 * Core types for feature knowledge base
 */

export interface FeatureKnowledge {
  name: string;
  aliases: string[];
  description: string;
  category: 'foundation' | 'core' | 'advanced' | 'integration' | 'optimization';
  commonDependencies: string[];
  estimatedTime: {
    days: number;
    weeks: number;
  };
  checklistSections: string[];
}

export interface KnowledgeLoadResult {
  features: FeatureKnowledge[];
  errors: string[];
  warnings: string[];
}
