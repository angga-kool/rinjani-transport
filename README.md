# Rinjani Transport — Lombok & Gili Islands Transfer Booking

A full-stack travel transfer booking platform built with Next.js 16, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- 🚤 Search & book speed boat, private car, and shared transfers
- 🌐 Multi-language (10 languages) & multi-currency (7 currencies)
- 💳 Multiple payment methods (QRIS, PayPal, Credit Card, USDT, Bank Transfer)
- 📧 Instant e-ticket via email
- 🏝️ 12+ destinations, 18+ routes, 4 verified operators
- 👨‍💼 Admin panel for managing routes, bookings, and operators
- 🚀 Company/operator panel for managing schedules

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 (Credentials)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
cd transport-rinjani
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Your app URL

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed sample data
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Deploy to Vercel

### 1. Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (Region: Singapore)
3. Copy the connection string

### 2. Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Git Repository
3. Set environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `NEXTAUTH_SECRET` = `openssl rand -base64 32`
   - `NEXTAUTH_URL` = `https://your-project.vercel.app`
4. Deploy

### 3. Post-Deploy

```bash
# Push schema to production database
npx prisma db push

# Seed production data
npm run db:seed
```

## Login Credentials (Dev)

- **Admin:** admin@rinjanitransport.com / admin123
- **Operator:** operator@gilispeedboat.com / operator123

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (routes, destinations, booking, etc.)
│   ├── admin/             # Admin panel
│   ├── company/           # Operator panel
│   └── api/               # API routes
├── components/
│   ├── public/            # Public UI components
│   ├── booking/           # Booking flow components
│   ├── admin/             # Admin components
│   └── ui/                # Shared UI components
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth-config.ts     # NextAuth configuration
│   ├── password.ts        # PBKDF2 password hashing
│   ├── rate-limit.ts      # Rate limiting
│   ├── validations.ts     # Zod schemas
│   ├── booking-store.ts   # Client-side booking state
│   └── actions/           # Server actions (admin, booking)
├── providers/             # React context providers
└── messages/              # i18n translations (10 languages)
```

## License

Private — Rinjani Transport
