# {{product.name}} Implementation Roadmap

**Creation Date:** {{date}}
**Updated Date:** {{date}}
**Github username:** {{author}}

---

## Overview

This document provides a sequential implementation plan for {{product.name}}'s technical features.

**Estimated Total Timeline:** {{timeline.total}} weeks ({{timeline.days}} days)

---

## Implementation Phases

{{#each phases}}
### Phase {{number}}: {{name}} (Weeks {{timeline.start}}-{{timeline.end}})
**Goal:** {{goal}}

{{#each features}}
#### {{number}}. {{name}}
{{#if description}}
**Description:** {{description}}
{{/if}}

**Estimated Time:** {{estimatedTime.days}} days
**Priority:** {{priority}}
{{#if category}}
**Category:** {{category}}
{{/if}}

{{#if dependencies.length}}
**Dependencies:**
{{#each dependencies}}
- {{this}}
{{/each}}
{{/if}}

**Checklist:** See [checklists/{{slug}}-checklist.md](./checklists/{{slug}}-checklist.md)

---

{{/each}}
{{/each}}

