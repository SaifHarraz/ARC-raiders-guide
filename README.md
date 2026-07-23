# ARC Raiders Guide (3rb Community)

An Arabic-first community platform and guide for **ARC Raiders**, built with Next.js. It includes an interactive game database, community tools, and admin features for managing content.
   **Live Demo:**  (https://arc-raiders-guide-delta.vercel.app/)
🔗 **Live site:** [arcraiders.ae](https://arcraiders.ae/)
    

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via [Prisma](https://www.prisma.io/) ORM
- **Auth:** NextAuth
- **Styling:** Tailwind CSS
- **Caching / Rate limiting:** Upstash Redis
- **File / Media storage:** Cloudflare R2
- **Deployment:** Vercel (with Docker + Nginx support for self-hosting)

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- An Upstash Redis instance
- Cloudflare R2 credentials (for file/image storage)

### Environment Variables

Create a `.env` file in the root directory with the required variables for:
- Database connection (`DATABASE_URL`)
- NextAuth secrets/providers
- Upstash Redis credentials
- Cloudflare R2 credentials

> See `prisma/schema.prisma` and the `lib/` directory for the exact env vars each integration expects.

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate deploy
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The page auto-updates as you edit files in `app/`.

## Project Structure

```
app/              # Next.js App Router pages & routes
components/       # Reusable UI components
data/             # Static/game data
data-reshaper/    # Scripts for transforming/normalizing game data
hooks/            # Custom React hooks
lib/              # Core utilities (db, auth, storage, redis clients, etc.)
prisma/           # Prisma schema & migrations
public/           # Static assets
scripts/          # Utility/maintenance scripts
types/            # Shared TypeScript types
```

## Deployment

This project is deployed on **Vercel**, using:
- **Neon** for serverless PostgreSQL
- **Upstash** for Redis
- **Cloudflare R2** for object storage

A `Dockerfile`, `docker-compose.yml`, and `nginx.conf` are also included for self-hosted deployments outside of Vercel.

```bash
# Build for production
npm run build
npm start
```

Or with Docker:

```bash
docker compose up --build
```

## Contributing

This is a community-driven project for the ARC Raiders Egyptian/Arabic community (3rb). Contributions, bug reports, and suggestions are welcome via issues and pull requests.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
