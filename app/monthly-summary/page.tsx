"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { computeMonthlyData, computeKPIs, formatCrore } from "@/lib/analytics";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = [2023, 2024, 2025, 2026];

const RECO: Record<string, string> = {
  Buy:        "bg-emerald",
  Sell:       "bg-red",
  Investment: "bg-amber",
};

export default function MonthlySummaryPage() {
  const valuations = useStore(s => s.valuations);
  const [month, setMonth] = useState("June");
  const [year, setYear] = useState(2025);

  const filtered = useMemo(() => valuations.filter(v => v.month === month && v.year === year), [valuations, month, year]);
  const kpi = useMemo(() => computeKPIs(filtered), [filtered]);
  const monthly = useMemo(() => computeMonthlyData(valuations), [valuations]);

  const selectStyle = {
    background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 10,
    padding: "12px 16px", fontSize: 15, fontWeight: 500, color: "#0F172A",
    outline: "none", cursor: "pointer", minWidth: 160,
  };

  const METRICS = [
    { label: "Total Valuations",           value: kpi.total_valuations,    color: "#0F172A", large: true },
    { label: "Portfolio Value",             value: formatCrore(kpi.portfolio_value), color: "#059669", large: true },
    { label: "Buy Recommendations",         value: kpi.buy_count,           color: "#059669" },
    { label: "Sell Recommendations",        value: kpi.sell_count,          color: "#DC2626" },
    { label: "Investment Recommendations",  value: kpi.investment_count,    color: "#D97706" },
    { label: "Residential Assignments",     value: kpi.residential_count,   color: "#1D4ED8" },
    { label: "Commercial Assignments",      value: kpi.commercial_count,    color: "#7C3AED" },
  ];

  return (
    <div style={{ paddingTop: 68 }}>

      {/* Header */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "60px 0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Analytics</p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", marginBottom: 16 }}>Monthly Summary</h1>
          <p style={{ fontSize: 16, color: "#64748B" }}>Select a period to view detailed valuation statistics and performance breakdown.</p>

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <select value={month} onChange={e => setMonth(e.target.value)} style={selectStyle}
              onFocus={e => e.currentTarget.style.borderColor = "#C8102E"}
              onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))} style={selectStyle}
              onFocus={e => e.currentTarget.style.borderColor = "#C8102E"}
              onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
            <div style={{ padding: "12px 20px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, color: "#64748B" }}>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>{filtered.length}</span> record{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: "80px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📋</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No data for {month} {year}</h3>
            <p style={{ fontSize: 15, color: "#94A3B8" }}>Upload valuation data via the Analyst Dashboard to populate monthly reports.</p>
          </div>
        ) : (
          <>
            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {METRICS.slice(0, 4).map(m => (
                <div key={m.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "32px 24px", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(15,23,42,0.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: m.color, lineHeight: 1, marginBottom: 10 }}>{m.value}</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
              {METRICS.slice(4).map(m => (
                <div key={m.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: m.color, lineHeight: 1, marginBottom: 10 }}>{m.value}</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
              <MonthlyTrendChart monthly={monthly} />
              <RecommendationChart buy={kpi.buy_count} sell={kpi.sell_count} investment={kpi.investment_count} />
              <PropertySplitChart residential={kpi.residential_count} commercial={kpi.commercial_count} />
            </div>

            {/* Table */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Assignments — {month} {year}</h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["Property","City","Type","Recommendation","Value"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F8FAFC" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{v.property_name}</div>
                          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{v.developer_name}</div>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: 14, color: "#374151" }}>{v.city}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: v.property_type === "Residential" ? "#EFF6FF" : "#F5F3FF", color: v.property_type === "Residential" ? "#1D4ED8" : "#7C3AED" }}>{v.property_type}</span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                            background: v.recommendation_type === "Buy" ? "#ECFDF5" : v.recommendation_type === "Sell" ? "#FEF2F2" : "#FFFBEB",
                            color: v.recommendation_type === "Buy" ? "#059669" : v.recommendation_type === "Sell" ? "#DC2626" : "#D97706",
                            border: `1px solid ${v.recommendation_type === "Buy" ? "#A7F3D0" : v.recommendation_type === "Sell" ? "#FECACA" : "#FDE68A"}`,
                          }}>{v.recommendation_type}</span>
                        </td>
                        <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{formatCrore(v.mb_research_value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
