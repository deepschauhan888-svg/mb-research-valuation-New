"use client";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useStore } from "@/lib/store";
import { computeMonthlyData, computeKPIs, formatCrore } from "@/lib/analytics";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";
import { Download, FileSpreadsheet, TrendingUp, TrendingDown, Building2, IndianRupee, BarChart3, Home } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS  = [2023, 2024, 2025, 2026];

export default function MonthlySummaryPage() {
  const valuations = useStore(s => s.valuations);
  const [month, setMonth] = useState("June");
  const [year,  setYear]  = useState(2025);

  const filtered = useMemo(
    () => valuations.filter(v => v.month === month && v.year === year),
    [valuations, month, year]
  );
  const kpi     = useMemo(() => computeKPIs(filtered), [filtered]);
  const monthly = useMemo(() => computeMonthlyData(valuations), [valuations]);

  /* ── Export handlers ── */
  const exportExcel = () => {
    if (!filtered.length) return;
    const rows = filtered.map(v => ({
      "Property Name":       v.property_name,
      "Developer":           v.developer_name,
      "City":                v.city,
      "Property Type":       v.property_type,
      "Unit Type":           v.unit_type,
      "SBUA (sf)":           v.sbua,
      "Carpet Area (sf)":    v.carpet_area,
      "Received Date":       v.received_date,
      "Sent Date":           v.sent_date,
      "Recommendation":      v.recommendation_type,
      "MB Research Value":   v.mb_research_value,
      "Month":               v.month,
      "Year":                v.year,
      "Quarter":             v.quarter,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    /* Column widths */
    ws["!cols"] = [20,18,12,14,12,10,12,14,12,14,18,10,6,4].map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, `${month} ${year}`);

    /* Summary sheet */
    const summary = [
      ["MB Research Valuation — Monthly Summary"],
      [`Period: ${month} ${year}`],
      [],
      ["Metric", "Value"],
      ["Total Valuations",          kpi.total_valuations],
      ["Portfolio Value (INR)",     kpi.portfolio_value],
      ["Buy Recommendations",       kpi.buy_count],
      ["Sell Recommendations",      kpi.sell_count],
      ["Investment Recommendations",kpi.investment_count],
      ["Residential Assignments",   kpi.residential_count],
      ["Commercial Assignments",    kpi.commercial_count],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");
    XLSX.writeFile(wb, `MB_Research_${month}_${year}.xlsx`);
  };

  const exportReport = () => {
    const lines = [
      `MB RESEARCH VALUATION — MONTHLY REPORT`,
      `Period: ${month} ${year}`,
      `Generated: ${new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}`,
      ``,
      `═══════════════════════════════════════`,
      `KEY METRICS`,
      `═══════════════════════════════════════`,
      `Total Valuations          : ${kpi.total_valuations}`,
      `Portfolio Value Assessed  : ${formatCrore(kpi.portfolio_value)}`,
      `Buy Recommendations       : ${kpi.buy_count}`,
      `Sell Recommendations      : ${kpi.sell_count}`,
      `Investment Recommendations: ${kpi.investment_count}`,
      `Residential Assignments   : ${kpi.residential_count}`,
      `Commercial Assignments    : ${kpi.commercial_count}`,
      ``,
      `═══════════════════════════════════════`,
      `ASSIGNMENTS — ${month.toUpperCase()} ${year}`,
      `═══════════════════════════════════════`,
      ...filtered.map((v, i) =>
        `${String(i+1).padStart(3,"0")}. ${v.property_name} | ${v.city} | ${v.recommendation_type} | ${formatCrore(v.mb_research_value)}`
      ),
      ``,
      `─────────────────────────────────────`,
      `MB Research Valuation · research@mbresearch.in`,
      `Confidential — For Internal Use Only`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `MB_Research_Report_${month}_${year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── KPI card definitions ── */
  const KPI_CARDS = [
    { label: "Total Valuations",             value: kpi.total_valuations,                  icon: BarChart3,    color: "#0F172A", bg: "#F1F5F9", fmt: (v: number) => String(v) },
    { label: "Portfolio Value",               value: kpi.portfolio_value,                   icon: IndianRupee,  color: "#059669", bg: "#ECFDF5", fmt: formatCrore },
    { label: "Buy Recommendations",           value: kpi.buy_count,                         icon: TrendingUp,   color: "#059669", bg: "#ECFDF5", fmt: (v: number) => String(v) },
    { label: "Sell Recommendations",          value: kpi.sell_count,                        icon: TrendingDown, color: "#DC2626", bg: "#FEF2F2", fmt: (v: number) => String(v) },
    { label: "Investment Recommendations",    value: kpi.investment_count,                  icon: Building2,    color: "#D97706", bg: "#FFFBEB", fmt: (v: number) => String(v) },
    { label: "Residential Assignments",       value: kpi.residential_count,                 icon: Home,         color: "#1D4ED8", bg: "#EFF6FF", fmt: (v: number) => String(v) },
    { label: "Commercial Assignments",        value: kpi.commercial_count,                  icon: Building2,    color: "#7C3AED", bg: "#F5F3FF", fmt: (v: number) => String(v) },
  ];

  const selStyle: React.CSSProperties = {
    background: "#fff", border: "1.5px solid #E2E8F0",
    borderRadius: 10, padding: "11px 14px",
    fontSize: 14, fontWeight: 500, color: "#0F172A",
    outline: "none", cursor: "pointer", minWidth: 150,
    transition: "border-color 0.2s",
  };

  const recoBadge = (r: string) => ({
    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: r === "Buy" ? "#ECFDF5" : r === "Sell" ? "#FEF2F2" : "#FFFBEB",
    color:      r === "Buy" ? "#059669" : r === "Sell" ? "#DC2626"  : "#D97706",
    border: `1px solid ${r === "Buy" ? "#A7F3D0" : r === "Sell" ? "#FECACA" : "#FDE68A"}`,
  });

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── PAGE HEADER ── */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "52px 0 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 12 }}>Analytics</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", marginBottom: 8 }}>Monthly Summary</h1>
              <p style={{ fontSize: 15, color: "#64748B" }}>Select a period to view detailed valuation statistics and download reports.</p>
            </div>
            {/* Export buttons — visible at top level */}
            {filtered.length > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={exportExcel}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#0F172A", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0F172A"; e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#fff"; }}>
                  <FileSpreadsheet size={15} style={{ color: "#059669" }} />
                  Export Excel
                </button>
                <button onClick={exportReport}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#0F172A", border: "1.5px solid #0F172A", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1E293B"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0F172A"}>
                  <Download size={15} />
                  Download Report
                </button>
              </div>
            )}
          </div>

          {/* ── FILTERS ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Month</p>
              <select value={month} onChange={e => setMonth(e.target.value)} style={selStyle}
                onFocus={e => e.currentTarget.style.borderColor = "#C8102E"}
                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Year</p>
              <select value={year} onChange={e => setYear(Number(e.target.value))} style={selStyle}
                onFocus={e => e.currentTarget.style.borderColor = "#C8102E"}
                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", background: filtered.length ? "#ECFDF5" : "#F8FAFC", border: `1px solid ${filtered.length ? "#A7F3D0" : "#E2E8F0"}`, borderRadius: 10, fontSize: 13 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: filtered.length ? "#10B981" : "#CBD5E1" }} />
                <span style={{ fontWeight: 700, color: filtered.length ? "#059669" : "#94A3B8" }}>{filtered.length}</span>
                <span style={{ color: "#64748B" }}>record{filtered.length !== 1 ? "s" : ""} for {month} {year}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: "80px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📋</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No data for {month} {year}</h3>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>Upload valuation data via the Analyst Dashboard to populate monthly reports.</p>
          </div>
        ) : (
          <>
            {/* ── KPI BADGES GRID ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {KPI_CARDS.slice(0, 4).map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "24px 20px", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(15,23,42,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ width: 36, height: 36, background: c.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} style={{ color: c.color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: c.color, lineHeight: 1, marginBottom: 6 }}>{c.fmt(c.value)}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{c.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Second row — 3 cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
              {KPI_CARDS.slice(4).map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, background: c.bg, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={14} style={{ color: c.color }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{c.label}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: c.color }}>{c.fmt(c.value)}</div>
                  </div>
                );
              })}
            </div>

            {/* ── CHARTS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
              <MonthlyTrendChart monthly={monthly} />
              <RecommendationChart buy={kpi.buy_count} sell={kpi.sell_count} investment={kpi.investment_count} />
              <PropertySplitChart residential={kpi.residential_count} commercial={kpi.commercial_count} />
            </div>

            {/* ── ASSIGNMENTS TABLE ── */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Assignments — {month} {year}</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{filtered.length} records</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={exportExcel}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#fff"; }}>
                    <FileSpreadsheet size={13} style={{ color: "#059669" }} /> Export
                  </button>
                  <button onClick={exportReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#0F172A", border: "1px solid #0F172A", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                    <Download size={13} /> Report
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["#","Property","Developer","City","Type","Recommendation","Value"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "11px 18px", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F8FAFC", transition: "background 0.12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "14px 18px", fontSize: 12, color: "#CBD5E1", fontFamily: "monospace", fontWeight: 600 }}>{String(i+1).padStart(2,"0")}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{v.property_name}</div>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: "#64748B" }}>{v.developer_name}</td>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: "#374151" }}>{v.city}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: v.property_type === "Residential" ? "#EFF6FF" : "#F5F3FF", color: v.property_type === "Residential" ? "#1D4ED8" : "#7C3AED" }}>
                            {v.property_type}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={recoBadge(v.recommendation_type)}>{v.recommendation_type}</span>
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 700, fontSize: 14, color: "#0F172A", whiteSpace: "nowrap" }}>
                          {formatCrore(v.mb_research_value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer summary */}
              <div style={{ padding: "14px 20px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "Total", value: filtered.length + " assignments" },
                  { label: "Portfolio", value: formatCrore(kpi.portfolio_value) },
                  { label: "Buy", value: kpi.buy_count },
                  { label: "Sell", value: kpi.sell_count },
                  { label: "Investment", value: kpi.investment_count },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: "#94A3B8", fontWeight: 500 }}>{s.label}:</span>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
