"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { useStore } from "@/lib/store";
import { computeKPIs, computeCityStats, computeMonthlyData, formatCrore } from "@/lib/analytics";
import { Valuation } from "@/types/valuation";
import KPICards from "@/components/KPICards";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";
import UploadExcel from "@/components/UploadExcel";
import DataTable from "@/components/DataTable";
import { LogOut, LayoutDashboard, Upload, Table2, Map, ChevronRight, Trash2, AlertTriangle, Calendar, Download, FileSpreadsheet } from "lucide-react";

type Tab = "overview" | "upload" | "data" | "cities" | "monthly";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC" }}>
        <div style={{ width: 32, height: 32, border: "2.5px solid #E2E8F0", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, analystEmail, valuations, addValuations, setValuations, logout } = useStore();

  const initialTab = (searchParams.get("tab") as Tab) || "overview";
  const [tab, setTab]             = useState<Tab>(initialTab);
  const [showClear, setShowClear] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [misMonth, setMisMonth]   = useState("June");
  const [misYear,  setMisYear]    = useState(2025);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const YEARS  = [2023, 2024, 2025, 2026];

  useEffect(() => { if (!isLoggedIn) router.push("/analyst-login"); }, [isLoggedIn, router]);
  useEffect(() => {
    const t = searchParams.get("tab") as Tab;
    if (t) setTab(t);
  }, [searchParams]);

  const kpi       = useMemo(() => computeKPIs(valuations), [valuations]);
  const cityStats = useMemo(() => computeCityStats(valuations), [valuations]);
  const monthly   = useMemo(() => computeMonthlyData(valuations), [valuations]);

  const handleUploaded = (data: Valuation[]) => {
    addValuations(data);
    setUploadCount(data.length);
    setTimeout(() => setTab("overview"), 1200);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  if (!isLoggedIn) return null;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview",        icon: LayoutDashboard },
    { id: "upload",   label: "Upload Data",     icon: Upload },
    { id: "data",     label: "All Records",     icon: Table2 },
    { id: "cities",   label: "City Stats",      icon: Map },
    { id: "monthly",  label: "Monthly Summary", icon: Calendar },
  ];

  const sidebar: React.CSSProperties = {
    width: 232, background: "#fff", borderRight: "1px solid #E2E8F0",
    display: "flex", flexDirection: "column",
    position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
  };

  const navBtn = (id: Tab): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: 10, cursor: "pointer",
    background: tab === id ? "#F1F5F9" : "transparent",
    color: tab === id ? "#0F172A" : "#64748B",
    border: "none", width: "100%", textAlign: "left",
    fontSize: 14, fontWeight: tab === id ? 600 : 500,
    transition: "all 0.15s",
  });

  const RECO_STYLE = (r: string) => ({
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: r === "Buy" ? "#ECFDF5" : r === "Sell" ? "#FEF2F2" : "#FFFBEB",
    color: r === "Buy" ? "#059669" : r === "Sell" ? "#DC2626" : "#D97706",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* ── SIDEBAR ── */}
      <aside style={sidebar} className="hidden md:flex">
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ background: "#C8102E", borderRadius: 6, padding: "4px 8px" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>mb</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", lineHeight: 1.2 }}>MB Research</div>
              <div style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Analyst Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 10px", marginBottom: 4 }}>Navigation</p>
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={navBtn(t.id)}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#374151"; }}}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}}>
                <Icon size={16} />
                <span style={{ flex: 1 }}>{t.label}</span>
                {tab === t.id && <ChevronRight size={13} style={{ color: "#94A3B8" }} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, background: "#0F172A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{analystEmail.charAt(0).toUpperCase()}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{analystEmail}</p>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>Analyst</p>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#64748B", background: "transparent", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, marginLeft: 232, display: "flex", flexDirection: "column", minHeight: "100vh" }} className="md:ml-[232px] ml-0">

        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 40, padding: "0 36px" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{TABS.find(t => t.id === tab)?.label}</h1>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                {valuations.length} total records · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            {/* Mobile nav pills */}
            <div className="flex md:hidden gap-1">
              {TABS.map(t => { const Icon = t.icon; return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: tab === t.id ? "#F1F5F9" : "transparent", color: tab === t.id ? "#0F172A" : "#94A3B8" }}>
                  <Icon size={17} />
                </button>
              );})}
              <button onClick={handleLogout}
                style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "#94A3B8" }}
                onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "36px", flex: 1 }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <KPICards data={kpi} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                <MonthlyTrendChart monthly={monthly} />
                <RecommendationChart buy={kpi.buy_count} sell={kpi.sell_count} investment={kpi.investment_count} />
                <PropertySplitChart residential={kpi.residential_count} commercial={kpi.commercial_count} />
              </div>
              <DataTable valuations={[...valuations].reverse()} limit={10} />
            </div>
          )}

          {/* ── UPLOAD ── */}
          {tab === "upload" && (
            <div style={{ maxWidth: 680 }}>
              <UploadExcel onUploaded={handleUploaded} />
              {uploadCount > 0 && (
                <div style={{ marginTop: 16, background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: "14px 20px", fontSize: 14, color: "#065F46", fontWeight: 500 }}>
                  ✓ {uploadCount} records added. Switching to Overview...
                </div>
              )}
            </div>
          )}

          {/* ── ALL DATA ── */}
          {tab === "data" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 14, color: "#64748B" }}>{valuations.length} total assignments in database</p>
                <button onClick={() => setShowClear(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <Trash2 size={14} /> Clear All Data
                </button>
              </div>

              {showClear && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>Clear all valuation data?</p>
                    <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: 14 }}>This will permanently remove all {valuations.length} records including demo data.</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => { setValuations([]); setShowClear(false); }}
                        style={{ padding: "8px 18px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Yes, clear all
                      </button>
                      <button onClick={() => setShowClear(false)}
                        style={{ padding: "8px 18px", background: "#fff", color: "#374151", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <DataTable valuations={[...valuations].reverse()} limit={200} />
            </div>
          )}

          {/* ── CITIES ── */}
          {tab === "cities" && (
            <div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>City-wise Statistics</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{cityStats.length} cities with active assignments</p>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {["City","Total","Residential","Commercial","Portfolio Value","Buy","Sell","Investment"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cityStats.map((c, i) => (
                        <tr key={c.city} style={{ borderBottom: "1px solid #F8FAFC", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA"}>
                          <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{c.city}</td>
                          <td style={{ padding: "16px 20px", fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{c.total}</td>
                          <td style={{ padding: "16px 20px" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>{c.residential}</span></td>
                          <td style={{ padding: "16px 20px" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>{c.commercial}</span></td>
                          <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 13, color: "#059669" }}>{formatCrore(c.portfolio_value)}</td>
                          <td style={{ padding: "16px 20px" }}><span style={{ ...RECO_STYLE("Buy") }}>{c.buy}</span></td>
                          <td style={{ padding: "16px 20px" }}><span style={{ ...RECO_STYLE("Sell") }}>{c.sell}</span></td>
                          <td style={{ padding: "16px 20px" }}><span style={{ ...RECO_STYLE("Investment") }}>{c.investment}</span></td>
                        </tr>
                      ))}
                      {cityStats.length === 0 && (
                        <tr><td colSpan={8} style={{ padding: "48px 0", textAlign: "center", fontSize: 14, color: "#94A3B8" }}>No city data available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── MONTHLY SUMMARY ── */}
          {tab === "monthly" && (() => {
            const filtered = valuations.filter(v => v.month === misMonth && v.year === misYear);
            const mkpi     = computeKPIs(filtered);

            const exportExcel = () => {
              if (!filtered.length) return;
              const rows = filtered.map(v => ({
                "Property Name": v.property_name, "Developer": v.developer_name, "City": v.city,
                "Property Type": v.property_type, "Unit Type": v.unit_type,
                "SBUA (sf)": v.sbua, "Carpet Area (sf)": v.carpet_area,
                "Received Date": v.received_date, "Sent Date": v.sent_date,
                "Recommendation": v.recommendation_type, "MB Research Value": v.mb_research_value,
                "Month": v.month, "Year": v.year, "Quarter": v.quarter,
              }));
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), `${misMonth} ${misYear}`);
              const summary = [["MB Research — Monthly Summary"], [`Period: ${misMonth} ${misYear}`], [],
                ["Total Valuations", mkpi.total_valuations], ["Portfolio Value", mkpi.portfolio_value],
                ["Buy", mkpi.buy_count], ["Sell", mkpi.sell_count], ["Investment", mkpi.investment_count],
                ["Residential", mkpi.residential_count], ["Commercial", mkpi.commercial_count]];
              XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");
              XLSX.writeFile(wb, `MB_Research_${misMonth}_${misYear}.xlsx`);
            };

            const exportTxt = () => {
              const lines = [
                "MB RESEARCH VALUATION — MONTHLY REPORT",
                `Period: ${misMonth} ${misYear}`,
                `Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
                "", "═══════════════════════════════",
                `Total Valuations          : ${mkpi.total_valuations}`,
                `Portfolio Value           : ${formatCrore(mkpi.portfolio_value)}`,
                `Buy Recommendations       : ${mkpi.buy_count}`,
                `Sell Recommendations      : ${mkpi.sell_count}`,
                `Investment Recommendations: ${mkpi.investment_count}`,
                `Residential               : ${mkpi.residential_count}`,
                `Commercial                : ${mkpi.commercial_count}`,
                "", "═══════════════════════════════",
                ...filtered.map((v, i) => `${String(i+1).padStart(3,"0")}. ${v.property_name} | ${v.city} | ${v.recommendation_type} | ${formatCrore(v.mb_research_value)}`),
                "", "MB Research Valuation · research@mbresearch.in",
              ];
              const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
              const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
              a.download = `MB_Report_${misMonth}_${misYear}.txt`; a.click();
            };

            const selStyle: React.CSSProperties = {
              background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 8,
              padding: "9px 12px", fontSize: 13, color: "#0F172A", outline: "none", cursor: "pointer",
            };
            const recoBadge = (r: string) => ({
              padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: r === "Buy" ? "#ECFDF5" : r === "Sell" ? "#FEF2F2" : "#FFFBEB",
              color: r === "Buy" ? "#059669" : r === "Sell" ? "#DC2626" : "#D97706",
            });

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Filter bar */}
                <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <select value={misMonth} onChange={e => setMisMonth(e.target.value)} style={selStyle}>
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select value={misYear} onChange={e => setMisYear(Number(e.target.value))} style={selStyle}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                    <div style={{ padding: "9px 14px", background: filtered.length ? "#ECFDF5" : "#F8FAFC", border: `1px solid ${filtered.length ? "#A7F3D0" : "#E2E8F0"}`, borderRadius: 8, fontSize: 13, color: filtered.length ? "#059669" : "#94A3B8", fontWeight: 600 }}>
                      {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {filtered.length > 0 && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={exportExcel} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                        <FileSpreadsheet size={14} style={{ color: "#059669" }} /> Export Excel
                      </button>
                      <button onClick={exportTxt} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#0F172A", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                        <Download size={14} /> Download Report
                      </button>
                    </div>
                  )}
                </div>

                {filtered.length === 0 ? (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "64px 32px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>No data for {misMonth} {misYear}</p>
                    <p style={{ fontSize: 13, color: "#94A3B8" }}>Upload assignments with matching month and year to see this report.</p>
                  </div>
                ) : (
                  <>
                    {/* KPI grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {[
                        { label: "Total Valuations",          val: String(mkpi.total_valuations),           color: "#0F172A" },
                        { label: "Portfolio Value",            val: formatCrore(mkpi.portfolio_value),       color: "#059669" },
                        { label: "Buy Recommendations",        val: String(mkpi.buy_count),                  color: "#059669" },
                        { label: "Sell Recommendations",       val: String(mkpi.sell_count),                 color: "#DC2626" },
                        { label: "Investment Recommendations", val: String(mkpi.investment_count),           color: "#D97706" },
                        { label: "Residential Assignments",    val: String(mkpi.residential_count),          color: "#1D4ED8" },
                        { label: "Commercial Assignments",     val: String(mkpi.commercial_count),           color: "#7C3AED" },
                      ].map(k => (
                        <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 18px" }}>
                          <div style={{ fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.03em", marginBottom: 6 }}>{k.val}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{k.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      <MonthlyTrendChart monthly={monthly} />
                      <RecommendationChart buy={mkpi.buy_count} sell={mkpi.sell_count} investment={mkpi.investment_count} />
                      <PropertySplitChart residential={mkpi.residential_count} commercial={mkpi.commercial_count} />
                    </div>

                    {/* Table */}
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "18px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Assignments — {misMonth} {misYear}</h3>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{filtered.length} records</span>
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#F8FAFC" }}>
                              {["#","Property","City","Type","Recommendation","Value"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "10px 18px", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((v, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #F8FAFC" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 18px", fontSize: 12, color: "#CBD5E1", fontFamily: "monospace" }}>{String(i+1).padStart(2,"0")}</td>
                                <td style={{ padding: "14px 18px" }}>
                                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{v.property_name}</div>
                                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{v.developer_name}</div>
                                </td>
                                <td style={{ padding: "14px 18px", fontSize: 13, color: "#374151" }}>{v.city}</td>
                                <td style={{ padding: "14px 18px" }}>
                                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: v.property_type === "Residential" ? "#EFF6FF" : "#F5F3FF", color: v.property_type === "Residential" ? "#1D4ED8" : "#7C3AED" }}>
                                    {v.property_type}
                                  </span>
                                </td>
                                <td style={{ padding: "14px 18px" }}><span style={recoBadge(v.recommendation_type)}>{v.recommendation_type}</span></td>
                                <td style={{ padding: "14px 18px", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{formatCrore(v.mb_research_value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ padding: "12px 18px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", gap: 20, flexWrap: "wrap" }}>
                        {[["Total", String(filtered.length) + " assignments"], ["Portfolio", formatCrore(mkpi.portfolio_value)], ["Buy", String(mkpi.buy_count)], ["Sell", String(mkpi.sell_count)], ["Investment", String(mkpi.investment_count)]].map(([l, v]) => (
                          <div key={l} style={{ display: "flex", gap: 5, fontSize: 12 }}>
                            <span style={{ color: "#94A3B8" }}>{l}:</span>
                            <span style={{ fontWeight: 700, color: "#0F172A" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
