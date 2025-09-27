## 2025-08-23 - Major Platform Updates & Infrastructure Improvements

### 🚀 **New Features & Components**

- **GridBackground Component**: Added customizable grid background component for visual design
- **Admin Feedback System**: Complete feedback management with filters, tables, and detailed views
- **Documentation System**: New docs section with dynamic content management and sidebar navigation
- **Last Used Provider Tracking**: Enhanced sign-in experience with provider preference storage
- **Contact Pages**: Added about and contact pages for improved user engagement

### 📦 **Major Dependency Updates**

- **Next.js**: Updated to 15.5.0 with latest App Router features
- **React**: Updated to 19.1.1 with new React capabilities
- **AI SDK**: Updated to v5 with enhanced AI functionality
- **Radix UI**: Updated all component packages to latest versions
- **Development Tools**: Updated testing dependencies and build tools

### 🛠️ **Infrastructure & Development Workflow**

- **Claude Code Integration**: Enhanced workflow with new agents, commands, and formatting hooks
- **API Standards**: Improved file organization and API documentation structure
- **TypeScript Formatting**: Automated formatting hook for consistent code quality
- **Billing System**: Enhanced organization-level billing with improved error handling
- **Authentication**: Better user experience with provider tracking and improved layouts

## 2025-08-13 - Admin Interface & Organization Billing Migration

### 🛠️ **Complete Admin Interface Overhaul**

- **Built comprehensive admin dashboard from scratch**
  - Created admin navigation with sidebar layout and routing
  - Added admin-only authentication guards with proper role checking
  - Implemented consistent Layout components across all admin pages
- **User management interface**
  - User list with search, pagination, and role-based filtering
  - Individual user detail pages with session management
  - Better Auth integration for user impersonation, banning, and role changes
  - Real-time session tracking with device detection and revocation capabilities
  - Authentication provider display (GitHub, Google, Email/Password)
- **Organization management interface**
  - Organization list with search and pagination
  - Organization detail pages with member management
  - Subscription management with plan changes and billing controls
  - Payment history and Stripe integration for admin billing oversight
- **UI/UX consistency improvements**
  - Replaced Card hover effects with clean, professional styling
  - Made organization/user names clickable instead of separate "View" buttons
  - Added organization logos with avatar fallbacks matching user interface
  - Created reusable AutomaticPagination component for consistent pagination

### 💳 **Stripe Billing Architecture Refactor**

- **Moved billing ownership from User to Organization level**
  - Migrated `stripeCustomerId` from User model to Organization model
  - Updated all webhook handlers and billing actions for organization-based billing
  - Replaced Better-Auth subscription methods with custom server actions
- **Enhanced type safety and removed deprecated patterns**
  - Eliminated all `any` type usage in Stripe webhook handlers
  - Created proper TypeScript interfaces for Stripe webhook events
  - Fixed type compatibility issues across the billing system

### 🎨 **Billing Page UI Improvements**

- Refactored billing page with Card components and Typography
- Added plan limits section with progress bars showing current usage
- Simplified subscription details layout with clean key-value pairs
- Integrated real plan limits from auth-plans configuration

## 2025-07-14 - NOW.TS Claude Migration

### 🔧 **Prisma Configuration Migration**

- Migrate from deprecated `package.json#prisma` property to `prisma.config.ts`

### 🧪 **Playwright CI/CD Improvements**

- **Migrated Playwright workflow from Vercel deployment testing to local CI testing**
  - Changed trigger from `deployment_status` to `pull_request` and `push` events
  - Added PostgreSQL service container for database testing
  - Configured complete local environment with all required secrets
- **Enhanced test reliability and debugging**
  - Fixed delete account test case sensitivity issue (Delete vs delete)
  - Added comprehensive logging throughout all E2E tests
  - Improved button state validation and error handling
  - Added step-by-step emoji logging for better CI debugging
- **Build and deployment fixes**
  - Fixed NotifyNowts API call error handling to prevent build failures
  - Added proper error catching for external API dependencies
  - Updated Prisma migration strategy for CI environments

### 🔧 **Technical Improvements**

- **Environment configuration**
  - Added all required GitHub secrets for CI testing
  - Fixed DATABASE_URL_UNPOOLED configuration for Prisma
  - Properly configured OAuth secrets (renamed GITHUB*\* to OAUTH_GITHUB*\*)
- **Test infrastructure**
  - Enhanced Playwright reporter configuration for CI visibility
  - Improved test isolation and cleanup procedures
  - Added better error context and retry mechanisms
- Rename `RESEND_EMAIL_FROM` to `EMAIL_FROM`

## 2025-06-01

- Add a "orgs-list" page to view the list
- Fix the error of "API Error : No active organization"
- Add a "adapter" system for e-mail and upload of images
- Upgrade library to latest

## 2025-05-03

- Add NOW.TS deployed app tracker (can be removed)
- Add functional seed

## 2025-04-17

- Upgrade Prisma with output directory
- Replace redirect method
- Add resend contact support
- Fix navigation styles
- Fix hydratation error
- Upgrade to next 15.3.0
- Update `getOrg` logic to avoid any bugs

## 2025-04-06

- Replace `AuthJS` by `Better-Auth`
- Upgrade to Tailwind V4
- Use `Better-Auth` organization plugin
- Use `Better-Auth` Stripe plugin
- Upgrade layout and pages
- Use `Better-Auth` permissions
- Use middleware to handle authentification

## 2024-09-12

- Add `NEXT_PUBLIC_EMAIL_CONTACT` env variable
- Add `RESEND_EMAIL_FROM` env variable

## 2024-09-08

- Add `slug` to organizations
- Update URL with `slug` instead of `id`

## 2024-09-01

- Update NOW.TS to version 2 with organizations
