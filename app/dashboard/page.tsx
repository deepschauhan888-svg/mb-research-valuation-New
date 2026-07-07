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
import IndiaMap from "@/components/IndiaMap";
import { LogOut, LayoutDashboard, Upload, Table2, Map, Calendar, Trash2, AlertTriangle, Download, FileSpreadsheet } from "lucide-react";

type Tab = "overview" | "upload" | "data" | "cities" | "monthly";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8FAFC" }}>
        <div style={{ width:28, height:28, border:"2.5px solid #E2E8F0", borderTopColor:"#C8102E", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, analystEmail, valuations, addValuations, setValuations, logout } = useStore();

  const initTab = (searchParams.get("tab") as Tab) || "overview";
  const [tab, setTab] = useState<Tab>(initTab);
  const [showClear, setShowClear] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [misMonth, setMisMonth] = useState("June");
  const [misYear,  setMisYear]  = useState(2025);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const YEARS = [2023,2024,2025,2026];

  useEffect(() => { if (!isLoggedIn) router.push("/analyst-login"); }, [isLoggedIn, router]);
  useEffect(() => { const t = searchParams.get("tab") as Tab; if (t) setTab(t); }, [searchParams]);

  const kpi      = useMemo(() => computeKPIs(valuations), [valuations]);
  const city     = useMemo(() => computeCityStats(valuations), [valuations]);
  const monthly  = useMemo(() => computeMonthlyData(valuations), [valuations]);

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id:"overview", label:"Overview",        icon:LayoutDashboard },
    { id:"upload",   label:"Upload Data",     icon:Upload },
    { id:"data",     label:"All Records",     icon:Table2 },
    { id:"cities",   label:"City Stats",      icon:Map },
    { id:"monthly",  label:"Monthly Summary", icon:Calendar },
  ];

  const handleUpload = (data: Valuation[]) => {
    addValuations(data); setUploadCount(data.length); setTab("overview");
  };

  const handleClear = () => { setValuations([]); setShowClear(false); };

  const nav: React.CSSProperties = { display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", border:"none", background:"none", fontFamily:"Inter,sans-serif", transition:"all 0.15s", whiteSpace:"nowrap" };

  if (!isLoggedIn) return null;

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC", display:"flex" }}>
      {/* Sidebar */}
      <aside style={{ width:220, background:"#fff", borderRight:"1px solid #E5E7EB", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid #F3F4F6" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"#C8102E", borderRadius:4, padding:"3px 7px" }}><span style={{ color:"#fff", fontWeight:900, fontSize:10, fontFamily:"Inter,sans-serif" }}>mb</span></div>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontWeight:500, color:"#0F172A" }}>Research</span>
          </div>
          <p style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Inter,sans-serif", marginTop:4, letterSpacing:"0.1em", textTransform:"uppercase" }}>Analyst Portal</p>
        </div>
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2 }}>
          {TABS.map(t => {
            const Icon = t.icon; const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ ...nav, color:active?"#C8102E":"#6B7280", background:active?"rgba(200,16,46,0.07)":"none" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background="#F8FAFC"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background="none"; }}>
                <Icon size={16} style={{ flexShrink:0 }}/>{t.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding:"12px 8px 16px", borderTop:"1px solid #F3F4F6" }}>
          <p style={{ fontSize:11, color:"#9CA3AF", padding:"0 8px 8px", fontFamily:"Inter,sans-serif" }}>{analystEmail}</p>
          <button onClick={() => { logout(); router.push("/analyst-login"); }}
            style={{ ...nav, color:"#EF4444", width:"100%" }}
            onMouseEnter={e => e.currentTarget.style.background="#FEF2F2"}
            onMouseLeave={e => e.currentTarget.style.background="none"}>
            <LogOut size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:220, flex:1, padding:"28px 28px 40px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", fontFamily:"Inter,sans-serif" }}>{TABS.find(t=>t.id===tab)?.label}</h1>
            <p style={{ fontSize:12, color:"#9CA3AF", fontFamily:"Inter,sans-serif", marginTop:2 }}>{valuations.length} total records</p>
          </div>
          {tab === "data" && (
            <button onClick={() => setShowClear(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, fontSize:13, fontWeight:500, color:"#DC2626", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              <Trash2 size={14}/> Clear All Data
            </button>
          )}
        </div>

        {uploadCount > 0 && tab === "overview" && (
          <div style={{ background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:10, padding:"12px 16px", display:"flex", gap:10, marginBottom:20 }}>
            <span style={{ fontSize:13, color:"#059669", fontFamily:"Inter,sans-serif" }}>✓ {uploadCount} records uploaded successfully.</span>
          </div>
        )}

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <KPICards data={kpi} />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              <MonthlyTrendChart monthly={monthly}/>
              <RecommendationChart buy={kpi.buy_count} sell={kpi.sell_count} investment={kpi.investment_count}/>
              <PropertySplitChart residential={kpi.residential_count} commercial={kpi.commercial_count}/>
            </div>
            <DataTable valuations={[...valuations].reverse()} limit={8}/>
          </div>
        )}

        {/* ── Upload ── */}
        {tab === "upload" && <UploadExcel onUploaded={handleUpload}/>}

        {/* ── Data ── */}
        {tab === "data" && (
          <>
            <DataTable valuations={[...valuations].reverse()} limit={valuations.length}/>
            {showClear && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
                <div style={{ background:"#fff", borderRadius:16, padding:32, maxWidth:400, width:"90%" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:20 }}>
                    <AlertTriangle size={22} style={{ color:"#EF4444", flexShrink:0 }}/>
                    <div>
                      <h3 style={{ fontSize:16, fontWeight:700, color:"#0F172A", marginBottom:6, fontFamily:"Inter,sans-serif" }}>Clear all data?</h3>
                      <p style={{ fontSize:13, color:"#6B7280", fontFamily:"Inter,sans-serif" }}>This will remove all {valuations.length} valuation records permanently.</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                    <button onClick={() => setShowClear(false)} style={{ padding:"9px 18px", border:"1px solid #E5E7EB", borderRadius:8, fontSize:13, fontWeight:500, background:"#fff", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Cancel</button>
                    <button onClick={handleClear} style={{ padding:"9px 18px", background:"#EF4444", border:"none", borderRadius:8, fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Clear All</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Cities ── */}
        {tab === "cities" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <IndiaMap cityStats={city}/>
          </div>
        )}

        {/* ── Monthly Summary ── */}
        {tab === "monthly" && (() => {
          const fil = valuations.filter(v => v.month === misMonth && v.year === misYear);
          const mkpi = computeKPIs(fil);

          const exportXlsx = () => {
            if (!fil.length) return;
            const rows = fil.map(v => ({"Property Name":v.property_name,"Developer":v.developer_name,"City":v.city,"Type":v.property_type,"Unit":v.unit_type,"SBUA":v.sbua,"Carpet Area":v.carpet_area,"Received":v.received_date,"Sent":v.sent_date,"Recommendation":v.recommendation_type,"MB Value":v.mb_research_value,"Month":v.month,"Year":v.year,"Quarter":v.quarter}));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), `${misMonth} ${misYear}`);
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["MB Research — Monthly Summary"],[`Period: ${misMonth} ${misYear}`],[],["Total",mkpi.total_valuations],["Portfolio",mkpi.portfolio_value],["Buy",mkpi.buy_count],["Sell",mkpi.sell_count],["Investment",mkpi.investment_count]]), "Summary");
            XLSX.writeFile(wb, `MB_Research_${misMonth}_${misYear}.xlsx`);
          };
          const exportTxt = () => {
            const lines = ["MB RESEARCH VALUATION — MONTHLY REPORT",`Period: ${misMonth} ${misYear}`,`Generated: ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}`,"","═══════════════════════════",`Total Valuations   : ${mkpi.total_valuations}`,`Portfolio Value    : ${formatCrore(mkpi.portfolio_value)}`,`Buy                : ${mkpi.buy_count}`,`Sell               : ${mkpi.sell_count}`,`Investment         : ${mkpi.investment_count}`,"","═══════════════════════════",...fil.map((v,i)=>`${String(i+1).padStart(3,"0")}. ${v.property_name} | ${v.city} | ${v.recommendation_type} | ${formatCrore(v.mb_research_value)}`),"","MB Research Valuation · research@mbresearch.in"];
            const blob = new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
            const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`MB_Report_${misMonth}_${misYear}.txt`; a.click();
          };
          const sel: React.CSSProperties = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:7, padding:"9px 12px", fontSize:13, color:"#0F172A", outline:"none", cursor:"pointer", fontFamily:"Inter,sans-serif" };
          const rb = (r:string) => ({ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:r==="Buy"?"#ECFDF5":r==="Sell"?"#FEF2F2":"#FFFBEB", color:r==="Buy"?"#059669":r==="Sell"?"#DC2626":"#D97706" });
          return (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <select value={misMonth} onChange={e=>setMisMonth(e.target.value)} style={sel}>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
                  <select value={misYear} onChange={e=>setMisYear(Number(e.target.value))} style={sel}>{YEARS.map(y=><option key={y}>{y}</option>)}</select>
                  <span style={{ fontSize:13, fontWeight:600, color:fil.length?"#059669":"#9CA3AF", background:fil.length?"#ECFDF5":"#F8FAFC", padding:"9px 14px", borderRadius:7, border:"1px solid",borderColor:fil.length?"#A7F3D0":"#E5E7EB", fontFamily:"Inter,sans-serif" }}>{fil.length} record{fil.length!==1?"s":""}</span>
                </div>
                {fil.length>0&&(
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={exportXlsx} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", background:"#fff", border:"1px solid #E5E7EB", borderRadius:8, fontSize:13, fontWeight:600, color:"#374151", cursor:"pointer", fontFamily:"Inter,sans-serif" }}><FileSpreadsheet size={14} style={{color:"#059669"}}/> Export Excel</button>
                    <button onClick={exportTxt} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", background:"#0F172A", border:"none", borderRadius:8, fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"Inter,sans-serif" }}><Download size={14}/> Download Report</button>
                  </div>
                )}
              </div>
              {fil.length===0?(
                <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:"64px 32px", textAlign:"center" }}>
                  <p style={{ fontSize:16, fontWeight:600, color:"#0F172A", marginBottom:6, fontFamily:"Inter,sans-serif" }}>No data for {misMonth} {misYear}</p>
                  <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"Inter,sans-serif" }}>Upload assignments with matching month and year.</p>
                </div>
              ):(
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {[["Total Valuations",mkpi.total_valuations,"#0F172A"],["Portfolio Value",formatCrore(mkpi.portfolio_value),"#059669"],["Buy Recommendations",mkpi.buy_count,"#059669"],["Sell Recommendations",mkpi.sell_count,"#DC2626"],["Investment Recos",mkpi.investment_count,"#D97706"],["Residential",mkpi.residential_count,"#1D4ED8"],["Commercial",mkpi.commercial_count,"#7C3AED"]].map(([l,v,c])=>(
                      <div key={String(l)} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"18px" }}>
                        <div style={{ fontSize:26, fontWeight:800, color:String(c), letterSpacing:"-0.03em", marginBottom:5, fontFamily:"Inter,sans-serif" }}>{v}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"Inter,sans-serif" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                    <MonthlyTrendChart monthly={monthly}/>
                    <RecommendationChart buy={mkpi.buy_count} sell={mkpi.sell_count} investment={mkpi.investment_count}/>
                    <PropertySplitChart residential={mkpi.residential_count} commercial={mkpi.commercial_count}/>
                  </div>
                  <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, overflow:"hidden" }}>
                    <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <h3 style={{ fontSize:14, fontWeight:700, color:"#0F172A", fontFamily:"Inter,sans-serif" }}>Assignments — {misMonth} {misYear}</h3>
                      <span style={{ fontSize:12, color:"#9CA3AF", fontFamily:"Inter,sans-serif" }}>{fil.length} records</span>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ background:"#F8FAFC" }}>
                            {["#","Property","City","Type","Recommendation","Value"].map(h=><th key={h} style={{ textAlign:"left", padding:"10px 18px", fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:"0.08em", textTransform:"uppercase", borderBottom:"1px solid #F1F5F9" }}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {fil.map((v,i)=>(
                            <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#FAFAFA"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <td style={{ padding:"13px 18px", fontSize:12, color:"#CBD5E1", fontFamily:"monospace" }}>{String(i+1).padStart(2,"0")}</td>
                              <td style={{ padding:"13px 18px" }}><div style={{ fontWeight:600, fontSize:13, color:"#0F172A", fontFamily:"Inter,sans-serif" }}>{v.property_name}</div><div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"Inter,sans-serif" }}>{v.developer_name}</div></td>
                              <td style={{ padding:"13px 18px", fontSize:13, color:"#374151", fontFamily:"Inter,sans-serif" }}>{v.city}</td>
                              <td style={{ padding:"13px 18px" }}><span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:v.property_type==="Residential"?"#EFF6FF":"#F5F3FF", color:v.property_type==="Residential"?"#1D4ED8":"#7C3AED", fontFamily:"Inter,sans-serif" }}>{v.property_type}</span></td>
                              <td style={{ padding:"13px 18px" }}><span style={rb(v.recommendation_type)}>{v.recommendation_type}</span></td>
                              <td style={{ padding:"13px 18px", fontWeight:700, fontSize:13, color:"#0F172A", whiteSpace:"nowrap", fontFamily:"Inter,sans-serif" }}>{formatCrore(v.mb_research_value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </main>
    </div>
  );
}