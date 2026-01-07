import { describe, it, expect } from 'vitest';
import { DependencyResolver } from '../../src/core/dependency-resolver';
import type { Feature } from '../../src/core/generator';

describe('DependencyResolver', () => {
  it('should resolve dependencies and build graph', () => {
    const resolver = new DependencyResolver();
    const features: Feature[] = [
      { id: 'auth', name: 'Authentication', dependencies: [] },
      { id: 'users', name: 'User Management', dependencies: ['auth'] },
      { id: 'payments', name: 'Payments', dependencies: ['auth'] },
    ];

    const graph = resolver.resolve(features);

    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toHaveLength(2);
    expect(graph.cycles).toHaveLength(0);
  });

  it('should detect circular dependencies', () => {
    const resolver = new DependencyResolver();
    const features: Feature[] = [
      { id: 'a', name: 'Feature A', dependencies: ['b'] },
      { id: 'b', name: 'Feature B', dependencies: ['a'] },
    ];

    const graph = resolver.resolve(features);

    expect(graph.cycles.length).toBeGreaterThan(0);
  });

  it('should find critical path', () => {
    const resolver = new DependencyResolver();
    const features: Feature[] = [
      { id: 'auth', name: 'Authentication', dependencies: [] },
      { id: 'users', name: 'User Management', dependencies: ['auth'] },
      { id: 'payments', name: 'Payments', dependencies: ['users'] },
    ];

    const graph = resolver.resolve(features);

    expect(graph.criticalPath).toContain('auth');
    expect(graph.criticalPath).toContain('users');
    expect(graph.criticalPath).toContain('payments');
  });

  it('should validate dependencies', () => {
    const resolver = new DependencyResolver();
    const features: Feature[] = [
      { id: 'auth', name: 'Authentication', dependencies: ['nonexistent'] },
    ];

    const validation = resolver.validateDependencies(features);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});

