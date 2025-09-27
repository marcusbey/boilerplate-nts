---
description: Use this to create a complete new resource including database schema, navigation menu, and CRUD pages following the project's architecture patterns.
---

# New Resource Creation

Create a new resource with complete CRUD functionality including database schema, navigation, and pages.

## Steps

1. **Update Database Schema**
   - Modify `prisma/schema/schema.prisma` with the new resource

2. **Add Navigation**
   - Update `app/orgs/[orgSlug]/(navigation)/_navigation/org-navigation.links.ts`
   - Add a menu item for the new resource

3. **Create Resource Page**
   - Use `src/components/ui/card.tsx` and `src/components/ui/table.tsx`
   - Follow server components patterns
   - Implement filtering with query state if needed

4. **Create Resource Management Page**
   - Create `/resources/[resourceId]/page.tsx`
   - Handle modification and management functionality
   - Follow user requirements for specific features

## Components to Use

- Card component for layout
- Table component for data display
- Server components for performance
- Query state for filtering

Create the new resource for: $ARGUMENTS
