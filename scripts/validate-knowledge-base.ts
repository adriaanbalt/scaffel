/**
 * Validation script for knowledge base
 *
 * Validates all features in the knowledge base using schema and dependency validators
 */

import { FeatureKnowledgeBase } from '../src/core/feature-knowledge-base';
import { SchemaValidator } from '../src/core/knowledge/validators/schema-validator';
import { DependencyValidator } from '../src/core/knowledge/validators/dependency-validator';

async function validateKnowledgeBase() {
  console.log('🔍 Validating knowledge base...\n');

  const knowledgeBase = new FeatureKnowledgeBase();

  try {
    // Initialize knowledge base
    console.log('📦 Loading knowledge base...');
    await knowledgeBase.initialize();
    console.log('✅ Knowledge base loaded successfully\n');

    // Get all features
    const features = await knowledgeBase.getAllFeatures();
    console.log(`📊 Total features: ${features.length}\n`);

    // Validate schema
    console.log('🔍 Validating schema...');
    const schemaValidator = new SchemaValidator();
    const schemaValidation = schemaValidator.validateBatch(features);

    if (schemaValidation.valid) {
      console.log('✅ Schema validation passed');
    } else {
      console.error('❌ Schema validation failed:');
      schemaValidation.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }

    if (schemaValidation.warnings.length > 0) {
      console.warn('⚠️  Schema validation warnings:');
      schemaValidation.warnings.forEach((warn) => console.warn(`  - ${warn}`));
    }
    console.log('');

    // Validate dependencies
    console.log('🔍 Validating dependencies...');
    const dependencyValidator = new DependencyValidator();
    const dependencyValidation = dependencyValidator.validate(features);

    if (dependencyValidation.valid) {
      console.log('✅ Dependency validation passed');
    } else {
      console.error('❌ Dependency validation failed:');
      dependencyValidation.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }

    if (dependencyValidation.warnings.length > 0) {
      console.warn('⚠️  Dependency validation warnings:');
      dependencyValidation.warnings.forEach((warn) => console.warn(`  - ${warn}`));
    }
    console.log('');

    // Feature statistics
    console.log('📈 Feature Statistics:');
    const byCategory = new Map<string, number>();
    features.forEach((f) => {
      byCategory.set(f.category, (byCategory.get(f.category) || 0) + 1);
    });

    console.log('  By Category:');
    byCategory.forEach((count, category) => {
      console.log(`    ${category}: ${count}`);
    });
    console.log('');

    // Test feature lookup
    console.log('🔍 Testing feature lookup...');
    const testFeatures = ['authentication', 'auth', 'payments', 'rbac', 'websockets'];
    let lookupSuccess = 0;

    for (const testFeature of testFeatures) {
      const feature = await knowledgeBase.getFeatureKnowledge(testFeature);
      if (feature) {
        console.log(`  ✅ Found: ${testFeature} -> ${feature.name}`);
        lookupSuccess++;
      } else {
        console.log(`  ❌ Not found: ${testFeature}`);
      }
    }
    console.log('');

    // Test feature enrichment
    console.log('🔍 Testing feature enrichment...');
    const testEnrichment = {
      id: 'test-feature',
      name: 'authorization',
    };

    const enriched = await knowledgeBase.enrichFeature(testEnrichment);
    if (enriched.description && enriched.category && enriched.checklistSections.length > 0) {
      console.log('  ✅ Feature enrichment successful');
      console.log(`    Description: ${enriched.description.substring(0, 50)}...`);
      console.log(`    Category: ${enriched.category}`);
      console.log(`    Checklist sections: ${enriched.checklistSections.length}`);
    } else {
      console.error('  ❌ Feature enrichment failed');
      process.exit(1);
    }
    console.log('');

    console.log('✅ All validations passed!');
    console.log(`\n📊 Summary:`);
    console.log(`  Total features: ${features.length}`);
    console.log(`  Schema validation: ✅`);
    console.log(`  Dependency validation: ✅`);
    console.log(`  Feature lookup: ${lookupSuccess}/${testFeatures.length} successful`);
    console.log(`  Feature enrichment: ✅`);
  } catch (error) {
    console.error('❌ Validation failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run validation
validateKnowledgeBase().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
