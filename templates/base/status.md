# {{product.name}} Implementation Status

**Creation Date:** {{date}}
**Updated Date:** {{date}}
**Github username:** {{author}}

---

## Overview

This document tracks the implementation progress of {{product.name}}'s technical features.

**Status Legend:**
- ✅ **Complete** - Feature fully implemented, tested, documented
- 🚧 **In Progress** - Currently being worked on
- ⏳ **Pending** - Not started yet
- 🔴 **Blocked** - Cannot proceed due to dependencies

---

## Overall Progress

**Total Features:** {{features.total}}
**Completed:** {{features.completed}}
**In Progress:** {{features.inProgress}}
**Pending:** {{features.pending}}
**Blocked:** {{features.blocked}}

**Completion:** {{features.percentage}}%

---

{{#each phases}}
## Phase {{number}}: {{name}}

**Status:** {{status}}
**Started:** {{started}}
**Completed:** {{completed}}
**Target Completion:** {{target}}

### Features

{{#each features}}
#### {{number}}. {{name}}
- **Status:** {{status}}
- **Started:** {{started}}
- **Completed:** {{completed}}
- **Blocked By:** {{blockedBy}}
- **Blocks:** {{blocks}}
- **Notes:** {{notes}}

---
{{/each}}
{{/each}}

