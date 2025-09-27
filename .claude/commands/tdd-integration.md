---
description: Use this to build React components with Test-Driven Development approach using Playwright integration tests that include database and real functionality.
---

# TDD Integration Component Development

Create React components with full integration testing using TDD principles.

## Context

- Build components following TDD principles
- Full integration tests with database and real functionality
- Write integration tests FIRST, then implement the component

## Workflow

1. **Research** - Read existing code that needs to be edited
2. **Plan** - Define component location, name, and functionality
3. **Create test file** in the `e2e/` folder
4. **Create component** and page in the correct folder following project rules
5. **Run tests** with `pnpm test:e2e:ci -g "test-name"`
6. **Iterate** - Fix the component until tests pass

## Debug Tips

- Use `page.evaluate` to test content
- Use `console.log` inside the page for debugging
- NO screenshots allowed
- NO `page.pause()` allowed

## Important Notes

- Most tables are Organization-related and must be created in `/orgs/[orgSlug]` folder
- Use Prisma for database operations
- Follow authentication patterns from `e2e/utils/auth-test.ts`

Create the integration test for: $ARGUMENTS
