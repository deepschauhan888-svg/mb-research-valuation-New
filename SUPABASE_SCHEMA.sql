-- ============================================================
-- MB Research Valuation — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Valuations table
CREATE TABLE IF NOT EXISTS public.valuations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name       TEXT NOT NULL,
  developer_name      TEXT,
  city                TEXT NOT NULL,
  property_type       TEXT CHECK (property_type IN ('Residential','Commercial')) NOT NULL,
  unit_type           TEXT,
  sbua                NUMERIC,
  carpet_area         NUMERIC,
  received_date       DATE,
  sent_date           DATE,
  recommendation_type TEXT CHECK (recommendation_type IN ('Buy','Sell','Investment')) NOT NULL,
  mb_research_value   NUMERIC NOT NULL DEFAULT 0,
  month               TEXT,
  year                INTEGER,
  quarter             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  company        TEXT,
  email          TEXT NOT NULL,
  phone          TEXT,
  city           TEXT,
  property_type  TEXT,
  property_value TEXT,
  requirement    TEXT,
  message        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Analysts table (for auth with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.analyst_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT,
  role       TEXT DEFAULT 'analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_valuations_city   ON public.valuations(city);
CREATE INDEX IF NOT EXISTS idx_valuations_month  ON public.valuations(month, year);
CREATE INDEX IF NOT EXISTS idx_valuations_reco   ON public.valuations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_valuations_type   ON public.valuations(property_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- 5. Row Level Security
ALTER TABLE public.valuations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyst_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access on valuations (homepage KPIs are public)
CREATE POLICY "Public read valuations" ON public.valuations
  FOR SELECT USING (true);

-- Only authenticated analysts can insert/update
CREATE POLICY "Analysts can insert valuations" ON public.valuations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Analysts can update valuations" ON public.valuations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Anyone can submit an enquiry
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read enquiries
CREATE POLICY "Analysts can read enquiries" ON public.enquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER valuations_updated_at
  BEFORE UPDATE ON public.valuations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DONE. Your schema is ready.
-- Next: go to Authentication > Users in Supabase and
--       create analyst accounts, or use the invite link.
-- ============================================================
