# {{product.name}} Implementation Roadmap

**Creation Date:** {{date}}
**Updated Date:** {{date}}
**Github username:** {{author}}

---

## Overview

This document provides a sequential implementation plan for {{product.name}}'s technical features.

**Estimated Total Timeline:** {{timeline.total}} weeks

---

## Implementation Phases

{{#each phases}}
### Phase {{number}}: {{name}} (Weeks {{timeline.start}}-{{timeline.end}})
**Goal:** {{goal}}

{{#each features}}
#### {{number}}. {{name}}
**Estimated Time:** {{estimatedTime.days}} days
**Priority:** {{priority}}

**Dependencies:**
{{#each dependencies}}
- {{this}}
{{/each}}

**Checklist:** See [checklists/{{number}}-{{slug}}-checklist.md](./checklists/{{number}}-{{slug}}-checklist.md)

---

{{/each}}
{{/each}}

