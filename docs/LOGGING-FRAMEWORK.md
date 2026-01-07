# Logging Framework

## Status: ✅ Complete

### Overview

Scaffel now uses a structured logging framework for internal operations while maintaining user-friendly console output for CLI interactions.

### Implementation

**Location:** `src/utils/logger.ts`

**Features:**
- Log levels: `debug`, `info`, `warn`, `error`
- Structured metadata support
- Environment-based log level configuration
- Component-based logging
- Human-readable format in development
- JSON format option for production

### Usage

#### Creating a Logger

```typescript
import { createLogger } from '@/utils/logger';

const logger = createLogger('ComponentName');
```

#### Logging Examples

```typescript
// Debug logging (only in debug mode)
logger.debug('Processing feature', { featureId: '123' });

// Info logging
logger.info('Feature loaded successfully', { count: 10 });

// Warning logging
logger.warn('Schema validation warnings', { warnings: [...] });

// Error logging
logger.error('Failed to load feature', error, { featureId: '123' });
```

### Configuration

**Environment Variables:**
- `LOG_LEVEL`: Set minimum log level (`debug`, `info`, `warn`, `error`)
- `NODE_ENV`: `production` defaults to `info`, otherwise `debug`
- `DEBUG`: When set, includes stack traces in error logs

**Example:**
```bash
LOG_LEVEL=debug npm run build
```

### Logging Strategy

#### ✅ Use Logger For:
- Internal operations (knowledge base loading, validation, etc.)
- Error tracking and debugging
- Warning messages
- Development/debugging information

#### ✅ Keep Console.log For:
- **CLI user-facing output** (success messages, progress indicators)
- **Generated code templates** (these are examples for users, not internal logs)

### Current Usage

**Replaced:**
- ✅ `console.warn` in `FeatureKnowledgeBase` → uses logger
- ✅ `console.warn` in `JsonProvider` → uses logger

**Kept as-is:**
- ✅ CLI `console.log/error` for user output (intentional)
- ✅ `console.error` in generated code templates (these are code examples for users)

### Benefits

1. **Structured Logging**: Consistent format with metadata
2. **Log Levels**: Control verbosity via environment variables
3. **Component Tracking**: Each logger is tagged with component name
4. **Error Context**: Better error tracking with stack traces (when DEBUG enabled)
5. **Production Ready**: Can switch to JSON format for log aggregation

### Future Enhancements

- [ ] Add file logging option
- [ ] Add log rotation
- [ ] Add log aggregation integration (e.g., Sentry, Datadog)
- [ ] Add performance logging helpers
- [ ] Add request correlation IDs

