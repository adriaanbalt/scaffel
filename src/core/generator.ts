/**
 * Core roadmap generator
 */

export interface ProductInput {
  name: string;
  description?: string;
  type?: 'saas' | 'ecommerce' | 'mobile' | 'api' | 'other';
  domain?: string;
}

export interface Feature {
  id: string;
  name: string;
  description?: string;
  type?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[];
  estimatedTime?: {
    days: number;
    weeks: number;
  };
  category?: string;
  checklistSections?: string[];
}

export interface Phase {
  number: number;
  name: string;
  goal: string;
  features: Feature[];
  estimatedTime?: {
    days: number;
    weeks: number;
  };
}

export interface EnrichedFeature extends Feature {
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  estimatedTime: {
    days: number;
    weeks: number;
  };
  category: string;
  checklistSections: string[];
}

export interface Roadmap {
  product: ProductInput;
  phases: Phase[];
  dependencyGraph?: DependencyGraph;
  timeline?: {
    total: {
      days: number;
      weeks: number;
    };
  };
  metadata: {
    generatedAt: Date;
    version: string;
    generator: string;
  };
}

import { DependencyResolver } from './dependency-resolver';
import type { DependencyGraph } from './dependency-resolver';
import { PhaseOrganizer } from './phase-organizer';
import { TimelineEstimator } from './timeline-estimator';
import { ValidationError } from './errors';

export class ScaffelGenerator {
  private resolver: DependencyResolver;
  private organizer: PhaseOrganizer;
  private estimator: TimelineEstimator;

  constructor() {
    this.resolver = new DependencyResolver();
    this.organizer = new PhaseOrganizer();
    this.estimator = new TimelineEstimator();
  }

  generate(input: ProductInput & { features?: Feature[] }): Roadmap {
    const product: ProductInput = {
      name: input.name,
      description: input.description,
      type: input.type || 'saas',
      domain: input.domain,
    };

    const features = input.features || [];

    // Validate features
    if (features.length > 0) {
      const depValidation = this.resolver.validateDependencies(features);
      if (!depValidation.valid) {
        throw new ValidationError('Invalid feature dependencies', depValidation.errors);
      }
    }

    // Resolve dependencies
    const dependencyGraph = features.length > 0 ? this.resolver.resolve(features) : undefined;

    // Check for cycles
    if (dependencyGraph && dependencyGraph.cycles.length > 0) {
      throw new ValidationError(
        'Circular dependencies detected',
        dependencyGraph.cycles.map((c) => c.join(' -> '))
      );
    }

    // Organize into phases
    const phases = this.organizer.organize(features);

    // Estimate timelines for each phase
    const phasesWithTimeline = phases.map((phase) => ({
      ...phase,
      estimatedTime: this.organizer.estimatePhase(phase),
    }));

    // Calculate total timeline
    const timeline = this.estimator.estimateTotal(phasesWithTimeline);

    return {
      product,
      phases: phasesWithTimeline,
      dependencyGraph,
      timeline: {
        total: timeline,
      },
      metadata: {
        generatedAt: new Date(),
        version: '0.1.0',
        generator: 'scaffel',
      },
    };
  }
}
