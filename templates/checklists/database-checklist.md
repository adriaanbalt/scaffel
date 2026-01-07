# {{feature.name}} Implementation Checklist

**Feature:** {{feature.name}}
**Phase:** {{phase.number}} - {{phase.name}}
**Estimated Time:** {{feature.estimatedTime.days}} days
**Priority:** {{feature.priority}}

---

## Prerequisites

{{#each prerequisites}}
- [ ] {{this}}
{{/each}}

---

## Implementation Tasks

### 1. Core Implementation

{{#each implementationTasks}}
- [ ] {{this}}
{{/each}}

### 2. API Routes

{{#if includeAPI}}
{{#each apiRoutes}}
- [ ] {{this}}
{{/each}}
{{/if}}

### 3. Testing

{{#each testingTasks}}
- [ ] {{this}}
{{/each}}

### 4. Documentation

{{#each documentationTasks}}
- [ ] {{this}}
{{/each}}

---

## Completion Criteria

{{#each completionCriteria}}
- [ ] {{this}}
{{/each}}

---

## Notes

*Implementation notes, deviations, or considerations*

