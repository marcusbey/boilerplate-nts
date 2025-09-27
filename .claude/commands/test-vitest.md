---
description: Use this to create unit tests for React components using Vitest and React Testing Library for testing component logic and user interactions without database dependencies.
---

# Vitest Unit Testing

Create unit tests for React components using Vitest and React Testing Library.

## Context

- Create tests in the `__tests__` folder (root of project)
- Use the setup utility for component testing
- Run tests with `pnpm test:ci <name-of-the-file>`

## Test Template

```tsx
import { setup } from "../test/setup";
import { screen, waitFor } from "@testing-library/react";

describe("ComponentName", () => {
  it("should do...", async () => {
    const { user } = setup(<ComponentName />);

    // Use `screen` for element retrieving
    // Use `user` to interact with the page
  });
});
```

## Instructions

1. Create test file in the `__tests__` directory
2. Import the component and setup utility
3. Use `screen` for element queries
4. Use `user` for interactions
5. Run `pnpm test:ci <filename>` to verify

Create the test for: $ARGUMENTS
