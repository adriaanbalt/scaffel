/**
 * Phase organization system
 */

import type { Feature, Phase } from './generator';
import { DependencyResolver } from './dependency-resolver';

export class PhaseOrganizer {
  private resolver: DependencyResolver;

  constructor() {
    this.resolver = new DependencyResolver();
  }

  organize(features: Feature[]): Phase[] {
    if (features.length === 0) {
      return [];
    }

    // Resolve dependencies to get execution order
    const graph = this.resolver.resolve(features);
    const executionOrder = graph.criticalPath;

    // Group features into phases based on dependencies and type
    const phases: Phase[] = [];
    const processed = new Set<string>();

    // Phase 1: Foundation (features with no dependencies)
    const foundationFeatures = features.filter(
      (f) => !f.dependencies || f.dependencies.length === 0
    );
    if (foundationFeatures.length > 0) {
      phases.push({
        number: 1,
        name: 'Foundation',
        goal: 'Set up core infrastructure',
        features: foundationFeatures,
      });
      foundationFeatures.forEach((f) => processed.add(f.id));
    }

    // Phase 2: Core Features (features that depend on foundation)
    const coreFeatures = features.filter(
      (f) =>
        !processed.has(f.id) &&
        f.dependencies &&
        f.dependencies.every((dep) => foundationFeatures.some((ff) => ff.id === dep))
    );
    if (coreFeatures.length > 0) {
      phases.push({
        number: phases.length + 1,
        name: 'Core Features',
        goal: 'Build core user-facing features',
        features: coreFeatures,
      });
      coreFeatures.forEach((f) => processed.add(f.id));
    }

    // Phase 3+: Remaining features organized by dependency depth
    const remaining = features.filter((f) => !processed.has(f.id));
    if (remaining.length > 0) {
      // Group by dependency depth
      const byDepth = this.groupByDepth(remaining, features);
      for (const [depth, featureGroup] of byDepth.entries()) {
        phases.push({
          number: phases.length + 1,
          name: this.getPhaseName(depth),
          goal: this.getPhaseGoal(depth),
          features: featureGroup,
        });
      }
    }

    return phases;
  }

  private groupByDepth(features: Feature[], allFeatures: Feature[]): Map<number, Feature[]> {
    const depthMap = new Map<number, Feature[]>();
    const featureMap = new Map(allFeatures.map((f) => [f.id, f]));

    const getDepth = (feature: Feature, visited: Set<string> = new Set()): number => {
      if (visited.has(feature.id)) {
        return 0; // Cycle protection
      }
      visited.add(feature.id);

      if (!feature.dependencies || feature.dependencies.length === 0) {
        return 0;
      }

      const maxDepDepth = Math.max(
        ...feature.dependencies.map((depId) => {
          const dep = featureMap.get(depId);
          return dep ? getDepth(dep, new Set(visited)) : 0;
        })
      );

      return maxDepDepth + 1;
    };

    for (const feature of features) {
      const depth = getDepth(feature);
      if (!depthMap.has(depth)) {
        depthMap.set(depth, []);
      }
      depthMap.get(depth)!.push(feature);
    }

    return depthMap;
  }

  private getPhaseName(depth: number): string {
    const names = [
      'Foundation',
      'Core Features',
      'Advanced Features',
      'Integrations',
      'Optimization',
      'Production Ready',
    ];
    return names[Math.min(depth, names.length - 1)] || `Phase ${depth + 1}`;
  }

  private getPhaseGoal(depth: number): string {
    const goals = [
      'Set up core infrastructure',
      'Build core user-facing features',
      'Add advanced functionality',
      'Connect with external services',
      'Improve performance and UX',
      'Prepare for production',
    ];
    return goals[Math.min(depth, goals.length - 1)] || 'Complete remaining features';
  }

  estimatePhase(phase: Phase): { days: number; weeks: number } {
    const totalDays = phase.features.reduce((sum, f) => {
      return sum + (f.estimatedTime?.days || 5);
    }, 0);

    return {
      days: totalDays,
      weeks: Math.ceil(totalDays / 5),
    };
  }
}

