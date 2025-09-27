#!/bin/bash

# Conductor archive script for nowts app
# Runs when a workspace is archived. Used for cleaning up external resources.

set -e

# Get the workspace name from environment variable
WORKSPACE_NAME="${CONDUCTOR_WORKSPACE_NAME}"

# Ensure workspace name is provided
if [ -z "$WORKSPACE_NAME" ]; then
    echo "Error: CONDUCTOR_WORKSPACE_NAME is not set"
    exit 1
fi

echo "Archiving NowTS workspace: $WORKSPACE_NAME"

# Function to extract database name from .env file
get_db_name_from_env() {
    local env_file=$1
    local db_type=$2  # main or unpooled

    if [ -f "$env_file" ]; then
        local pattern=""
        case $db_type in
            "main")
                pattern="^DATABASE_URL="
                ;;
            "unpooled")
                pattern="^DATABASE_URL_UNPOOLED="
                ;;
        esac

        local db_name=$(grep "$pattern" "$env_file" | sed 's/.*postgresql:\/\/melvynx:@localhost:5432\///; s/".*//')
        if [ -n "$db_name" ]; then
            echo "$db_name"
            return 0
        fi
    fi
    return 1
}

# Function to safely drop a database
drop_database_if_exists() {
    local db_name=$1
    local db_description=$2

    if [ -z "$db_name" ]; then
        echo "⚠️  No database name provided for $db_description, skipping"
        return
    fi

    echo "Cleaning up $db_description: $db_name"

    # Check if database exists before trying to drop it
    if psql -U melvynx -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
        echo "Database $db_name found, dropping..."

        # Terminate all connections to the database before dropping
        psql -U melvynx -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$db_name';"

        # Drop the database
        dropdb -U melvynx "$db_name"

        echo "✅ Database $db_name successfully deleted"
    else
        echo "⚠️  Database $db_name not found, skipping deletion"
    fi
}

# Try to get database names from .env file
MAIN_DB_NAME=""
UNPOOLED_DB_NAME=""

if [ -f ".env" ]; then
    MAIN_DB_NAME=$(get_db_name_from_env ".env" "main" 2>/dev/null || echo "")
    UNPOOLED_DB_NAME=$(get_db_name_from_env ".env" "unpooled" 2>/dev/null || echo "")

    if [ -n "$MAIN_DB_NAME" ]; then
        echo "Found main database name in .env: $MAIN_DB_NAME"
    fi
    if [ -n "$UNPOOLED_DB_NAME" ]; then
        echo "Found unpooled database name in .env: $UNPOOLED_DB_NAME"
    fi
else
    echo "No .env file found, using expected database names"
fi

# Fallback to expected names if not found in .env
if [ -z "$MAIN_DB_NAME" ]; then
    MAIN_DB_NAME="now-ts-$WORKSPACE_NAME"
    echo "Using expected main database name: $MAIN_DB_NAME"
fi

# Drop databases
drop_database_if_exists "$MAIN_DB_NAME" "main database"

# Drop unpooled database if it's different from main
if [ -n "$UNPOOLED_DB_NAME" ] && [ "$UNPOOLED_DB_NAME" != "$MAIN_DB_NAME" ]; then
    drop_database_if_exists "$UNPOOLED_DB_NAME" "unpooled database"
fi

echo "🗑️  NowTS workspace '$WORKSPACE_NAME' archived and cleaned up successfully!"