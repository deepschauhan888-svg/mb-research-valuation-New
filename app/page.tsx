"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Building2, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { computeKPIs, computeCityStats, computeMonthlyData, formatCrore } from "@/lib/analytics";
import KPICards from "@/components/KPICards";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";
import IndiaMap from "@/components/IndiaMap";
import DataTable from "@/components/DataTable";

const SERVICES = [
  { icon: Building2, title: "Residential Valuation", desc: "Apartments, villas, and plotted developments across all micro-markets. Sales comparison, RERA data, and area benchmarking.", tag: "Core" },
  { icon: TrendingUp, title: "Commercial Valuation", desc: "Office spaces, retail, and industrial assets. Income capitalisation, DCF analysis, and yield benchmarking.", tag: "Institutional" },
  { icon: BarChart3, title: "Investment Recommendations", desc: "Buy, Sell, or Hold guidance backed by independent research and transparent, documented assumptions.", tag: "Advisory" },
];

const STATS = [
  { num: "248+", label: "Assignments Completed" },
  { num: "₹4,820 Cr", label: "Portfolio Assessed" },
  { num: "10", label: "Cities Covered" },
  { num: "3.2d", label: "Avg Turnaround" },
];

export default function HomePage() {
  const valuations = useStore(s => s.valuations);
  const kpi = useMemo(() => computeKPIs(valuations), [valuations]);
  const cityStats = useMemo(() => computeCityStats(valuations), [valuations]);
  const monthly = useMemo(() => computeMonthlyData(valuations), [valuations]);

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── HERO ── */}
      <section style={{ background: "#FFFFFF", padding: "100px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 20, padding: "6px 14px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#C8102E", letterSpacing: "0.08em" }}>Real Estate Intelligence Platform</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em", color: "#0F172A", marginBottom: 24 }}>
                Valuation
                <br />
                <span style={{ color: "#C8102E" }}>Intelligence</span>
                <br />
                You Can Trust.
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: "#475569", maxWidth: 440, marginBottom: 40 }}>
                MB Research delivers independent, data-driven real estate valuations across India. Trusted by banks, NBFCs, developers, and institutional investors.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/enquiry" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#0F172A", color: "#fff",
                  padding: "14px 28px", borderRadius: 10,
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0F172A"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Request a Valuation <ArrowRight size={16} />
                </Link>
                <Link href="/about" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "#0F172A",
                  padding: "14px 28px", borderRadius: 10, border: "1.5px solid #E2E8F0",
                  fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "transparent"; }}>
                  About MB Research
                </Link>
              </div>
            </div>

            {/* Hero stats card */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {STATS.map(s => (
                <div key={s.label} style={{
                  background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16,
                  padding: "28px 24px", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(15,23,42,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Thin red line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #C8102E 0%, #E8A0AA 50%, transparent 100%)" }} />

      {/* ── SERVICES ── */}
      <section style={{ background: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Our Services</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15, maxWidth: 480 }}>
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
                <div key={s.title} className="card" style={{ padding: 36, cursor: "default" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, background: "#F1F5F9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={20} style={{ color: "#0F172A" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "4px 10px", borderRadius: 20 }}>{s.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.015em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
                  <div style={{ marginTop: 28, height: 1, background: "#F1F5F9" }} />
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#C8102E" }}>
                    <span style={{ width: 20, height: 20, background: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{i + 1}</span>
                    Service {i + 1} of 3
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INDIA MAP SECTION ── */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Coverage</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
                Active across<br />10 Indian cities.
              </h2>
              <p style={{ fontSize: 15, color: "#64748B", maxWidth: 360, lineHeight: 1.7 }}>
                Click any city on the map to explore valuation statistics, portfolio values, and recommendation breakdowns.
              </p>
            </div>
          </div>
          <IndiaMap cityStats={cityStats} />
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ background: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Live Intelligence</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.15 }}>
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

      {/* ── CTA STRIP ── */}
      <section style={{ background: "#0F172A", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.025em", marginBottom: 12 }}>
              Ready to commission a valuation?
            </h2>
            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6 }}>We respond to all enquiries within 24 hours. Mon–Sat · 9 AM – 7 PM IST.</p>
          </div>
          <Link href="/enquiry" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#C8102E", color: "#fff", whiteSpace: "nowrap",
            padding: "16px 32px", borderRadius: 10,
            fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#A50D26"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
