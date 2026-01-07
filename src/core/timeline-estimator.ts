/**
 * Timeline estimation system
 *
 * Provides intelligent time estimation based on feature complexity,
 * category, priority, dependencies, and type.
 */

import type { Feature, Phase } from './generator';

export interface TimeEstimate {
  days: number;
  weeks: number;
}

interface EstimationFactors {
  baseDays: number;
  categoryMultiplier: number;
  priorityMultiplier: number;
  dependencyMultiplier: number;
  typeMultiplier: number;
}

export class TimelineEstimator {
  /**
   * Estimate time for a single feature based on various factors
   */
  estimate(feature: Feature): TimeEstimate {
    // If feature already has an explicit estimate, use it
    if (feature.estimatedTime) {
      return {
        days: feature.estimatedTime.days,
        weeks: feature.estimatedTime.weeks || Math.ceil(feature.estimatedTime.days / 5),
      };
    }

    const factors = this.calculateFactors(feature);
    const estimatedDays = Math.round(
      factors.baseDays *
        factors.categoryMultiplier *
        factors.priorityMultiplier *
        factors.dependencyMultiplier *
        factors.typeMultiplier
    );

    // Ensure minimum of 1 day
    const days = Math.max(1, estimatedDays);
    const weeks = Math.ceil(days / 5);

    return { days, weeks };
  }

  /**
   * Calculate estimation factors based on feature characteristics
   */
  private calculateFactors(feature: Feature): EstimationFactors {
    // Base estimation: 3 days for a simple feature
    let baseDays = 3;

    // Category multiplier
    let categoryMultiplier = 1.0;
    if (feature.category === 'foundation') {
      categoryMultiplier = 1.5; // Foundation features take longer
      baseDays = 5; // Higher base for foundation
    } else if (feature.category === 'core') {
      categoryMultiplier = 1.2;
      baseDays = 4;
    } else if (feature.category === 'enhancement') {
      categoryMultiplier = 0.8; // Enhancements are usually simpler
      baseDays = 2;
    }

    // Priority multiplier
    let priorityMultiplier = 1.0;
    switch (feature.priority) {
      case 'critical':
        priorityMultiplier = 1.3; // Critical features need more time for quality
        break;
      case 'high':
        priorityMultiplier = 1.1;
        break;
      case 'medium':
        priorityMultiplier = 1.0;
        break;
      case 'low':
        priorityMultiplier = 0.9;
        break;
    }

    // Dependency multiplier (more dependencies = more complexity)
    const dependencyCount = feature.dependencies?.length || 0;
    let dependencyMultiplier = 1.0;
    if (dependencyCount === 0) {
      dependencyMultiplier = 1.0;
    } else if (dependencyCount <= 2) {
      dependencyMultiplier = 1.1; // Small overhead for dependencies
    } else if (dependencyCount <= 4) {
      dependencyMultiplier = 1.2; // Moderate complexity
    } else {
      dependencyMultiplier = 1.4; // High complexity
    }

    // Type multiplier (specific feature types have known complexities)
    let typeMultiplier = 1.0;
    const featureNameLower = feature.name.toLowerCase();

    if (featureNameLower.includes('auth') || featureNameLower.includes('authentication')) {
      typeMultiplier = 1.4; // Authentication is complex
      baseDays = 5;
    } else if (featureNameLower.includes('payment') || featureNameLower.includes('billing')) {
      typeMultiplier = 1.5; // Payments are very complex
      baseDays = 7;
    } else if (featureNameLower.includes('user') && featureNameLower.includes('management')) {
      typeMultiplier = 1.2; // User management is moderately complex
      baseDays = 4;
    } else if (featureNameLower.includes('api') || featureNameLower.includes('integration')) {
      typeMultiplier = 1.3; // API integrations can be complex
      baseDays = 4;
    } else if (featureNameLower.includes('dashboard') || featureNameLower.includes('analytics')) {
      typeMultiplier = 1.2; // Dashboards need UI work
      baseDays = 4;
    } else if (featureNameLower.includes('notification') || featureNameLower.includes('email')) {
      typeMultiplier = 1.1; // Notifications are moderately complex
      baseDays = 3;
    } else if (featureNameLower.includes('search') || featureNameLower.includes('filter')) {
      typeMultiplier = 1.1; // Search/filter is moderately complex
      baseDays = 3;
    }

    return {
      baseDays,
      categoryMultiplier,
      priorityMultiplier,
      dependencyMultiplier,
      typeMultiplier,
    };
  }

  /**
   * Estimate time for a phase
   * Accounts for parallel work opportunities and phase overhead
   */
  estimatePhase(phase: Phase): TimeEstimate {
    if (phase.features.length === 0) {
      return { days: 0, weeks: 0 };
    }

    // Calculate individual feature estimates
    const featureEstimates = phase.features.map((f) => this.estimate(f));

    // For phases with multiple features, account for parallel work
    // Not all features can be done in parallel (due to dependencies),
    // but we can estimate based on the critical path
    if (phase.features.length === 1) {
      // Single feature: use its estimate directly
      return featureEstimates[0];
    }

    // Multiple features: calculate critical path
    // Simple heuristic: longest feature + 20% of others (for coordination)
    const sortedEstimates = [...featureEstimates].sort((a, b) => b.days - a.days);
    const longestFeature = sortedEstimates[0];
    const otherFeatures = sortedEstimates.slice(1);

    // Add 20% of other features' time (for coordination, testing, integration)
    const coordinationOverhead = otherFeatures.reduce((sum, est) => sum + est.days * 0.2, 0);

    // Phase overhead: 1-2 days for integration, testing, deployment
    const phaseOverhead = phase.features.length > 3 ? 2 : 1;

    const totalDays = Math.round(longestFeature.days + coordinationOverhead + phaseOverhead);

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
