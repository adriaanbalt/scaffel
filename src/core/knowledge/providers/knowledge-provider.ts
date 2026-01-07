/**
 * Knowledge provider interface - Abstract contract for loading feature knowledge
 *
 * This interface allows for multiple data sources (JSON files, databases, APIs)
 * while maintaining a consistent interface for the knowledge base.
 */

import type { FeatureKnowledge } from '../types';

export interface KnowledgeProvider {
  /**
   * Load all feature knowledge entries
   * @returns Promise resolving to array of feature knowledge entries
   * @throws Error if loading fails
   */
  load(): Promise<FeatureKnowledge[]>;

  /**
   * Get provider name for logging/debugging
   */
  getName(): string;

  /**
   * Check if provider is available/ready
   */
  isAvailable(): Promise<boolean>;
}
