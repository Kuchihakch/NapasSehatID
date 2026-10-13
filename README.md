# NapasSehat Palembang

**Platform Mitigasi dan Screening Risiko Kesehatan Digital akibat Kabut Asap Karhutla**

> Authored by [@kuchiha](https://github.com/kuchiha)

---

## Background

Palembang, the capital of South Sumatra, is annually exposed to **hazardous air quality events** driven by wildfire smoke (*asap karhutla*) originating from peatland fires across Sumatra and Kalimantan. During peak haze seasons, the city's **US AQI routinely exceeds 150–300**, placing residents — especially children, the elderly, and those with pre-existing respiratory conditions — at acute risk of **Infeksi Saluran Pernapasan Akut (ISPA)**.

Access to real-time environmental data and clinical risk assessment tools remains fragmented and inaccessible to the general public. **NapasSehat** closes this gap by combining a live air-quality dashboard with a rule-based medical screening engine in a single, zero-friction web application.

---

## Strategic Alignment — UN Sustainable Development Goals

| Goal | Code | Alignment |
|---|---|---|
| Good Health and Well-Being | **SDG 3** | Free, accessible ISPA risk screening and personalised health recommendations |
| Sustainable Cities and Communities | **SDG 11** | Real-time AQI monitoring enabling safer urban planning and individual decisions |
| Climate Action | **SDG 13** | Raises public awareness of wildfire-driven air pollution as a climate-linked crisis |

---

## Core Features

### Real-Time AQI Dashboard

- Fetches live air-quality data from the **Open-Meteo Air Quality API** (no API key required).
- Displays **US AQI**, **PM2.5 concentration** (μg/m³), **ambient temperature** (°C), and **relative humidity** (%).
- Data is cached with a **10-minute revalidation window** via Next.js ISR to balance freshness and server load.
- The dashboard widget renders as a **Liquid Glass glassmorphism card** overlaying the hero background image.

### Rule-Based ISPA Screening Engine

- A five-question symptom questionnaire feeds a **100-point weighted scoring matrix**.
- The engine resolves a `RiskLevel` enum (`LOW` | `MEDIUM` | `HIGH`) and generates a **personalised recommendation list**.
- All submissions are **persisted to PostgreSQL** via Prisma ORM and retrievable by session ID for result review.
- Input is validated end-to-end with **Zod schemas** before any database write occurs.

### GSAP Scroll-Driven Animations

- **Hero entrance**: word-by-word headline slide-up, badge fade, card slide-in from the right.
- **Feature grid**: staggered card reveal on scroll entry, reversed on scroll exit.
- **SDG cluster**: three logos animate from asymmetric XY offsets into a triangular formation on viewport entry.
- All `ScrollTrigger` instances use `toggleActions: 'play reverse play reverse'` for **bidirectional animation** on repeated scroll passes.

---

## Scoring Matrix — Rule-Based Expert Engine

The screening service calculates a cumulative integer score (0–100) by summing the weights of affirmed symptoms.

| Symptom Field | Weight | Clinical Rationale |
|---|---|---|
| `hasShortnessOfBreath` | **30 pts** | Primary severe respiratory indicator |
| `hasChronicCough` | **25 pts** | Strong ISPA confirmation signal |
| `hasPreExistingCondition` | **25 pts** | Comorbidity risk multiplier |
| `hasSoreThroat` | **10 pts** | Mild upper-respiratory exposure marker |
| `hasIrritatedEyes` | **10 pts** | Direct air-quality exposure marker |
| **Maximum total** | **100 pts** | |

### Risk Threshold Logic

```
score  0 – 20   →  LOW     (monitor, environmental precautions)
score 21 – 55   →  MEDIUM  (mask use, symptom tracking, consult if worsening)
score 56 – 100  →  HIGH    (immediate clinical consultation recommended)
```

The recommendation list is dynamically composed based on both the resolved `RiskLevel` and individual symptom flags (e.g., an additional eye-protection item is appended when `hasIrritatedEyes` is `true`).

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | **Next.js App Router** | 16.4.0 |
| Language | **TypeScript** | ^5 |
| Styling | **Tailwind CSS v4** | ^4 |
| Component primitives | **Shadcn UI** (Radix-based) | — |
| Animation | **GSAP + ScrollTrigger** | ^3.12.7 |
| ORM | **Prisma v7** | ^7.9.1 |
| DB adapter | **@prisma/adapter-pg** (pg-pool) | ^7.10.0 |
| Schema validation | **Zod** | ^3.24.1 |
| Database | **PostgreSQL 14.22-trixie** (Docker) | 14.22 |
| Icons | **lucide-react** | ^0.469.0 |
| External API | **Open-Meteo** (no key required) | — |

---

## Architecture & Conventions

### Directory Structure

```
napas-sehat/
├── prisma/
│   ├── schema.prisma          # Prisma data model definitions
│   ├── global-prisma.ts       # Singleton PrismaClient export
│   └── migrations/            # Versioned migration history
├── public/
│   ├── hero-bg.jpg            # Hero section background image
│   ├── footer-bg.jpg          # Pre-footer / newsletter background
│   ├── sdg-3.png              # SDG 3 logo asset
│   ├── sdg-11.png             # SDG 11 logo asset
│   └── sdg-13.png             # SDG 13 logo asset
└── src/
    ├── app/
    │   ├── layout.tsx         # Root layout (Navbar, Footer, fonts)
    │   ├── globals.css        # Tailwind v4 @theme tokens
    │   ├── (home)/
    │   │   ├── page.tsx       # Landing page — async RSC, fetches AQI
    │   │   └── components/
    │   │       ├── hero-section.tsx     # Hero + Liquid Glass AQI card
    │   │       ├── feature-grid.tsx     # Feature cards with GSAP stagger
    │   │       ├── accordion-goals.tsx  # Mission accordion + SDG cluster
    │   │       └── cta-banner.tsx       # Newsletter pre-footer section
    │   ├── screening/
    │   │   ├── page.tsx       # Screening wizard entry
    │   │   └── hasil/
    │   │       └── page.tsx   # Result display page
    │   ├── kontak/
    │   │   └── page.tsx       # Contact page
    │   └── actions/           # Next.js Server Actions
    ├── components/
    │   ├── navbar.tsx         # Sticky header with mobile drawer
    │   ├── footer.tsx         # Dark 5-column nav footer
    │   └── ui/                # Shadcn UI primitives (accordion, button…)
    └── lib/                   # Domain modules (isolated, testable)
        ├── air-quality/
        │   ├── air-quality-module.ts    # Factory: wires Repo -> Service
        │   ├── dto/                     # Zod schemas + TypeScript types
        │   ├── repo/                    # Database access layer
        │   └── services/               # Business logic (Open-Meteo fetch)
        └── screening/
            ├── screening-module.ts      # Factory: wires Repo -> Service
            ├── dto/                     # Zod schemas + TypeScript types
            ├── repo/                    # PostgreSQL CRUD via Prisma
            └── services/               # Scoring engine + recommendation logic
```

### Domain Module Pattern

Each domain inside `src/lib/` follows a strict three-layer architecture:

```
dto/          Zod schema definitions and inferred TypeScript types
repo/         Database access — all raw queries isolated here
services/     Pure business logic — depends only on the repo interface
*-module.ts   Factory function that wires layers together and exports the service
```

The factory pattern (`CreateAirQualityModule()`, `CreateScreeningModule()`) allows **lazy instantiation** per request in Server Components without relying on a global singleton beyond the Prisma client, and keeps each layer independently testable.

---

## Local Development Setup

### Prerequisites

- **Node.js** >= 20
- **Docker** and **Docker Compose** (v2)
- **Git**

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/kuchiha/napas-sehat.git
cd napas-sehat
```

---

### Step 2 — Install dependencies

```bash
npm install
```

---

### Step 3 — Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

The `.env` file uses the following variables:

```env
# PostgreSQL credentials
POSTGRES_USER=napassehat
POSTGRES_PASSWORD=napassehat_secret
POSTGRES_DB=napassehat_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Prisma connection URL (assembled from the vars above)
DATABASE_URL=postgresql://napassehat:napassehat_secret@localhost:5432/napassehat_db?schema=public

# Application base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Open-Meteo — public API, no key required
OPEN_METEO_BASE_URL=https://air-quality-api.open-meteo.com/v1
OPEN_METEO_WEATHER_URL=https://api.open-meteo.com/v1
```

---

### Step 4 — Start the PostgreSQL Docker container

```bash
docker compose up -d
```

This starts the `napassehat_postgres` container using the `postgres:14.22-trixie` image. Verify it is healthy:

```bash
docker compose ps
```

---

### Step 5 — Push the Prisma schema to the database

```bash
npm run db:push
```

This synchronises `prisma/schema.prisma` with the running PostgreSQL instance without creating a migration file. For production environments use the migration workflow instead:

```bash
npm run db:migrate
```

---

### Step 6 — Start the development server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**.

---

### Additional Database Scripts

| Script | Command | Purpose |
|---|---|---|
| Push schema (no migration) | `npm run db:push` | Sync schema in development |
| Create and apply migration | `npm run db:migrate` | Versioned schema change |
| Open Prisma Studio | `npm run db:studio` | Visual database browser |
| Regenerate Prisma client | `npm run db:generate` | After manual schema edits |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Full PostgreSQL connection string for Prisma |
| `POSTGRES_USER` | Yes | PostgreSQL superuser name (used by Docker) |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password (used by Docker) |
| `POSTGRES_DB` | Yes | Database name (used by Docker) |
| `POSTGRES_HOST` | Yes | Database host (`localhost` for Docker) |
| `POSTGRES_PORT` | Yes | Database port (default `5432`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL for the application |
| `OPEN_METEO_BASE_URL` | Yes | Open-Meteo Air Quality API base URL |
| `OPEN_METEO_WEATHER_URL` | Yes | Open-Meteo Weather API base URL |

---

## License

This project is developed for academic and public-interest purposes. All rights reserved by the author.

---

*NapasSehat Palembang — because clean air is a right, not a privilege.*
