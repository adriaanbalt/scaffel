/**
 * Tests for FeatureKnowledgeBase with provider architecture
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FeatureKnowledgeBase } from '../../../src/core/feature-knowledge-base';
import { JsonProvider } from '../../../src/core/knowledge/providers/json-provider';
import path from 'path';

describe('FeatureKnowledgeBase', () => {
  describe('Initialization', () => {
    it('should initialize with default JSON provider', async () => {
      const knowledgeBase = new FeatureKnowledgeBase();
      await expect(knowledgeBase.initialize()).resolves.not.toThrow();
    });

    it('should initialize with custom provider', async () => {
      const provider = new JsonProvider({
        path: path.join(__dirname, '../../../src/core/knowledge/data/features.json'),
      });
      const knowledgeBase = new FeatureKnowledgeBase(provider);
      await expect(knowledgeBase.initialize()).resolves.not.toThrow();
    });

    it('should throw error if provider is not available', async () => {
      const provider = new JsonProvider({
        path: '/nonexistent/path/features.json',
      });
      const knowledgeBase = new FeatureKnowledgeBase(provider);
      await expect(knowledgeBase.initialize()).rejects.toThrow();
    });
  });

  describe('Feature Lookup', () => {
    let knowledgeBase: FeatureKnowledgeBase;

    beforeEach(async () => {
      knowledgeBase = new FeatureKnowledgeBase();
      await knowledgeBase.initialize();
    });

    it('should find feature by name', async () => {
      const feature = await knowledgeBase.getFeatureKnowledge('authentication');
      expect(feature).not.toBeNull();
      expect(feature?.name).toBe('authentication');
    });

    it('should find feature by alias', async () => {
      const feature = await knowledgeBase.getFeatureKnowledge('auth');
      expect(feature).not.toBeNull();
      expect(feature?.name).toBe('authentication');
    });

    it('should return null for unknown feature', async () => {
      const feature = await knowledgeBase.getFeatureKnowledge('unknown-feature');
      expect(feature).toBeNull();
    });

    it('should be case-insensitive', async () => {
      const feature1 = await knowledgeBase.getFeatureKnowledge('AUTHENTICATION');
      const feature2 = await knowledgeBase.getFeatureKnowledge('Authentication');
      expect(feature1).not.toBeNull();
      expect(feature2).not.toBeNull();
      expect(feature1?.name).toBe(feature2?.name);
    });
  });

  describe('Feature Enrichment', () => {
    let knowledgeBase: FeatureKnowledgeBase;

    beforeEach(async () => {
      knowledgeBase = new FeatureKnowledgeBase();
      await knowledgeBase.initialize();
    });

    it('should enrich feature with knowledge base data', async () => {
      const feature = {
        id: 'test-auth',
        name: 'authentication',
      };

      const enriched = await knowledgeBase.enrichFeature(feature);

      expect(enriched.id).toBe('test-auth');
      expect(enriched.name).toBe('authentication');
      expect(enriched.description).toContain('authentication');
      expect(enriched.category).toBe('foundation');
      expect(enriched.checklistSections.length).toBeGreaterThan(0);
    });

    it('should use provided description if available', async () => {
      const feature = {
        id: 'test-auth',
        name: 'authentication',
        description: 'Custom description',
      };

      const enriched = await knowledgeBase.enrichFeature(feature);
      expect(enriched.description).toBe('Custom description');
    });

    it('should merge dependencies', async () => {
      const feature = {
        id: 'test-user',
        name: 'user-management',
        dependencies: ['custom-dependency'],
      };

      const enriched = await knowledgeBase.enrichFeature(feature);
      expect(enriched.dependencies).toContain('authentication'); // From knowledge base
      expect(enriched.dependencies).toContain('custom-dependency'); // From feature
    });
  });

  describe('Get All Features', () => {
    let knowledgeBase: FeatureKnowledgeBase;

    beforeEach(async () => {
      knowledgeBase = new FeatureKnowledgeBase();
      await knowledgeBase.initialize();
    });

    it('should return all features without duplicates', async () => {
      const features = await knowledgeBase.getAllFeatures();
      expect(features.length).toBeGreaterThan(0);

      const names = features.map((f) => f.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should include all expected features', async () => {
      const features = await knowledgeBase.getAllFeatures();
      const names = features.map((f) => f.name);

      expect(names).toContain('authentication');
      expect(names).toContain('user-management');
      expect(names).toContain('payments');
    });
  });

  describe('Lazy Initialization', () => {
    it('should initialize on first access', async () => {
      const knowledgeBase = new FeatureKnowledgeBase();
      // Don't call initialize() explicitly

      const feature = await knowledgeBase.getFeatureKnowledge('authentication');
      expect(feature).not.toBeNull();
    });
  });
});
