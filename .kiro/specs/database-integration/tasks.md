# Implementation Plan: Database Integration

## Overview

Replace all hardcoded mock data with real database queries across public and admin pages. Fix middleware authentication, remove mock auth fallback, update seed script for idempotency, and add loading/error states.

**Language:** TypeScript (Next.js 16 / React 19)

## Tasks

- [x] 1. Fix prisma/seed.ts for idempotent re-runs
  - Change services seeding from `create` to a delete-then-recreate or findFirst-then-create pattern to avoid duplicate errors on re-run
  - Change schedules seeding to delete existing schedules before recreating
  - Change FAQs seeding to upsert by question field or delete-then-recreate
  - Wrap entire seed in a transaction where possible
  - Verify seed runs cleanly with `npx tsx prisma/seed.ts` (twice without errors)
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 2. Fix middleware authentication
  - [x] 2.1 Update src/middleware.ts to use NextAuth auth() function
    - Import `auth` from `@/lib/auth-config`
    - Wrap middleware with `auth` to get session in request
    - For `/admin/*` routes (except `/admin/login`): redirect to `/admin/login` if no session
    - For `/company/*` routes (except `/company/login`): redirect to `/company/login` if no session
    - For `/api/admin/*` routes: return `NextResponse.json({ error: "Unauthorized" }, { status: 401 })` if no session
    - Allow authenticated requests to pass through
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 3. Remove mock auth fallback from auth-config.ts
  - [x] 3.1 Clean up src/lib/auth-config.ts
    - Remove the try/catch block that falls back to mock credentials when DB is unavailable
    - Remove hardcoded mock user objects (`admin@rinjanitransport.com`, `operator@gilispeedboat.com`)
    - Keep only the database authentication path: query `prisma.user.findUnique`, hash password with SHA-256, compare
    - If user not found or password mismatch, return `null`
    - If database connection fails, let the error propagate (NextAuth will handle it as auth failure)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 4. Checkpoint - Verify auth and seed
  - Ensure `npx tsx prisma/seed.ts` runs without errors
  - Ensure `next build` passes without type errors
  - Ask the user if questions arise

- [x] 5. Public pages: Routes page with database data
  - [x] 5.1 Convert src/app/(public)/routes/page.tsx to async Server Component
    - Import `prisma` from `@/lib/db`
    - Query active routes with `fromLocation`, `toLocation`, and `services` (to compute priceFrom)
    - Map database results to RouteCard props: `title`, `from` (fromLocation.name), `to` (toLocation.name), `duration` (estimatedDuration), `priceFrom` (Math.min of services basePrice), `currency`, `transferType`, `href` (`/routes/${slug}`)
    - Remove the hardcoded `ALL_ROUTES` array
    - Handle case where no routes exist (show empty state)
    - _Requirements: 1.1, 1.2_

  - [x] 5.2 Add loading.tsx for routes page
    - Create `src/app/(public)/routes/loading.tsx`
    - Use `Skeleton` component to render a grid of route card placeholders (matching 3-column grid layout)
    - _Requirements: 1.4, 15.1_

  - [x] 5.3 Add error.tsx for routes page
    - Create `src/app/(public)/routes/error.tsx` as a Client Component (required by Next.js)
    - Display `ErrorState` component with retry button that calls `reset()`
    - _Requirements: 1.3, 16.1_

