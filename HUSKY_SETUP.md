# Husky Setup for Scaffel

**Creation Date:** January 6, 2026 at 9:09 PM
**Updated Date:** January 6, 2026 at 9:09 PM
**Github username:** adriaanbalt

---

## Overview

Husky has been configured to run pre-deployment verifications to ensure code quality before commits and npm publishes.

---

## Hooks Configured

### 1. Pre-Commit Hook (`.husky/pre-commit`)

Runs before every commit:
- ✅ **lint-staged** - Lints and formats only staged files
- ✅ **TypeScript type check** - Ensures no type errors

**What it does:**
- Automatically fixes linting issues in staged files
- Formats code with Prettier
- Checks for TypeScript errors
- Prevents commit if checks fail

### 2. Pre-Publish Hook (`.husky/pre-publish`)

Runs before `npm publish`:
- ✅ **Build verification** - Ensures `dist/` directory exists
- ✅ **Bin file check** - Verifies CLI bin file exists
- ✅ **Linting** - Full lint check
- ✅ **Type check** - TypeScript validation
- ✅ **Tests** - Runs test suite (with option to skip)
- ✅ **Package.json validation** - Verifies bin path

**What it does:**
- Ensures code is built before publishing
- Verifies all required files exist
- Runs quality checks
- Prevents publish if verification fails

---

## Setup Instructions

### Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Husky:**
   ```bash
   npm run prepare
   ```
   This will set up Husky hooks.

3. **Verify hooks are installed:**
   ```bash
   ls -la .husky/
   ```
   You should see:
   - `pre-commit`
   - `pre-publish`

### Manual Hook Installation (if needed)

```bash
# Install Husky
npm install --save-dev husky

# Initialize
npx husky init

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint-staged && npm run type-check"

# Add pre-publish hook
npx husky add .husky/pre-publish ".husky/pre-publish"
```

---

## Configuration

### lint-staged

Configured in `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

This automatically:
- Fixes ESLint errors in staged TypeScript files
- Formats code with Prettier

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "type-check": "tsc --noEmit",
    "verify": "npm run lint && npm run type-check && npm run test && npm run build",
    "verify:build": "npm run lint && npm run type-check && npm run build",
    "prepare": "husky || true",
    "prepublishOnly": ".husky/pre-publish"
  }
}
```

---

## Usage

### Normal Development

1. **Make changes:**
   ```bash
   git add .
   git commit -m "Your message"
   ```
   Pre-commit hook runs automatically.

2. **If checks fail:**
   - Fix the errors
   - Stage fixes: `git add .`
   - Commit again: `git commit -m "Your message"`

### Publishing to NPM

1. **Publish:**
   ```bash
   npm publish --access public
   ```
   Pre-publish hook runs automatically.

2. **If verification fails:**
   - Fix the errors
   - Run verification manually: `npm run verify`
   - Try publishing again

### Manual Verification

Run full verification anytime:

```bash
# Full verification (lint + type-check + test + build)
npm run verify

# Build verification only
npm run verify:build
```

---

## Troubleshooting

### Hook Not Running

1. **Check if Husky is installed:**
   ```bash
   npm list husky
   ```

2. **Reinitialize Husky:**
   ```bash
   npm run prepare
   ```

3. **Check hook permissions:**
   ```bash
   ls -la .husky/
   chmod +x .husky/pre-commit
   chmod +x .husky/pre-publish
   ```

### Skip Hooks (Emergency Only)

**⚠️ Only use in emergencies!**

```bash
# Skip pre-commit
git commit --no-verify -m "Emergency commit"

# Skip pre-publish (not recommended)
npm publish --access public --ignore-scripts
```

### Common Issues

1. **"Cannot find module" errors:**
   - Run `npm install` to ensure dependencies are installed
   - Check `node_modules` exists

2. **"Permission denied" errors:**
   - Make hooks executable: `chmod +x .husky/*`

3. **"dist directory not found":**
   - Run `npm run build` first
   - Check `tsconfig.json` output directory

---

## Benefits

✅ **Prevents broken code from being committed**
✅ **Ensures code is built before publishing**
✅ **Automatically fixes formatting issues**
✅ **Catches type errors early**
✅ **Maintains code quality standards**

---

## Based on Markense Setup

This Husky configuration is based on the proven setup used in the Markense project, adapted for Scaffel's needs.

---

**Last Updated:** January 6, 2026 at 9:09 PM

