---
description: Use this to create comprehensive end-to-end tests using Playwright for full application testing including user interactions and database operations.
---

# Playwright E2E Testing

Create end-to-end tests using Playwright for full application testing.

## Context

- Create tests in the `e2e/` folder
- Use `pnpm test:e2e:ci -g "test-name"` for running specific tests
- Always use `src/lib/prisma.ts` for database access
- Utility functions available in `e2e/utils/auth-test.ts`

## Guidelines

1. Create test file in the `e2e/` directory
2. Use auth utilities for authentication testing
3. Use Prisma for database operations
4. Run tests with `pnpm test:e2e:ci -g "test-name"`
5. Remove console.log statements after tests pass

## Database Access

Always use the Prisma instance from `src/lib/prisma.ts` for database operations.

## Available Utils

- `e2e/utils/auth-test.ts` - Authentication testing utilities

Create the E2E test for: $ARGUMENTS
