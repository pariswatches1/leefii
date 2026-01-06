# 🌿 Leefii - Cannabis Dispensary Directory

A modern, fast, SEO-optimized cannabis dispensary directory built with Next.js 14, PostgreSQL, and Prisma.

## Features

- ⚡ **Fast** - Sub-2-second page loads
- 📱 **Mobile-First** - Designed for phones
- 🔍 **SEO Optimized** - City pages, schema markup, meta tags
- 📍 **67+ Real Dispensaries** - Verified data with real phone numbers
- 🗺️ **Browse by State & City** - Easy navigation
- 📞 **Click-to-Call** - One tap to call any dispensary
- 📊 **Analytics** - Track calls, directions, page views

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Hosting**: DigitalOcean App Platform

---

# 🚀 DEPLOYMENT GUIDE

## Step 1: Create Database on DigitalOcean

1. Go to https://cloud.digitalocean.com/databases
2. Click **"Create Database Cluster"**
3. Choose:
   - **Engine**: PostgreSQL (version 16)
   - **Datacenter**: New York (or closest to you)
   - **Plan**: Basic ($15/month)
   - **Name**: `leefii-db`
4. Click **Create Database Cluster**
5. Wait 3-5 minutes for it to be ready

### Get Your Database Connection String:

1. Click on your new database
2. Go to **"Connection Details"**
3. Select **"Connection String"** from dropdown
4. Copy the full connection string (starts with `postgresql://`)
5. **Save this - you'll need it!**

---

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `leefii`
3. Make it **Public** or **Private**
4. **Don't** initialize with README (we have our own)
5. Click **Create Repository**

### Push Code to GitHub:

```bash
# Unzip the leefii-final.zip file first
cd leefii-final

# Initialize git
git init
git add .
git commit -m "Initial Leefii setup"

# Add your GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/leefii.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **GitHub** as source
4. Authorize DigitalOcean to access your GitHub
5. Select your `leefii` repository
6. Select `main` branch

### Configure Build Settings:

- **Source Directory**: `/` (root)
- **Build Command**: `npm run build`
- **Run Command**: `npm start`

### Add Environment Variables:

Click **"Edit"** next to Environment Variables and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string from Step 1 |
| `NODE_ENV` | `production` |

### Resources:

- **Plan**: Basic ($5/month)
- **Instance Size**: 1 GB RAM / 1 vCPU

### Click "Create Resources"

Wait 5-10 minutes for deployment.

---

## Step 4: Run Database Setup

After the app is deployed, you need to set up the database tables and seed data.

### Option A: Using DigitalOcean Console

1. Go to your App in DigitalOcean
2. Click **"Console"** tab
3. Run these commands:

```bash
npx prisma db push
node prisma/seed.js
```

### Option B: Using Local Terminal

1. Create a `.env` file locally with your DATABASE_URL
2. Run:

```bash
npm install
npx prisma db push
node prisma/seed.js
```

---

## Step 5: Connect Your Domain

1. In DigitalOcean App Platform, go to **Settings**
2. Click **Domains**
3. Click **Add Domain**
4. Enter: `leefii.com`
5. Follow the DNS instructions:
   - Add a CNAME record pointing to your app URL
   - Or add an A record to DigitalOcean's IP

### DNS Settings (at your domain registrar):

| Type | Host | Value |
|------|------|-------|
| CNAME | @ | your-app-xxxxx.ondigitalocean.app |
| CNAME | www | your-app-xxxxx.ondigitalocean.app |

Wait 15-30 minutes for DNS to propagate.

---

## Step 6: Verify Everything Works

Visit your site and check:

- [ ] Homepage loads
- [ ] Browse states works
- [ ] City pages show dispensaries
- [ ] Dispensary profiles load
- [ ] Click-to-call works
- [ ] Directions links work
- [ ] Search works

---

# 📊 Summary of Costs

| Service | Cost |
|---------|------|
| DigitalOcean Database | $15/month |
| DigitalOcean App Platform | $5/month |
| Domain (leefii.com) | ~$12/year |
| **Total** | **~$20/month** |

---

# 🔧 Development

### Run Locally:

```bash
# Install dependencies
npm install

# Create .env file with DATABASE_URL
cp .env.example .env
# Edit .env with your database URL

# Push database schema
npx prisma db push

# Seed database
node prisma/seed.js

# Start dev server
npm run dev
```

Open http://localhost:3000

### Database Commands:

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset
node prisma/seed.js

# Generate Prisma client
npx prisma generate
```

---

# 📁 Project Structure

```
leefii/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Seed data (67 dispensaries)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Styles
│   │   ├── dispensaries/
│   │   │   ├── page.tsx                # Browse all states
│   │   │   ├── [state]/
│   │   │   │   ├── page.tsx            # State page
│   │   │   │   └── [city]/
│   │   │   │       └── page.tsx        # City page
│   │   ├── dispensary/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Dispensary profile
│   │   ├── search/
│   │   │   └── page.tsx                # Search page
│   │   └── api/
│   │       └── track/
│   │           └── route.ts            # Analytics API
│   └── lib/
│       └── prisma.ts                   # Database client
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

# 🎯 Next Steps After Launch

1. **Add more dispensaries** - Update `prisma/seed.js` and re-run
2. **Submit to Google Search Console** - Get indexed faster
3. **Add Google Analytics** - Track real traffic
4. **Create sitemap** - Help SEO
5. **Add more cities** - Expand coverage

---

# ❓ Troubleshooting

### "Database connection failed"
- Check your DATABASE_URL is correct
- Make sure the database is running
- Verify SSL mode is set (`?sslmode=require`)

### "Build failed"
- Check Node.js version is 18+
- Run `npm install` again
- Clear `.next` folder and rebuild

### "Page not found"
- Run `npx prisma db push` to create tables
- Run `node prisma/seed.js` to add data

### "502 Bad Gateway"
- Check app logs in DigitalOcean console
- Verify environment variables are set
- Restart the app

---

# 📞 Support

If you have issues, check:
1. DigitalOcean App logs
2. Database connection status
3. Environment variables

---

Built with ❤️ for the cannabis community.
