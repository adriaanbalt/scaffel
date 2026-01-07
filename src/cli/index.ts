#!/usr/bin/env node

/**
 * Scaffel CLI entry point
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { ScaffelGenerator } from '../core/generator';
import { ProductParser } from '../parsers/product-parser';
import { FeatureParser } from '../parsers/feature-parser';
import { ConfigParser } from '../parsers/config-parser';
import { TemplateEngine } from '../templates/template-engine';
import { TemplateManager } from '../templates/template-manager';
import { FeatureKnowledgeBase } from '../core/feature-knowledge-base';
import { DetailedChecklistGenerator } from '../core/detailed-checklist-generator';
import { TechStackParser, type TechStack } from '../parsers/tech-stack-parser';
import type { Feature, ProductInput, Roadmap } from '../core/generator';
import type { GenerateOptions, ScaffoldOptions, StatusOptions, ValidateOptions } from './types';
import {
  ValidationError,
  ConfigurationError,
  FileSystemError,
  KnowledgeBaseError,
  TemplateError,
} from '../core/errors';

const program = new Command();

program
  .name('scaffel')
  .description('Generate technical roadmaps and code foundations from product requirements')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate a technical roadmap')
  .option('-p, --product <name>', 'Product name')
  .option('-d, --description <text>', 'Product description')
  .option('-t, --type <type>', 'Product type (saas, ecommerce, mobile, api)')
  .option('-f, --features <list>', 'Comma-separated feature list')
  .option(
    '-s, --tech-stack <stack>',
    'Tech stack (e.g., nextjs,supabase,postgresql,typescript,tailwind)'
  )
  .option('-c, --config <file>', 'Configuration file path')
  .option('-o, --output <dir>', 'Output directory', './roadmap')
  .option('-i, --interactive', 'Interactive mode')
  .action(async (options: GenerateOptions) => {
    try {
      const productParser = new ProductParser();
      const featureParser = new FeatureParser();
      const configParser = new ConfigParser();
      const techStackParser = new TechStackParser();
      const generator = new ScaffelGenerator();

      // Initialize knowledge base once (reused throughout)
      const knowledgeBase = new FeatureKnowledgeBase();
      await knowledgeBase.initialize();

      let productInput: Partial<ProductInput> = {};
      let features: Feature[] = [];
      let techStack: TechStack | undefined = undefined;

      // Load from config file if provided
      if (options.config) {
        const config = configParser.parse(options.config);
        productInput = {
          name: config.product.name,
          description: config.product.description,
          type: config.product.type ? (config.product.type as ProductInput['type']) : undefined,
          domain: config.product.domain,
        };

        if (config.techStack) {
          techStack = techStackParser.parse(config.techStack);
        }

        if (config.features) {
          features = featureParser.parse(
            config.features.map((f) => ({
              id: f.name.toLowerCase().replace(/\s+/g, '-'),
              name: f.name,
              description: f.description,
              priority: (f.priority as 'low' | 'medium' | 'high') || 'medium',
              dependencies: f.dependencies || [],
              estimatedTime: f.estimatedTime
                ? {
                    days: f.estimatedTime.days ?? 5,
                    weeks: f.estimatedTime.weeks ?? 1,
                  }
                : undefined,
            }))
          );

          // Enrich features with knowledge base
          features = await Promise.all(features.map((f) => knowledgeBase.enrichFeature(f)));
        }
      }

      // Override with CLI options
      if (options.product) {
        productInput.name = options.product;
      }
      if (options.description) {
        productInput.description = options.description;
      }
      if (options.type) {
        productInput.type = options.type as ProductInput['type'];
      }

      if (options.techStack) {
        techStack = techStackParser.parseFromString(options.techStack);
      }

      if (options.features) {
        features = featureParser.parseFromString(options.features);

        // Enrich features with knowledge base
        features = await Promise.all(features.map((f) => knowledgeBase.enrichFeature(f)));
      }

      // Validate product
      if (!productInput.name) {
        console.error('❌ Product name is required');
        process.exit(1);
      }
      const product = productParser.parse(productInput as ProductInput);
      const productValidation = productParser.validate(product);
      if (!productValidation.valid) {
        console.error('❌ Product validation failed:');
        productValidation.errors.forEach((err) => console.error(`  - ${err}`));
        process.exit(1);
      }

      // Validate features
      if (features.length > 0) {
        const featureValidation = featureParser.validate(features);
        if (!featureValidation.valid) {
          console.error('❌ Feature validation failed:');
          featureValidation.errors.forEach((err) => console.error(`  - ${err}`));
          process.exit(1);
        }
      }

      // Generate roadmap
      console.log('🚀 Generating roadmap...');
      const roadmap = generator.generate({
        ...product,
        features,
      });

      // Create output directory
      const outputDir = path.resolve(options.output || './roadmap');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write roadmap to file using template
      const templateManager = new TemplateManager();
      const templateEngine = new TemplateEngine(templateManager);

      // Prepare template variables
      const templateVars = {
        product: roadmap.product,
        phases: roadmap.phases.map((phase, phaseIdx) => ({
          ...phase,
          number: phase.number,
          timeline: {
            start:
              phaseIdx === 0
                ? 1
                : roadmap.phases
                    .slice(0, phaseIdx)
                    .reduce((sum, p) => sum + (p.estimatedTime?.weeks || 1), 0) + 1,
            end: roadmap.phases
              .slice(0, phaseIdx + 1)
              .reduce((sum, p) => sum + (p.estimatedTime?.weeks || 1), 0),
          },
          features: phase.features.map((feature, featureIdx) => ({
            ...feature,
            number: featureIdx + 1,
            slug: feature.id || feature.name.toLowerCase().replace(/\s+/g, '-'),
            estimatedTime: feature.estimatedTime || { days: 5, weeks: 1 },
            priority: feature.priority || 'medium',
            dependencies: feature.dependencies || [],
            description: feature.description || '',
            category: feature.category || 'core',
          })),
        })),
        timeline: {
          total: roadmap.timeline?.total?.weeks ?? 0,
          days: roadmap.timeline?.total?.days ?? 0,
        },
        date: roadmap.metadata.generatedAt.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        author: '',
      };

      // Try to use template, fallback to simple formatting
      let roadmapContent: string;
      try {
        roadmapContent = templateEngine.render('base/roadmap.md', templateVars);
      } catch (error) {
        // Fallback to simple formatting if template not found
        roadmapContent = formatRoadmap(roadmap);
      }

      const roadmapPath = path.join(outputDir, '00-implementation-roadmap.md');
      fs.writeFileSync(roadmapPath, roadmapContent);

      // Generate detailed checklists for each feature
      // Reuse knowledge base instance to avoid duplicate initialization
      const detailedChecklistGenerator = new DetailedChecklistGenerator(knowledgeBase);
      const checklistsDir = path.join(outputDir, 'checklists');
      if (!fs.existsSync(checklistsDir)) {
        fs.mkdirSync(checklistsDir, { recursive: true });
      }

      let checklistCount = 0;
      for (const phase of roadmap.phases) {
        for (let i = 0; i < phase.features.length; i++) {
          const feature = phase.features[i];
          const detailedChecklist = await detailedChecklistGenerator.generateDetailedChecklist(
            feature,
            techStack
          );
          const checklistContent = detailedChecklistGenerator.generateDetailedChecklistMarkdown(
            detailedChecklist,
            techStack
          );

          const featureNumber =
            String(phase.number).padStart(2, '0') + '-' + String(i + 1).padStart(2, '0');
          const featureSlug = feature.id || feature.name.toLowerCase().replace(/\s+/g, '-');
          const checklistPath = path.join(
            checklistsDir,
            `${featureNumber}-${featureSlug}-checklist.md`
          );

          fs.writeFileSync(checklistPath, checklistContent);
          checklistCount++;
        }
      }

      console.log(`✅ Roadmap generated successfully!`);
      console.log(`📄 Output: ${roadmapPath}`);
      console.log(`📊 Phases: ${roadmap.phases.length}`);
      console.log(`📋 Checklists: ${checklistCount}`);
      console.log(`⏱️  Estimated timeline: ${roadmap.timeline?.total.weeks || 0} weeks`);
    } catch (error) {
      // Handle specific error types
      if (error instanceof ValidationError) {
        console.error('❌ Validation error:', error.message);
        if (error.errors.length > 0) {
          error.errors.forEach((err) => console.error(`  - ${err}`));
        }
        process.exit(1);
      } else if (error instanceof ConfigurationError) {
        console.error('❌ Configuration error:', error.message);
        process.exit(1);
      } else if (error instanceof FileSystemError) {
        console.error(`❌ File system error: ${error.message}`);
        console.error(`   Path: ${error.path}`);
        process.exit(1);
      } else if (error instanceof KnowledgeBaseError) {
        console.error('❌ Knowledge base error:', error.message);
        process.exit(1);
      } else if (error instanceof TemplateError) {
        console.error(`❌ Template error: ${error.message}`);
        if (error.templateName) {
          console.error(`   Template: ${error.templateName}`);
        }
        process.exit(1);
      } else {
        // Generic error handling
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error generating roadmap:', errorMessage);
        if (error instanceof Error && error.stack && process.env.DEBUG) {
          console.error('Stack trace:', error.stack);
        }
        process.exit(1);
      }
    }
  });

program
  .command('scaffold')
  .description('Generate code scaffolds from roadmap')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--phase <number>', 'Generate specific phase')
  .option('--feature <name>', 'Generate specific feature')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .action(async (options: ScaffoldOptions) => {
    console.log('🚧 Code generation is coming in Phase 4. Stay tuned!');
    console.log('Options:', options);
  });

program
  .command('status')
  .description('Show roadmap status and progress')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--status-file <file>', 'Status file path')
  .action(async (options: StatusOptions) => {
    console.log('🚧 Status tracking is coming soon. Stay tuned!');
    console.log('Options:', options);
  });

program
  .command('validate')
  .description('Validate roadmap structure and dependencies')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--strict', 'Strict validation')
  .action(async (options: ValidateOptions) => {
    console.log('🚧 Validation is coming soon. Stay tuned!');
    console.log('Options:', options);
  });

// Helper function to format roadmap as markdown
function formatRoadmap(roadmap: Roadmap): string {
  let content = `# ${roadmap.product.name} Implementation Roadmap\n\n`;
  content += `**Generated:** ${roadmap.metadata.generatedAt.toLocaleDateString()}\n`;
  content += `**Generator:** ${roadmap.metadata.generator} v${roadmap.metadata.version}\n\n`;
  content += `---\n\n`;
  content += `## Overview\n\n`;
  content += `${roadmap.product.description || 'Technical roadmap for ' + roadmap.product.name}\n\n`;
  const totalWeeks = roadmap.timeline?.total?.weeks ?? 0;
  const totalDays = roadmap.timeline?.total?.days ?? 0;
  content += `**Estimated Timeline:** ${totalWeeks} weeks (${totalDays} days)\n\n`;
  content += `---\n\n`;

  for (const phase of roadmap.phases) {
    content += `## Phase ${phase.number}: ${phase.name}\n\n`;
    content += `**Goal:** ${phase.goal}\n\n`;

    for (let i = 0; i < phase.features.length; i++) {
      const feature = phase.features[i];
      content += `### ${i + 1}. ${feature.name}\n\n`;
      if (feature.description) {
        content += `${feature.description}\n\n`;
      }
      content += `**Priority:** ${feature.priority || 'medium'}\n`;
      if (feature.estimatedTime) {
        content += `**Estimated Time:** ${feature.estimatedTime.days} days\n`;
      }
      if (feature.dependencies && feature.dependencies.length > 0) {
        content += `**Dependencies:** ${feature.dependencies.join(', ')}\n`;
      }
      content += `\n---\n\n`;
    }
  }

  return content;
}

program.parse();
