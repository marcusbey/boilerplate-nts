#!/bin/bash

# Git Worktree Cleanup Tool
#
# This script automatically cleans up Git worktrees that are no longer needed,
# specifically those associated with merged pull requests or deleted branches.
#
# FEATURES:
# - Automatically detects and removes worktrees for merged PRs
# - Removes worktrees for branches deleted from remote
# - Fetches latest remote information before cleanup
# - Prunes stale worktree references
# - Shows remaining worktrees after cleanup
#
# REQUIREMENTS:
# - Git with worktree support
# - GitHub CLI (gh) installed and authenticated
# - Proper remote origin configured
#
# USAGE:
#   ./clean-worktree.sh
#
# WHAT IT DOES:
# 1. Fetches latest remote information and prunes deleted branches
# 2. Lists all worktrees (excluding the main working directory)
# 3. For each worktree:
#    - Checks if the branch still exists on remote
#    - Checks if the PR for that branch has been merged
#    - Removes worktree if branch is deleted or PR is merged
# 4. Prunes any remaining stale worktree references
# 5. Shows final list of remaining worktrees
#
# SAFETY:
# - Only removes worktrees, never affects the main working directory
# - Uses --force flag to handle uncommitted changes in worktrees
# - Verifies branch existence on remote before deletion

# Fetch latest remote information
echo "Fetching remote information..."
git fetch --all --prune

# Get all worktrees except main
worktrees=$(git worktree list --porcelain | grep -B1 "^branch " | grep "^worktree " | grep -v "$(pwd)$" | cut -d' ' -f2-)

# Process each worktree
for worktree in $worktrees; do
    # Get branch name for this worktree
    branch=$(git worktree list --porcelain | grep -A1 "^worktree $worktree$" | grep "^branch " | sed 's/^branch refs\/heads\///')
    
    if [ -z "$branch" ]; then
        continue
    fi
    
    echo "Checking: $branch"
    
    # Check if branch exists on remote
    if ! git ls-remote --heads origin "$branch" | grep -q .; then
        echo "  → Branch deleted from remote, removing worktree"
        git worktree remove "$worktree" --force
        continue
    fi
    
    # Check if PR is merged
    merged_pr=$(gh pr list --state merged --head "$branch" --json number --jq '.[0].number' 2>/dev/null || echo "")
    if [ -n "$merged_pr" ]; then
        echo "  → PR #$merged_pr merged, removing worktree"
        git worktree remove "$worktree" --force
    fi
done

# Clean up any stale references
git worktree prune

echo "Done! Remaining worktrees:"
git worktree list