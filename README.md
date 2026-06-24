# MB Research Valuation Platform

Premium real estate valuation intelligence platform built with Next.js 15, Supabase, and Recharts.

## 🚀 Deploy to Vercel (3 steps)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mb-research.git
git push -u origin main
```

### Step 2 — Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → paste contents of `SUPABASE_SCHEMA.sql` → Run
3. Go to **Settings → API** → copy your URL and anon key

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL      = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   SUPABASE_SERVICE_ROLE_KEY     = your-service-role-key
   ```
3. Click **Deploy** ✓

## 📁 Project Structure

```
app/
├── page.tsx                  ← Home (KPIs, charts, India map, table)
├── about/                    ← About MB Research
├── monthly-summary/          ← Monthly MIS reporting
├── enquiry/                  ← Client enquiry form
├── analyst-login/            ← Login page
├── dashboard/                ← Protected analyst dashboard
└── api/
    ├── auth/login/           ← Auth endpoint
    ├── valuations/           ← CRUD valuations
    ├── upload/               ← Excel upload processor
    └── enquiry/              ← Enquiry submission

components/
├── Navbar.tsx
├── Footer.tsx
├── KPICards.tsx
├── IndiaMap.tsx              ← Interactive SVG India map
├── Charts.tsx                ← Recharts components
├── DataTable.tsx
└── UploadExcel.tsx

lib/
├── supabase.ts               ← Supabase client
├── analytics.ts              ← KPI & stats computation
├── excelParser.ts            ← XLSX → Valuation[] parser
└── store.ts                  ← Zustand global state + demo data
```

## 🔐 Demo Login
- Email: `analyst@mbresearch.in`
- Password: `mbresearch2025`

## 📊 Excel Upload Format
| Column | Required | Values |
|--------|----------|--------|
| Property Name | ✓ | Text |
| Developer Name | | Text |
| City | ✓ | Text |
| Property Type | ✓ | Residential / Commercial |
| Unit Type | | Text |
| SBUA | | Number (sq ft) |
| Carpet Area | | Number (sq ft) |
| Received Date | | DD/MM/YYYY |
| Sent Date | | DD/MM/YYYY |
| Recommendation Type | ✓ | Buy / Sell / Investment |
| MB Research Value | ✓ | Number (INR) |
| Month | | January…December |
| Year | | 2024, 2025… |
| Quarter | | Q1, Q2, Q3, Q4 |
