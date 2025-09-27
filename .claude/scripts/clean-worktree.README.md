# clean-worktree.sh

## What it does

Automatically removes Git worktrees for merged pull requests and deleted branches.

## Why use it

- **Cleanup**: Keeps your workspace tidy by removing completed work
- **Automatic**: No manual tracking of which PRs are merged
- **Safe**: Only removes worktrees, never affects main directory
- **Storage**: Frees up disk space from old feature branches

## How to use

```bash
./clean-worktree.sh
```

No arguments needed. The script will:

1. Check all worktrees for merged PRs or deleted branches
2. Remove obsolete worktrees automatically
3. Show remaining active worktrees

Run this periodically to maintain a clean development environment.
