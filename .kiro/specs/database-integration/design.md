# Design Document: Database Integration

## Overview

This feature replaces all hardcoded mock data across public and admin pages with real data from the PostgreSQL database via Prisma ORM. It also activates middleware authentication, removes mock auth fallback, updates the database seed script, and adds proper loading/error states.

**Architecture approach:**
- **Public pages** → Server Components with direct Prisma calls (no API hop, best performance)
- **Admin pages** → Client Components with `fetch()` to existing `/api/admin/*` endpoints (interactive with filters/search)
- **Authentication** → NextAuth `auth()` in middleware with JWT session strategy

## Architecture

```mermaid
graph TB
    subgraph Public Pages - Server Components
        RP[Routes Page]
        PR[PopularRoutes]
        PD[PopularDestinations]
        CS[CompanyShowcase]
        FP[FAQPreview]
    end

    subgraph Admin Pages - Client Components
        AD[Admin Dashboard]
        AB[Admin Bookings]
        AR[Admin Routes]
        AL[Admin Locations]
        AC[Admin Companies]
        AS[Admin Schedules]
    end

    subgraph Data Layer
        DB[(PostgreSQL)]
        PC[Prisma Client]
        API["/api/admin/* endpoints"]
    end

    subgraph Auth Layer
        MW[Middleware]
        NA[NextAuth - auth()]
    end

    RP --> PC
    PR --> PC
    PD --> PC
    CS --> PC
    FP --> PC
    PC --> DB

    AD --> API
    AB --> API
    AR --> API
    AL --> API
    AC --> API
    AS --> API
    API --> PC

    MW --> NA
    NA --> DB
```

## Components and Interfaces

### Public Pages (Server Components with direct Prisma)

#### 1. Routes Page (`src/app/(public)/routes/page.tsx`)
- Convert to async Server Component
- Query: `prisma.route.findMany({ where: { isActive: true }, include: { fromLocation, toLocation, services } })`
- Map database fields to existing `RouteCard` props
- Compute `priceFrom` from minimum service `basePrice`

#### 2. PopularRoutes (`src/components/public/PopularRoutes.tsx`)
- Split into wrapper Server Component that fetches data + Client Component for interactivity
- Create `PopularRoutesServer.tsx` that fetches top 5 routes (by booking count or explicit flag)
- Pass data as props to existing `PopularRoutes` client component (renamed to accept props)
- Query: `prisma.route.findMany({ where: { isActive: true }, include: { fromLocation, toLocation, services }, take: 5 })`

#### 3. PopularDestinations (`src/components/public/PopularDestinations.tsx`)
- Split: Server wrapper fetches locations, client component renders
- Query: `prisma.location.findMany({ where: { isActive: true, type: { in: ['island', 'city', 'harbor'] } }, take: 6 })`

#### 4. CompanyShowcase (`src/components/public/CompanyShowcase.tsx`)
- Already a Server Component (no "use client"), just replace mock data with Prisma query
- Query: `prisma.company.findMany({ where: { isActive: true } })`

#### 5. FAQPreview (`src/components/public/FAQPreview.tsx`)
- Split: Server wrapper fetches FAQs, pass to client accordion component
- Query: `prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 4 })`

### Admin Pages (Client Components with fetch)

All admin pages follow the same pattern:
1. Keep `"use client"` directive
2. Add state: `data`, `loading`, `error`
3. Use `useEffect` + `fetch('/api/admin/...')` to load data
4. Show `Skeleton` while loading, `ErrorState` on failure
5. Render data table/cards on success

#### 6. Admin Dashboard (`src/app/admin/page.tsx`)
- Fetch from `/api/admin/dashboard`
- Display stats cards + recent bookings table from API response

#### 7. Admin Bookings (`src/app/admin/bookings/page.tsx`)
- Fetch from `/api/admin/bookings?status=&payment=&search=&page=&limit=`
- Wire filter selects and search input to re-fetch with query params
- Implement pagination using API's `pagination` response

