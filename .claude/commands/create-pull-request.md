---
allowed-tools: Bash(git :*), Bash(gh :*)
description: Create a pull request for the current branch with meaningful title and description based on changes.
---

1. Check git status and current branch
2. Ensure the branch is pushed to remote
3. Get the diff between current branch and main/master
4. Analyze changes to create a meaningful PR title and description
5. Create pull request using `gh pr create` with proper title and body
6. Return the PR URL
