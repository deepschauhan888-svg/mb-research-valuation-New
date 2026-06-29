"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Building2, BarChart3, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { computeKPIs, computeCityStats, computeMonthlyData, formatCrore } from "@/lib/analytics";
import KPICards from "@/components/KPICards";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";
import IndiaMap from "@/components/IndiaMap";
import DataTable from "@/components/DataTable";
import WhoWeServe from "@/components/WhoWeServe";
import LeadershipTeam from "@/components/LeadershipTeam";

const SERVICES = [
  { icon: Building2, title: "Residential Valuation",        desc: "Apartments, villas, and plotted developments. RERA-backed comparables, micro-market benchmarking, and independent recommendations.", tag: "Core Service" },
  { icon: TrendingUp, title: "Commercial Valuation",         desc: "Grade A offices, retail, and industrial assets. Income capitalisation, DCF analysis, and yield-based approaches.", tag: "Institutional" },
  { icon: BarChart3,  title: "Investment Recommendations",   desc: "Buy, Sell, or Hold guidance derived purely from research data — not relationships, and never from the conclusion you expect.", tag: "Advisory" },
];

const STATS = [
  { num: "248+",        label: "Valuations Completed" },
  { num: "₹4,820 Cr",  label: "Portfolio Value Assessed" },
  { num: "10",          label: "Cities Covered" },
  { num: "Independent", label: "Research Standard" },
];

const VALUE_PROPS = [
  { icon: "🏠", text: "Residential & Commercial Valuation" },
  { icon: "📊", text: "Investment Recommendations (Buy / Sell / Hold)" },
  { icon: "🔬", text: "Research-Driven Real Estate Intelligence" },
];

export default function HomePage() {
  const valuations = useStore(s => s.valuations);
  const kpi        = useMemo(() => computeKPIs(valuations), [valuations]);
  const cityStats  = useMemo(() => computeCityStats(valuations), [valuations]);
  const monthly    = useMemo(() => computeMonthlyData(valuations), [valuations]);

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── HERO ── */}
      <section style={{ background: "#FFFFFF", padding: "88px 0 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

            <div>
              {/* Eyebrow */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 20, padding: "5px 14px", marginBottom: 28 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", letterSpacing: "0.08em", textTransform: "uppercase" }}>Independent Valuation Research</span>
              </div>

              <h1 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em", color: "#0F172A", marginBottom: 20 }}>
                Real Estate Valuation<br />
                <span style={{ color: "#C8102E" }}>You Can Trust.</span>
              </h1>

              {/* Value proposition bullets — visible within 5 seconds */}
              <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {VALUE_PROPS.map(v => (
                  <div key={v.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{v.icon}</span>
                    <span style={{ fontSize: 15, color: "#374151", fontWeight: 500 }}>{v.text}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#64748B", maxWidth: 440, marginBottom: 36 }}>
                MB Research is an independent real estate intelligence firm trusted by banks, NBFCs, developers, and institutional investors across India.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F172A", color: "#fff", padding: "13px 26px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0F172A"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Request a Valuation <ArrowRight size={16} />
                </Link>
                <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#0F172A", padding: "13px 26px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "transparent"; }}>
                  About MB Research
                </Link>
              </div>
            </div>

            {/* Hero stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "26px 22px", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(15,23,42,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}>
                  <div style={{ fontSize: s.num.length > 6 ? 22 : 30, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
              {/* Credibility badge */}
              <div style={{ gridColumn: "1 / -1", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={20} color="#059669" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>Trusted by banks, NBFCs & institutions</p>
                  <p style={{ fontSize: 12, color: "#047857", marginTop: 2 }}>Independent research with no brokerage conflicts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #C8102E 0%, #E8A0AA 60%, transparent 100%)" }} />

      {/* ── SERVICES ── */}
      <section style={{ background: "#F8FAFC", padding: "88px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>What We Do</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Three services.<br />One standard of excellence.
              </h2>
              <Link href="/about" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", textDecoration: "none" }}>
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="card" style={{ padding: 32, cursor: "default" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                    <div style={{ width: 44, height: 44, background: "#F1F5F9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={20} style={{ color: "#0F172A" }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "3px 10px", borderRadius: 20 }}>{s.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.015em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>
                    <span style={{ width: 20, height: 20, background: "#F1F5F9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{i + 1}</span>
                    Service {i + 1} of 3
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section style={{ background: "#FFFFFF", padding: "88px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>Clientele</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Who We Serve.
              </h2>
              <p style={{ fontSize: 15, color: "#64748B", maxWidth: 400, lineHeight: 1.65 }}>
                From home loans to institutional mandates — MB Research provides independent valuation intelligence across every client category.
              </p>
            </div>
          </div>
          <WhoWeServe />
        </div>
      </section>

      {/* ── INDIA MAP ── */}
      <section style={{ background: "#F8FAFC", padding: "88px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>Coverage</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Active across<br />10 Indian cities.
              </h2>
              <p style={{ fontSize: 15, color: "#64748B", maxWidth: 360, lineHeight: 1.65 }}>
                Click any city marker to explore valuation statistics, portfolio values, and recommendation breakdowns for that market.
              </p>
            </div>
          </div>
          <IndiaMap cityStats={cityStats} />
        </div>
      </section>

      {/* ── LIVE INTELLIGENCE ── */}
      <section style={{ background: "#FFFFFF", padding: "88px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>Live Intelligence</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Real-time portfolio<br />intelligence dashboard.
              </h2>
              <Link href="/monthly-summary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", textDecoration: "none" }}>
                View monthly report <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <KPICards data={kpi} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 20 }}>
            <MonthlyTrendChart monthly={monthly} />
            <RecommendationChart buy={kpi.buy_count} sell={kpi.sell_count} investment={kpi.investment_count} />
            <PropertySplitChart residential={kpi.residential_count} commercial={kpi.commercial_count} />
          </div>
          <div style={{ marginTop: 20 }}>
            <DataTable valuations={[...valuations].reverse()} limit={6} />
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section style={{ background: "#F8FAFC", padding: "88px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>Our Team</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Leadership Team.
              </h2>
              <p style={{ fontSize: 15, color: "#64748B", maxWidth: 360, lineHeight: 1.65 }}>
                A senior team with deep expertise across real estate research, valuation methodology, and market intelligence.
              </p>
            </div>
          </div>
          <LeadershipTeam />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#0F172A", padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 28 }}>
          <div>
            <h2 style={{ fontSize: "clamp(24px, 2.8vw, 38px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.025em", marginBottom: 10 }}>
              Commission an independent valuation.
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.6 }}>We respond to all enquiries within 24 hours · Mon–Sat · 9 AM – 7 PM IST</p>
          </div>
          <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "15px 30px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#A50D26"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