- [x] 6. Public pages: Homepage components with database data
  - [x] 6.1 Convert PopularRoutes to fetch from database
    - Create `src/components/public/PopularRoutesServer.tsx` as async Server Component
    - Query top 5 active routes with `fromLocation`, `toLocation`, and `services` (minimum basePrice)
    - Pass fetched data as props to the client PopularRoutes component
    - Update `PopularRoutes.tsx` to accept `routes` prop instead of using hardcoded `POPULAR_ROUTES`
    - Keep the client component for `useApp()` (locale, formatPrice) — just remove mock data
    - Wrap with try/catch: on error, return null (don't break homepage)
    - Update the homepage to use `PopularRoutesServer` instead of `PopularRoutes`
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 6.2 Convert PopularDestinations to fetch from database
    - Create `src/components/public/PopularDestinationsServer.tsx` as async Server Component
    - Query active locations (islands, cities, harbors), take 6
    - Pass fetched data as props to `PopularDestinations` client component
    - Update `PopularDestinations.tsx` to accept `destinations` prop
    - Remove hardcoded `DESTINATIONS` array
    - Wrap with try/catch: on error, return null
    - Update the homepage to use the server wrapper
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 6.3 Convert CompanyShowcase to fetch from database
    - Update `src/components/public/CompanyShowcase.tsx` (already Server Component, no "use client")
    - Import `prisma` from `@/lib/db`
    - Query active companies: name, slug, description, rating, isVerified
    - Map to `CompanyCard` props: use `_count.bookings` or omit reviewCount if not available
    - Remove hardcoded `COMPANIES` array
    - Wrap with try/catch: on error, return null
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 6.4 Convert FAQPreview to fetch from database
    - Create `src/components/public/FAQPreviewServer.tsx` as async Server Component
    - Query active FAQs ordered by sortOrder, take 4
    - Pass fetched FAQ data as props to `FAQPreview` client component
    - Update `FAQPreview.tsx` to accept `faqs` prop (array of {question, answer})
    - Remove hardcoded `FAQ_EN` and `FAQ_ID` arrays (database stores single-language content)
    - Wrap with try/catch: on error, return null
    - Update the homepage to use the server wrapper
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 7. Checkpoint - Verify public pages
  - Ensure `next build` passes
  - Ensure all public pages render with seeded data
  - Ask the user if questions arise

- [x] 8. Admin pages: Dashboard with API data
  - [x] 8.1 Convert src/app/admin/page.tsx to Client Component with API fetch
    - Add `"use client"` directive
    - Add state: `data` (dashboard response), `loading`, `error`
    - Fetch from `/api/admin/dashboard` on mount using `useEffect`
    - Map API response to stat cards: `totalBookings`, `pendingBookings`, `todayDepartures`, `totalRevenue`
    - Map `recentBookings` array to the bookings table
    - Remove hardcoded `RECENT_BOOKINGS` array and static stat values
    - Show `Skeleton` cards + skeleton table while loading
    - Show `ErrorState` with retry on error
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Admin pages: Bookings with API data and filters
  - [x] 9.1 Convert src/app/admin/bookings/page.tsx to fetch from API
    - Add state: `bookings`, `pagination`, `loading`, `error`, `filters` (status, payment, search, page)
    - Fetch from `/api/admin/bookings` with query params built from filter state
    - Wire filter selects (`onChange` → update filter state → re-fetch)
    - Wire search input (debounced onChange → update search → re-fetch)
    - Implement pagination: update page in filter state, re-fetch
    - Remove hardcoded `BOOKINGS` array
    - Show skeleton table while loading, ErrorState on error
    - Display pagination info from API response (`pagination.total`, `pagination.totalPages`)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 10. Admin pages: Routes, Locations, Companies, Schedules with API data
  - [x] 10.1 Convert src/app/admin/routes/page.tsx to fetch from API
    - Add state: `routes`, `loading`, `error`
    - Fetch from `/api/admin/routes` on mount
    - Map API response `routes` array to table rows (title, slug, transferType, estimatedDuration, isActive)
    - Remove hardcoded `ROUTES` array
    - Show skeleton table while loading, ErrorState on error
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.2 Convert src/app/admin/locations/page.tsx to fetch from API
    - Add state: `locations`, `loading`, `error`
    - Fetch from `/api/admin/locations` on mount
    - Map API response `locations` array to table rows (name, slug, type, region, isActive)
    - Remove hardcoded `LOCATIONS` array
    - Show skeleton table while loading, ErrorState on error
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 10.3 Convert src/app/admin/companies/page.tsx to fetch from API
    - Add state: `companies`, `loading`, `error`
    - Fetch from `/api/admin/companies` on mount
    - Map API response `companies` array to company cards (name, contactEmail, rating, isVerified, isActive)
    - Remove hardcoded `COMPANIES` array
    - Show skeleton cards while loading, ErrorState on error
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 10.4 Convert src/app/admin/schedules/page.tsx to fetch from API
    - Add state: `schedules`, `loading`, `error`
    - Fetch from `/api/admin/schedules` on mount
    - Map API response: operator = `service.company.name`, route = `service.route.title`, departureTime, arrivalTime, isAvailable
    - Remove hardcoded `SCHEDULES` array
    - Show skeleton table while loading, ErrorState on error
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 11. Checkpoint - Verify admin pages
  - Ensure `next build` passes
  - Ensure all admin pages load data from API with seeded database
  - Ask the user if questions arise

- [x] 12. Add loading states for remaining pages
  - [x] 12.1 Add loading.tsx for homepage (or ensure homepage Server Components show loading)
    - Since homepage sections are individual Server Components wrapped in Suspense-like patterns, each server wrapper should handle its own loading gracefully (returns null on slow load rather than blocking)
    - If needed, add `src/app/(public)/loading.tsx` with skeleton for the full homepage layout
    - _Requirements: 15.1, 15.3_

  - [x] 12.2 Ensure admin page skeletons match final layout dimensions
    - Verify skeleton cards in admin dashboard match the 4-column stat card grid
    - Verify skeleton tables in bookings/routes/locations/schedules match column count and row height
    - Adjust skeleton `className` dimensions if needed to reduce layout shift
    - _Requirements: 15.2, 15.3_

- [x] 13. Final checkpoint
  - Run `next build` to verify no type errors or build failures
  - Verify seed script runs cleanly: `npx tsx prisma/seed.ts`
  - Ensure all pages work end-to-end with database data
  - Ask the user if questions arise

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3"] },
    { "wave": 2, "tasks": ["4"] },
    { "wave": 3, "tasks": ["5", "6"] },
    { "wave": 4, "tasks": ["7"] },
    { "wave": 5, "tasks": ["8", "9", "10"] },
    { "wave": 6, "tasks": ["11"] },
    { "wave": 7, "tasks": ["12"] },
    { "wave": 8, "tasks": ["13"] }
  ]
}
```

## Notes

- All existing API endpoints (`/api/admin/*`, `/api/routes`, `/api/locations`, `/api/faqs`) already use real Prisma queries — no changes needed there
- The existing `Skeleton` and `ErrorState` UI components are reused throughout
- No property-based tests are included since this feature is CRUD data fetching and infrastructure wiring
- Each task produces a working increment that can be verified with `next build`
- Tasks are ordered to establish the foundation (seed, auth) first, then build up data display incrementally
