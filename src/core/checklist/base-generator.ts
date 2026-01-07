/**
 * Base class for checklist section generators
 */

import type { EnrichedFeature } from '../generator';
import type { TechStack } from '../../parsers/tech-stack-parser';
import type { DetailedChecklistItem } from './types';

export abstract class BaseChecklistGenerator {
  /**
   * Generate checklist items for a section
   */
  abstract generate(
    feature: EnrichedFeature,
    category: string,
    techStack?: TechStack
  ): DetailedChecklistItem[];

  /**
   * Helper to create a checklist item
   */
  protected createItem(
    text: string,
    subItems?: DetailedChecklistItem[],
    techStackSpecific?: boolean
  ): DetailedChecklistItem {
    return {
      text,
      subItems,
      techStackSpecific,
    };
  }

  /**
   * Helper to create nested items
   */
  protected createNestedItem(
    text: string,
    subItems: DetailedChecklistItem[]
  ): DetailedChecklistItem {
    return this.createItem(text, subItems);
  }

  /**
   * Check if feature is in a specific category
   */
  protected isCategory(feature: EnrichedFeature, category: string): boolean {
    return feature.category === category;
  }

  /**
   * Get tech stack specific indicator
   */
  protected getTechStackIndicator(techStack?: TechStack): string {
    return techStack ? '🔧' : '';
  }
}
