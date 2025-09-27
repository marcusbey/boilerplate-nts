# setup-worktree.sh

## What it does

Creates an isolated Git worktree for a GitHub issue with intelligent branch naming and complete development setup.

## Why use it

- **Isolation**: Work on features without affecting main codebase
- **Smart naming**: AI generates descriptive branch names from issue content
- **Complete setup**: Automatically installs dependencies, copies env files, runs Prisma
- **Integration**: Opens Claude in plan mode for the issue

## How to use

```bash
./setup-worktree.sh <github-issue-url>
```

**Example:**

```bash
./setup-worktree.sh https://github.com/Melvynx/nowts/issues/42
```

This creates a new worktree at `~/Developer/worktrees/<project>-worktrees/issue-XX-descriptive-name/` ready for development.
