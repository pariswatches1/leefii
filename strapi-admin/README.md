# Leefii Admin Panel

A custom admin panel for managing Leefii.com content. Built with Next.js 14, Prisma, and Tailwind CSS.

## Features

- **Dashboard** - Overview of all content with stats and recent activity
- **Strains** - Full CRUD for cannabis strains with terpene profiles
- **Dispensaries** - Manage dispensary listings
- **News** - Manage news articles
- **Deals** - Manage deals and promotions
- **Blog** - Manage blog posts
- **Users** - Manage user accounts
- **Sellers** - Manage seller profiles and applications
- **Reviews** - Moderate user reviews

## Getting Started

### Prerequisites

- Node.js 18+
- Access to the same PostgreSQL database as the main Leefii app

### Installation

1. Navigate to the admin folder:
   ```bash
   cd strapi-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your settings:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   ADMIN_JWT_SECRET="generate-a-secure-secret"
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3001](http://localhost:3001)

### First Time Setup

1. Navigate to `/setup` to create your first admin account
2. After creating an admin, the setup endpoint is automatically disabled
3. Log in at `/login` with your credentials

## Deployment

### Deploy to Vercel

1. Create a new Vercel project
2. Set the root directory to `strapi-admin`
3. Add environment variables:
   - `DATABASE_URL` - Same as your main app
   - `ADMIN_JWT_SECRET` - A secure random string

4. Deploy!

### Custom Domain

Set up a custom domain like `admin.leefii.com` in your Vercel project settings.

## Security Notes

- The admin panel uses JWT tokens stored in HTTP-only cookies
- All API routes require authentication
- The `/setup` endpoint only works if no admin users exist
- Passwords are hashed with bcrypt (12 rounds)

## Project Structure

```
strapi-admin/
├── prisma/
│   └── schema.prisma      # Shared Prisma schema
├── src/
│   ├── app/
│   │   ├── (admin)/       # Protected admin routes
│   │   │   ├── dashboard/
│   │   │   ├── strains/
│   │   │   ├── dispensaries/
│   │   │   └── ...
│   │   ├── api/           # API routes
│   │   ├── login/
│   │   └── setup/
│   ├── components/
│   │   ├── ui/            # Shadcn UI components
│   │   └── ...
│   └── lib/
│       ├── auth.ts        # Authentication logic
│       ├── prisma.ts      # Prisma client
│       └── utils.ts       # Utility functions
└── ...
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_JWT_SECRET` | Secret for signing JWT tokens |
| `NEXT_PUBLIC_ADMIN_URL` | Public URL of the admin panel |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI / Radix UI
- **Authentication**: Custom JWT-based auth
- **Icons**: Lucide React

## Support

This admin panel connects to your existing Leefii database and does not require any database migrations.
