/**
 * Dependency resolution system
 */

import type { Feature } from './generator';

export interface DependencyGraph {
  nodes: Feature[];
  edges: Array<{ from: string; to: string }>;
  cycles: string[][];
  criticalPath: string[];
}

export class DependencyResolver {
  resolve(features: Feature[]): DependencyGraph {
    const nodes = features;
    const edges: Array<{ from: string; to: string }> = [];
    const featureMap = new Map<string, Feature>();

    // Build feature map for quick lookup
    for (const feature of features) {
      featureMap.set(feature.id, feature);
    }

    // Build edges from dependencies
    for (const feature of features) {
      if (feature.dependencies) {
        for (const dep of feature.dependencies) {
          // Validate dependency exists
          if (!featureMap.has(dep)) {
            throw new Error(`Feature "${feature.id}" depends on non-existent feature "${dep}"`);
          }
          edges.push({ from: dep, to: feature.id });
        }
      }
    }

    // Detect cycles using DFS
    const cycles = this.detectCycles(nodes, edges);

    // Find critical path using topological sort
    const criticalPath = this.findCriticalPath(nodes, edges);

    return {
      nodes,
      edges,
      cycles,
      criticalPath,
    };
  }

  private detectCycles(
    nodes: Feature[],
    edges: Array<{ from: string; to: string }>
  ): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const adjList = new Map<string, string[]>();

    // Build adjacency list
    for (const edge of edges) {
      if (!adjList.has(edge.from)) {
        adjList.set(edge.from, []);
      }
      adjList.get(edge.from)!.push(edge.to);
    }

    // DFS to detect cycles
    const dfs = (nodeId: string, path: string[]): void => {
      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const neighbors = adjList.get(nodeId) || [];
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

      recStack.delete(nodeId);
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return cycles;
  }

  private findCriticalPath(
    nodes: Feature[],
    edges: Array<{ from: string; to: string }>
  ): string[] {
    // Build adjacency list and in-degree map
    const adjList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const nodeMap = new Map<string, Feature>();

    for (const node of nodes) {
      nodeMap.set(node.id, node);
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    }

    for (const edge of edges) {
      adjList.get(edge.from)!.push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    // Topological sort to find execution order
    const queue: string[] = [];
    const topoOrder: string[] = [];

    // Find nodes with no dependencies
    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    // Process nodes in topological order
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      topoOrder.push(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    // Critical path is the longest path in the DAG
    // For now, return topological order (can be enhanced with longest path algorithm)
    return topoOrder;
  }

  getCriticalPath(graph: DependencyGraph): string[] {
    return graph.criticalPath;
  }

  validateDependencies(features: Feature[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const featureIds = new Set(features.map((f) => f.id));

    for (const feature of features) {
      if (feature.dependencies) {
        for (const dep of feature.dependencies) {
          if (!featureIds.has(dep)) {
            errors.push(`Feature "${feature.id}" depends on non-existent feature "${dep}"`);
          }
          if (dep === feature.id) {
            errors.push(`Feature "${feature.id}" cannot depend on itself`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

