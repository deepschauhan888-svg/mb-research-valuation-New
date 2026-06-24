"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { computeKPIs, computeCityStats, computeMonthlyData, formatCrore } from "@/lib/analytics";
import { Valuation } from "@/types/valuation";
import KPICards from "@/components/KPICards";
import { MonthlyTrendChart, RecommendationChart, PropertySplitChart } from "@/components/Charts";
import UploadExcel from "@/components/UploadExcel";
import DataTable from "@/components/DataTable";
import { LogOut, LayoutDashboard, Upload, Table2, Map, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

type Tab = "overview" | "upload" | "data" | "cities";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, analystEmail, valuations, addValuations, setValuations, logout } = useStore();
  const [tab, setTab]           = useState<Tab>("overview");
  const [showClear, setShowClear] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => { if (!isLoggedIn) router.push("/analyst-login"); }, [isLoggedIn, router]);

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
    { id: "overview", label: "Overview",    icon: LayoutDashboard },
    { id: "upload",   label: "Upload Data", icon: Upload },
    { id: "data",     label: "All Records", icon: Table2 },
    { id: "cities",   label: "City Stats",  icon: Map },
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

        </div>
      </div>
    </div>
  );
}
