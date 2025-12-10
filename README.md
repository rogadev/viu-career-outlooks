# VIU Career Outlooks

A web application for exploring Vancouver Island University (VIU) credentials and their associated career paths with employment outlook data. Users can browse VIU programs, discover related occupations, and view 3-year employment projections across British Columbia's economic regions.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React 19](https://react.dev/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Database:** [Neon PostgreSQL](https://neon.tech/) (serverless Postgres)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Deployment:** [Vercel](https://vercel.com/)

## Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [pnpm](https://pnpm.io/) (recommended) - Install with `npm install -g pnpm`
- A [Neon](https://neon.tech/) PostgreSQL database (or compatible PostgreSQL instance)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/viu-career-outlooks.git
cd viu-career-outlooks
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with your database credentials:

```env
# Neon Database (Pooled connection - for app queries)
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# Neon Database (Direct connection - for Prisma migrations)
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

> **Note:** If using Vercel with Neon integration, you can copy these values from the Neon console or your Vercel project's environment variables.

#### Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | **Pooled** connection string (hostname contains `-pooler`). Used by the app for queries. Better for concurrent connections. |
| `DATABASE_URL_UNPOOLED` | **Direct** connection string (no `-pooler` in hostname). Required by Prisma for migrations and schema changes. |

### 4. Set Up the Database

Generate the Prisma client and run migrations:

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations to create database tables
# Note: Use dotenv-cli to load .env.local for Prisma CLI
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma migrate deploy
```

### 5. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── economic-regions/
│   │   ├── noc/[noc]/
│   │   ├── outlooks/
│   │   ├── preferences/
│   │   ├── programs/[nid]/
│   │   └── top-outlooks/
│   ├── credentials/       # Credentials browsing page
│   ├── noc/[noc]/        # NOC occupation details
│   ├── programs/[nid]/   # Program details page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── credentials/      # Credential-related components
│   ├── global/           # Shared/reusable components
│   ├── home/             # Home page components
│   ├── noc/              # NOC page components
│   ├── programs/         # Program page components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── constants.ts
│   ├── cookies.ts
│   ├── db.ts             # Prisma client instance
│   └── utils.ts
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
│   ├── icons/
│   └── images/
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## Database Schema

The application uses the following data models:

| Model | Description |
|-------|-------------|
| `Program` | VIU academic programs (diplomas, degrees, certificates) |
| `ProgramArea` | Program categories/faculties |
| `UnitGroup` | NOC (National Occupational Classification) occupation codes |
| `Outlook` | Employment outlook data for occupations by region |
| `EconomicRegion` | BC economic regions for employment data |
| `SectionsEntity` | Detailed occupation information sections |

### Prisma Commands

```bash
# Generate Prisma client after schema changes
pnpm prisma generate

# Run migrations (creates/updates database tables)
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma migrate deploy

# Create a new migration
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma migrate dev --name your_migration_name

# Open Prisma Studio (database GUI)
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma studio

# Pull schema from existing database
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma db pull
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production (runs Prisma generate & migrate) |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Jest tests |
| `pnpm test:watch` | Run tests in watch mode |

## Testing

This project uses Jest and React Testing Library for testing. Tests are written in JavaScript to avoid additional dependencies in CI/CD pipelines.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

For more details on writing and running tests, see our [Testing Guidelines](./docs/testing.md).

## Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com/)
2. Add a Neon PostgreSQL database via the Vercel Storage tab
3. Ensure environment variables are configured:
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
4. Deploy!

The build script automatically runs Prisma generate and migrations:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### Manual Deployment

1. Set up environment variables on your hosting platform
2. Run `pnpm build`
3. Run `pnpm start`

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development workflow
- Branch strategy
- Testing requirements
- Code review process

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork
3. Switch to dev branch: `git checkout dev`
4. Create your feature branch: `git checkout -b feature/amazing-feature`
5. Follow our [Contributing Guide](./CONTRIBUTING.md) for next steps

### Workflow Enforcement

This project uses GitHub Actions to enforce our development workflow:

- PRs to `dev` require passing tests and linting
- PRs to `main` require at least one approval and passing tests
- Merging to `main` automatically triggers deployment to production

Always develop in `dev` first and only merge to `main` when ready for production deployment.

## Troubleshooting

### "Environment variable not found: DATABASE_URL_UNPOOLED"

Prisma CLI doesn't automatically read `.env.local`. Use `dotenv-cli`:
```bash
pnpm dlx dotenv-cli -e .env.local -- pnpm prisma migrate deploy
```

### Database connection errors

1. Verify your connection strings in `.env.local`
2. Ensure `DATABASE_URL` uses the pooled connection (`-pooler` in hostname)
3. Ensure `DATABASE_URL_UNPOOLED` uses the direct connection (no `-pooler`)

### Prisma client out of sync

If you see schema mismatch errors, regenerate the Prisma client:
```bash
pnpm prisma generate
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## License

This project is private and proprietary to Vancouver Island University.
