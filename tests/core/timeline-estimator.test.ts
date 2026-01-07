import { describe, it, expect } from 'vitest';
import { TimelineEstimator } from '../../src/core/timeline-estimator';
import type { Feature, Phase } from '../../src/core/generator';

describe('TimelineEstimator', () => {
  let estimator: TimelineEstimator;

  beforeEach(() => {
    estimator = new TimelineEstimator();
  });

  describe('estimate', () => {
    it('should use explicit estimate if provided', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        estimatedTime: { days: 10, weeks: 2 },
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBe(10);
      expect(estimate.weeks).toBe(2);
    });

    it('should estimate based on category - foundation', () => {
      const feature: Feature = {
        id: 'foundation',
        name: 'Foundation',
        category: 'foundation',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(3);
      expect(estimate.weeks).toBeGreaterThanOrEqual(1);
    });

    it('should estimate based on category - core', () => {
      const feature: Feature = {
        id: 'core',
        name: 'Core Feature',
        category: 'core',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThanOrEqual(1);
    });

    it('should estimate based on priority - critical', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        priority: 'critical',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(3);
    });

    it('should estimate based on priority - low', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        priority: 'low',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThanOrEqual(1);
    });

    it('should estimate based on dependencies - no dependencies', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        dependencies: [],
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThanOrEqual(1);
    });

    it('should estimate based on dependencies - many dependencies', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        dependencies: ['dep1', 'dep2', 'dep3', 'dep4', 'dep5'],
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(3);
    });

    it('should estimate authentication features with higher complexity', () => {
      const feature: Feature = {
        id: 'auth',
        name: 'Authentication',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(4);
    });

    it('should estimate payment features with higher complexity', () => {
      const feature: Feature = {
        id: 'payment',
        name: 'Payment Processing',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(5);
    });

    it('should estimate user management features with moderate complexity', () => {
      const feature: Feature = {
        id: 'users',
        name: 'User Management',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(3);
    });

    it('should estimate API integration features with higher complexity', () => {
      const feature: Feature = {
        id: 'api',
        name: 'API Integration',
        priority: 'medium',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThan(3);
    });

    it('should ensure minimum of 1 day', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Simple Feature',
        priority: 'low',
        category: 'enhancement',
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.days).toBeGreaterThanOrEqual(1);
    });

    it('should calculate weeks correctly', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test Feature',
        estimatedTime: { days: 12, weeks: 0 },
      };

      const estimate = estimator.estimate(feature);

      expect(estimate.weeks).toBeGreaterThanOrEqual(2);
    });
  });

  describe('estimatePhase', () => {
    it('should return zero for empty phase', () => {
      const phase: Phase = {
        number: 1,
        name: 'Empty Phase',
        goal: 'No features',
        features: [],
      };

      const estimate = estimator.estimatePhase(phase);

      expect(estimate.days).toBe(0);
      expect(estimate.weeks).toBe(0);
    });

    it('should estimate single feature phase', () => {
      const phase: Phase = {
        number: 1,
        name: 'Single Feature',
        goal: 'One feature',
        features: [
          {
            id: 'test',
            name: 'Test Feature',
            estimatedTime: { days: 5, weeks: 1 },
          },
        ],
      };

      const estimate = estimator.estimatePhase(phase);

      expect(estimate.days).toBe(5);
    });

    it('should estimate phase with multiple features accounting for parallel work', () => {
      const phase: Phase = {
        number: 1,
        name: 'Multiple Features',
        goal: 'Several features',
        features: [
          {
            id: 'test1',
            name: 'Test Feature 1',
            estimatedTime: { days: 5, weeks: 1 },
          },
          {
            id: 'test2',
            name: 'Test Feature 2',
            estimatedTime: { days: 3, weeks: 1 },
          },
          {
            id: 'test3',
            name: 'Test Feature 3',
            estimatedTime: { days: 4, weeks: 1 },
          },
        ],
      };

      const estimate = estimator.estimatePhase(phase);

      // Should be longest feature + coordination overhead + phase overhead
      // Longest: 5 days, coordination: (3 + 4) * 0.2 = 1.4, overhead: 1-2
      // Total should be around 7-8 days
      expect(estimate.days).toBeGreaterThan(5);
      expect(estimate.days).toBeLessThan(10);
    });

    it('should add more overhead for phases with many features', () => {
      const phase: Phase = {
        number: 1,
        name: 'Many Features',
        goal: 'Many features',
        features: Array.from({ length: 5 }, (_, i) => ({
          id: `test${i}`,
          name: `Test Feature ${i}`,
          estimatedTime: { days: 3, weeks: 1 },
        })),
      };

      const estimate = estimator.estimatePhase(phase);

      // Should account for more coordination overhead
      expect(estimate.days).toBeGreaterThan(3);
    });
  });

  describe('estimateTotal', () => {
    it('should estimate total for multiple phases', () => {
      const phases: Phase[] = [
        {
          number: 1,
          name: 'Phase 1',
          goal: 'First phase',
          features: [
            {
              id: 'test1',
              name: 'Test Feature 1',
              estimatedTime: { days: 5, weeks: 1 },
            },
          ],
        },
        {
          number: 2,
          name: 'Phase 2',
          goal: 'Second phase',
          features: [
            {
              id: 'test2',
              name: 'Test Feature 2',
              estimatedTime: { days: 3, weeks: 1 },
            },
          ],
        },
      ];

      const estimate = estimator.estimateTotal(phases);

      expect(estimate.days).toBe(8); // 5 + 3
      expect(estimate.weeks).toBeGreaterThanOrEqual(1);
    });

    it('should use phase estimatedTime if available', () => {
      const phases: Phase[] = [
        {
          number: 1,
          name: 'Phase 1',
          goal: 'First phase',
          estimatedTime: { days: 10, weeks: 2 },
          features: [
            {
              id: 'test1',
              name: 'Test Feature 1',
              estimatedTime: { days: 5, weeks: 1 },
            },
          ],
        },
      ];

      const estimate = estimator.estimateTotal(phases);

      expect(estimate.days).toBe(10); // Uses phase.estimatedTime
    });

    it('should calculate weeks correctly', () => {
      const phases: Phase[] = [
        {
          number: 1,
          name: 'Phase 1',
          goal: 'First phase',
          features: [
            {
              id: 'test1',
              name: 'Test Feature 1',
              estimatedTime: { days: 12, weeks: 0 },
            },
          ],
        },
      ];

      const estimate = estimator.estimateTotal(phases);

      expect(estimate.weeks).toBeGreaterThanOrEqual(2); // 12 days = 3 weeks (rounded up)
    });
  });
});
