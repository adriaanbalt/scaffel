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
import type { Feature } from '../core/generator';

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
  .option('-s, --tech-stack <stack>', 'Tech stack')
  .option('-c, --config <file>', 'Configuration file path')
  .option('-o, --output <dir>', 'Output directory', './roadmap')
  .option('-i, --interactive', 'Interactive mode')
  .action(async (options) => {
    try {
      const productParser = new ProductParser();
      const featureParser = new FeatureParser();
      const configParser = new ConfigParser();
      const generator = new ScaffelGenerator();

      let productInput: any = {};
      let features: Feature[] = [];

      // Load from config file if provided
      if (options.config) {
        const config = configParser.parse(options.config);
        productInput = {
          name: config.product.name,
          description: config.product.description,
          type: config.product.type,
          domain: config.product.domain,
        };

        if (config.features) {
          features = featureParser.parse(
            config.features.map((f) => ({
              id: f.name.toLowerCase().replace(/\s+/g, '-'),
              name: f.name,
              priority: (f.priority as any) || 'medium',
              dependencies: f.dependencies || [],
              estimatedTime: f.estimatedTime,
            }))
          );
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
        productInput.type = options.type;
      }

      if (options.features) {
        features = featureParser.parseFromString(options.features);
      }

      // Validate product
      const product = productParser.parse(productInput);
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
      const outputDir = path.resolve(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write roadmap to file using template
      const templateManager = new TemplateManager();
      const templateEngine = new TemplateEngine(templateManager);
      
      // Prepare template variables
      const templateVars = {
        product: roadmap.product,
        phases: roadmap.phases.map((phase, idx) => ({
          ...phase,
          timeline: {
            start: idx === 0 ? 1 : roadmap.phases.slice(0, idx).reduce((sum, p) => sum + (p.estimatedTime?.weeks || 1), 0) + 1,
            end: roadmap.phases.slice(0, idx + 1).reduce((sum, p) => sum + (p.estimatedTime?.weeks || 1), 0),
          },
        })),
        timeline: roadmap.timeline,
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

      console.log(`✅ Roadmap generated successfully!`);
      console.log(`📄 Output: ${roadmapPath}`);
      console.log(`📊 Phases: ${roadmap.phases.length}`);
      console.log(`⏱️  Estimated timeline: ${roadmap.timeline?.total.weeks || 0} weeks`);
    } catch (error: any) {
      console.error('❌ Error generating roadmap:', error.message);
      process.exit(1);
    }
  });

program
  .command('scaffold')
  .description('Generate code scaffolds from roadmap')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--phase <number>', 'Generate specific phase')
  .option('--feature <name>', 'Generate specific feature')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .action(async (options) => {
    console.log('🚧 Code generation is coming in Phase 4. Stay tuned!');
    console.log('Options:', options);
  });

program
  .command('status')
  .description('Show roadmap status and progress')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--status-file <file>', 'Status file path')
  .action(async (options) => {
    console.log('🚧 Status tracking is coming soon. Stay tuned!');
    console.log('Options:', options);
  });

program
  .command('validate')
  .description('Validate roadmap structure and dependencies')
  .option('-r, --roadmap <file>', 'Roadmap file path')
  .option('--strict', 'Strict validation')
  .action(async (options) => {
    console.log('🚧 Validation is coming soon. Stay tuned!');
    console.log('Options:', options);
  });

// Helper function to format roadmap as markdown
function formatRoadmap(roadmap: any): string {
  let content = `# ${roadmap.product.name} Implementation Roadmap\n\n`;
  content += `**Generated:** ${roadmap.metadata.generatedAt.toLocaleDateString()}\n`;
  content += `**Generator:** ${roadmap.metadata.generator} v${roadmap.metadata.version}\n\n`;
  content += `---\n\n`;
  content += `## Overview\n\n`;
  content += `${roadmap.product.description || 'Technical roadmap for ' + roadmap.product.name}\n\n`;
  content += `**Estimated Timeline:** ${roadmap.timeline?.total.weeks || 0} weeks (${roadmap.timeline?.total.days || 0} days)\n\n`;
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

