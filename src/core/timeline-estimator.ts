/**
 * Timeline estimation system
 */

import type { Feature, Phase } from './generator';

export interface TimeEstimate {
  days: number;
  weeks: number;
}

export class TimelineEstimator {
  estimate(feature: Feature): TimeEstimate {
    // TODO: Implement feature time estimation
    // Default: 3-5 days for most features
    return {
      days: feature.estimatedTime?.days || 5,
      weeks: feature.estimatedTime?.weeks || 1,
    };
  }

  estimatePhase(phase: Phase): TimeEstimate {
    // TODO: Implement phase time estimation
    const totalDays = phase.features.reduce((sum, f) => {
      const estimate = this.estimate(f);
      return sum + estimate.days;
    }, 0);

    return {
      days: totalDays,
      weeks: Math.ceil(totalDays / 5),
    };
  }

  estimateTotal(phases: Phase[]): TimeEstimate {
    const totalDays = phases.reduce((sum, phase) => {
      // Use phase.estimatedTime if available, otherwise calculate
      if (phase.estimatedTime) {
        return sum + phase.estimatedTime.days;
      }
      const estimate = this.estimatePhase(phase);
      return sum + estimate.days;
    }, 0);

    return {
      days: totalDays,
      weeks: Math.ceil(totalDays / 5),
    };
  }
}

