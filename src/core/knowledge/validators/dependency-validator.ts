/**
 * Dependency validator for feature knowledge
 *
 * Validates that all dependencies reference existing features and
 * detects circular dependencies.
 */

import type { FeatureKnowledge } from '../types';

export interface DependencyValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  circularDependencies: string[][];
}

export class DependencyValidator {
  /**
   * Validate dependencies for a set of features
   */
  validate(features: FeatureKnowledge[]): DependencyValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const featureNames = new Set(features.map((f) => f.name));

    // Build dependency graph
    const graph = new Map<string, string[]>();
    features.forEach((feature) => {
      graph.set(feature.name, feature.commonDependencies);
    });

    // Validate all dependencies exist
    features.forEach((feature) => {
      feature.commonDependencies.forEach((dep) => {
        if (!featureNames.has(dep)) {
          errors.push(`Feature "${feature.name}" depends on non-existent feature "${dep}"`);
        }
        if (dep === feature.name) {
          errors.push(`Feature "${feature.name}" cannot depend on itself`);
        }
      });
    });

    // Detect circular dependencies
    const circularDependencies = this.detectCycles(graph);

    if (circularDependencies.length > 0) {
      errors.push(
        `Circular dependencies detected: ${circularDependencies.map((cycle) => cycle.join(' -> ')).join(', ')}`
      );
    }

    // Check for deep dependency chains (potential performance issue)
    features.forEach((feature) => {
      const depth = this.getDependencyDepth(feature.name, graph, new Set());
      if (depth > 10) {
        warnings.push(`Feature "${feature.name}" has very deep dependency chain (depth: ${depth})`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      circularDependencies,
    };
  }

  /**
   * Detect circular dependencies using DFS
   */
  private detectCycles(graph: Map<string, string[]>): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          // Cycle detected
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart).concat(neighbor);
          cycles.push(cycle);
        }
      }

      recStack.delete(node);
    };

    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  /**
   * Get the depth of a dependency chain
   */
  private getDependencyDepth(
    featureName: string,
    graph: Map<string, string[]>,
    visited: Set<string>
  ): number {
    if (visited.has(featureName)) {
      return 0; // Cycle protection
    }
    visited.add(featureName);

    const dependencies = graph.get(featureName) || [];
    if (dependencies.length === 0) {
      return 0;
    }

    const maxDepth = Math.max(
      ...dependencies.map((dep) => this.getDependencyDepth(dep, graph, new Set(visited)))
    );

    return maxDepth + 1;
  }
}
