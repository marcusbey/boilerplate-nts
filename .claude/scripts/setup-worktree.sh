#!/bin/bash

# Git Worktree Setup for GitHub Issues
# 
# This script automates the creation of Git worktrees for GitHub issues with intelligent
# branch naming and complete development environment setup.
#
# FEATURES:
# - Generates semantic branch names using Claude AI based on issue content
# - Creates isolated worktrees in ~/Developer/worktrees/<project>-worktrees/
# - Copies all environment files (.env*) to the new worktree
# - Installs dependencies automatically
# - Runs Prisma generation for all database schemas
# - Opens Ghostty terminal with Claude in plan mode for the issue
#
# REQUIREMENTS:
# - Git with worktree support
# - GitHub CLI (gh) installed and authenticated
# - Claude CLI installed and configured
# - pnpm package manager
# - jq for JSON parsing
# - Ghostty terminal (for auto-opening)
#
# USAGE:
#   ./setup-worktree.sh <github-issue-url>
#
# EXAMPLES:
#   ./setup-worktree.sh https://github.com/Melvynx/saveit.now/issues/18
#   ./setup-worktree.sh https://github.com/owner/repo/issues/123
#
# DIRECTORY STRUCTURE:
#   ~/Developer/worktrees/
#   └── <project-name>-worktrees/
#       └── issue-XX-descriptive-name/
#           ├── .env files (copied)
#           ├── node_modules/ (installed)
#           └── prisma/ (generated)

if [ $# -eq 0 ]; then
    echo "Usage: $0 <github-issue-url>"
    echo "Example: $0 https://github.com/owner/repo/issues/123"
    exit 1
fi

ISSUE_URL=$1

# Validate GitHub issue URL format
if [[ ! "$ISSUE_URL" =~ ^https://github\.com/[^/]+/[^/]+/issues/[0-9]+$ ]]; then
    echo "Error: Invalid GitHub issue URL format"
    echo "Expected format: https://github.com/owner/repo/issues/123"
    exit 1
fi

# Generate branch name using Claude CLI
echo "🤖 Generating branch name from issue..."
CLAUDE_OUTPUT=$(claude -p "Get information about this GitHub issue using 'gh' CLI: $ISSUE_URL. Based on the issue title and description, generate a perfect git branch name. The branch name MUST follow this format: 'issue-XX-some-understanding-name' where XX is the issue number and 'some-understanding-name' is a descriptive name based on the issue content. Use lowercase letters and hyphens only, no slashes or special characters. It should be suitable as a folder name. Return ONLY the branch name, nothing else." --output-format json --dangerously-skip-permissions 2>/dev/null)
BRANCH_NAME=$(echo "$CLAUDE_OUTPUT" | jq -r '.result' 2>/dev/null)

# Check if branch name generation was successful
if [ -z "$BRANCH_NAME" ] || [ "$BRANCH_NAME" = "null" ]; then
    echo "❌ Failed to generate branch name. Using fallback..."
    # Extract issue number from URL as fallback
    ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -o '[0-9]*$')
    BRANCH_NAME="issue-$ISSUE_NUMBER"
fi

echo "📌 Generated branch name: $BRANCH_NAME"
FEATURE_NAME=$BRANCH_NAME
PROJECT_NAME=$(basename "$(pwd)")
WORKTREE_PATH="$HOME/Developer/worktrees/${PROJECT_NAME}-worktrees/$FEATURE_NAME"

echo "🚀 Setting up worktree: $FEATURE_NAME"
echo "📁 Project: $PROJECT_NAME"

# Create worktree directory
mkdir -p "$HOME/Developer/worktrees/${PROJECT_NAME}-worktrees"

# Remove existing worktree if it exists
if [ -d "$WORKTREE_PATH" ]; then
    echo "⚠️  Removing existing worktree..."
    git worktree remove "$WORKTREE_PATH" 2>/dev/null || rm -rf "$WORKTREE_PATH"
fi

# Create the worktree
echo "📦 Creating worktree..."
git worktree add -b "$FEATURE_NAME" "$WORKTREE_PATH"

# Copy env files (including nested ones)
echo "📋 Copying environment files..."
find . -name ".env*" -type f | while read -r env_file; do
    relative_path="${env_file#./}"
    target_dir="$WORKTREE_PATH/$(dirname "$relative_path")"
    mkdir -p "$target_dir"
    cp "$env_file" "$target_dir/"
    echo "  📄 Copied: $relative_path"
done

# Setup worktree
cd "$WORKTREE_PATH"

# Install dependencies
if [ -f "package.json" ]; then
    echo "📥 Installing dependencies..."
    pnpm install
fi

# Run prisma generate for all nested prisma folders
find . -type d -name "prisma" -not -path "*/node_modules/*" | while read -r prisma_dir; do
    project_root=$(dirname "$prisma_dir")
    echo "🗄️  Running prisma generate in: $project_root"
    cd "$project_root" || continue
    
    if [ -f "package.json" ]; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm prisma generate
        elif [ -f "yarn.lock" ]; then
            yarn prisma generate
        else
            npm run prisma:generate 2>/dev/null || npx prisma generate
        fi
    fi
    
    cd "$WORKTREE_PATH" || return
done

echo "✅ Worktree ready at: $WORKTREE_PATH"

# Open Ghostty with Claude in plan mode for the issue
osascript -e "
    tell application \"Ghostty\"
        activate
        delay 0.5
        tell application \"System Events\"
            tell process \"Ghostty\"
                keystroke \"t\" using {command down}
                delay 0.2
                keystroke \"cd '$WORKTREE_PATH' && echo '🎯 Feature: $FEATURE_NAME' && echo '📂 Branch: \$(git branch --show-current)' && echo '🔗 Issue: $ISSUE_URL' && echo '' && claude --dangerously-skip-permissions --permission-mode plan '/run-tasks $ISSUE_URL'\"
                keystroke return
            end tell
        end tell
    end tell
"

echo "🎉 Done! Terminal opened with Claude in plan mode for issue: $ISSUE_URL"
