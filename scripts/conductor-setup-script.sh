#!/bin/bash

# Conductor setup script for nowts app
# Runs when a workspace is created. Used for copying .env files and installing dependencies.

set -e

# Get the workspace name from environment variable
WORKSPACE_NAME="${CONDUCTOR_WORKSPACE_NAME}"

# Ensure workspace name is provided
if [ -z "$WORKSPACE_NAME" ]; then
    echo "Error: CONDUCTOR_WORKSPACE_NAME is not set"
    exit 1
fi

echo "Setting up NowTS workspace: $WORKSPACE_NAME"

# Function to copy and update .env file with database URL replacement
update_env_file() {
    local env_path=$1
    local root_env_path="$CONDUCTOR_ROOT_PATH/$env_path"

    if [ -f "$root_env_path" ]; then
        cp "$root_env_path" "$env_path"
        echo "✅ Copied $env_path"

        # Update database URLs with workspace-specific names
        if grep -q "^DATABASE_URL=" "$env_path"; then
            NEW_DB_NAME="now-ts-$WORKSPACE_NAME"

            # Update main database URL
            sed -i.bak "s|^DATABASE_URL=\"postgresql://melvynx:@localhost:5432/now-ts\"|DATABASE_URL=\"postgresql://melvynx:@localhost:5432/$NEW_DB_NAME\"|" "$env_path"

            # Update unpooled database URL if it exists
            if grep -q "^DATABASE_URL_UNPOOLED=" "$env_path"; then
                sed -i.bak "s|^DATABASE_URL_UNPOOLED=\"postgresql://melvynx:@localhost:5432/now-ts\"|DATABASE_URL_UNPOOLED=\"postgresql://melvynx:@localhost:5432/$NEW_DB_NAME\"|" "$env_path"
            fi

            echo "✅ Updated DATABASE_URLs in $env_path to use: $NEW_DB_NAME"
            rm -f "$env_path.bak"
        fi
    else
        echo "⚠️  Warning: $root_env_path not found"
    fi
}

# Copy and update .env files
echo "Copying .env files..."

# Update main .env file
update_env_file ".env"

# Copy .env-template if it exists
if [ -f "$CONDUCTOR_ROOT_PATH/.env-template" ]; then
    cp "$CONDUCTOR_ROOT_PATH/.env-template" ".env-template"
    echo "✅ Copied .env-template"
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Generate Prisma client
echo "Generating Prisma client..."
pnpm prisma generate

# Create the new database
NEW_DB_NAME="now-ts-$WORKSPACE_NAME"

echo "Creating database: $NEW_DB_NAME"
createdb -U melvynx "$NEW_DB_NAME"

# Dump original database and import to new one
echo "Copying data from original database..."
ORIGINAL_DB="now-ts"

# Check if original database exists and copy data
if psql -U melvynx -lqt | cut -d \| -f 1 | grep -qw "$ORIGINAL_DB"; then
    echo "Found original database '$ORIGINAL_DB', copying data..."

    # Dump original database and pipe directly to new database
    pg_dump -U melvynx --no-owner --no-privileges "$ORIGINAL_DB" | psql -U melvynx "$NEW_DB_NAME"

    echo "✅ Data copied from '$ORIGINAL_DB' to '$NEW_DB_NAME'"
else
    echo "⚠️  Original database '$ORIGINAL_DB' not found, running migrations instead..."
    # Run database migrations if no original database to copy from
    pnpm prisma migrate deploy
fi

echo "🎉 NowTS workspace '$WORKSPACE_NAME' setup completed successfully!"
echo "Database: $NEW_DB_NAME"
echo "Ready to start development with: pnpm dev"