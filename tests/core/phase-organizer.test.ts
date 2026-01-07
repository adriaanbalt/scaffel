import { describe, it, expect } from 'vitest';
import { PhaseOrganizer } from '../../src/core/phase-organizer';
import type { Feature } from '../../src/core/generator';

describe('PhaseOrganizer', () => {
  it('should organize features into phases', () => {
    const organizer = new PhaseOrganizer();
    const features: Feature[] = [
      { id: 'auth', name: 'Authentication', dependencies: [] },
      { id: 'users', name: 'User Management', dependencies: ['auth'] },
      { id: 'payments', name: 'Payments', dependencies: ['users'] },
    ];

    const phases = organizer.organize(features);

    expect(phases.length).toBeGreaterThan(0);
    expect(phases[0].name).toBe('Foundation');
    expect(phases[0].features).toContainEqual(
      expect.objectContaining({ id: 'auth' })
    );
  });

  it('should estimate phase time', () => {
    const organizer = new PhaseOrganizer();
    const phase = {
      number: 1,
      name: 'Foundation',
      goal: 'Set up infrastructure',
      features: [
        {
          id: 'auth',
          name: 'Authentication',
          estimatedTime: { days: 5, weeks: 1 },
        },
        {
          id: 'db',
          name: 'Database',
          estimatedTime: { days: 3, weeks: 1 },
        },
      ],
    };

    const estimate = organizer.estimatePhase(phase);

    expect(estimate.days).toBe(8);
    expect(estimate.weeks).toBe(2);
  });
});