#### 8. Admin Routes (`src/app/admin/routes/page.tsx`)
- Fetch from `/api/admin/routes`
- Display routes table with data from API

#### 9. Admin Locations (`src/app/admin/locations/page.tsx`)
- Fetch from `/api/admin/locations`
- Display locations table with data from API

#### 10. Admin Companies (`src/app/admin/companies/page.tsx`)
- Fetch from `/api/admin/companies`
- Display company cards with data from API

#### 11. Admin Schedules (`src/app/admin/schedules/page.tsx`)
- Fetch from `/api/admin/schedules`
- Display schedules table with data from API

### Middleware Authentication (`src/middleware.ts`)

- Import `auth` from `@/lib/auth-config`
- Use NextAuth's `auth()` wrapper for the middleware function
- Check `auth` result for valid session
- Admin routes: redirect to `/admin/login` if no session
- Company routes: redirect to `/company/login` if no session
- API admin routes: return 401 JSON if no session

### Auth Config Cleanup (`src/lib/auth-config.ts`)

- Remove the mock fallback credentials block (lines with "admin@rinjanitransport.com" and "operator@gilispeedboat.com" hardcoded)
- Remove the try/catch that falls back to mock auth
- Keep only the database authentication path
- If database query fails, return error (no fallback)

### Database Seed (`prisma/seed.ts`)

- Current seed already uses `upsert` for users, locations, companies, routes
- Fix: services and schedules use `create` which fails on re-run (duplicate data)
- Change services to upsert (using a composite unique or check-then-create pattern)
- Change schedules to delete-then-recreate pattern (no natural unique key)
- FAQs: change to upsert by question or delete-then-recreate

## Data Models

The existing Prisma schema already defines all models needed. Key mappings from mock data to database:

| Mock Field | Database Source |
|---|---|
| Route `title` | `route.title` |
| Route `from` | `route.fromLocation.name` |
| Route `to` | `route.toLocation.name` |
| Route `duration` | `route.estimatedDuration` |
| Route `priceFrom` | `MIN(route.services.basePrice)` |
| Route `transferType` | `route.transferType` |
| Route `currency` | `route.services[0].currency` (default EUR) |
| Route `href` | `/routes/${route.slug}` |
| Company `rating` | `company.rating` |
| Company `reviewCount` | Not in schema — use `company._count.bookings` or add field |
| FAQ `q` / `a` | `faq.question` / `faq.answer` |

**Note:** The `Company` model has `rating` but no `reviewCount` field. We'll use `_count.bookings` as a proxy, or display no review count.

## Error Handling

### Server Components (Public Pages)
- Use Next.js `error.tsx` boundary convention in `src/app/(public)/routes/error.tsx`
- Each component catches errors with try/catch and renders inline `ErrorState`
- Errors in one homepage section don't crash the entire page (isolation)

### Client Components (Admin Pages)
- Each page manages its own error state via `useState`
- On fetch failure, display `ErrorState` component with retry button
- `onRetry` re-triggers the fetch function

### Loading States
- Server Components: `loading.tsx` files with Skeleton layouts
- Client Components: inline skeleton rendering while `loading === true`
- Use existing `Skeleton` component (`src/components/ui/Skeleton.tsx`)

## Testing Strategy

**Property-based testing is NOT applicable** for this feature because:
- This is primarily CRUD data fetching — replacing hardcoded data with database queries
- The behavior doesn't vary meaningfully with random input generation
- We're testing infrastructure wiring (pages → API → database), not pure business logic
- The acceptance criteria are mostly "data displays correctly from database" which is best verified with integration tests

**Recommended testing approach:**
- **Manual smoke tests**: Verify each page loads with seeded data
- **Integration tests (optional)**: Test API endpoints return expected shape with seeded database
- **Build verification**: `next build` succeeds without type errors
- **Auth integration test**: Verify middleware redirects unauthenticated requests
