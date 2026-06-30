"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

// ── Mercator projection ────────────────────────────────────────────────────
const VW = 680, VH = 700;
const LON0 = 67.5, LON1 = 98.5, LAT0 = 5.5, LAT1 = 37.8;

function merc(latDeg: number): number {
  return Math.log(Math.tan(Math.PI / 4 + (latDeg * Math.PI) / 360));
}
const M0 = merc(LAT0), M1 = merc(LAT1);

function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON0) / (LON1 - LON0)) * VW;
  const y = VH - ((merc(lat) - M0) / (M1 - M0)) * VH;
  return [+x.toFixed(1), +y.toFixed(1)];
}

// Convert a GeoJSON ring (array of [lon,lat]) → SVG path segment
function ringToD(ring: number[][]): string {
  const valid = ring.filter(
    (p) => Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1])
  );
  if (valid.length < 2) return "";
  return (
    valid
      .map((p, i) => {
        const [x, y] = project(p[0], p[1]);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join("") + "Z"
  );
}

// Convert a GeoJSON geometry → SVG d attribute
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function geoToD(geometry: any): string {
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return (geometry.coordinates as number[][][]).map(ringToD).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as number[][][][])
      .flatMap((poly: number[][][]) => poly.map(ringToD))
      .join(" ");
  }
  return "";
}

// ── City definitions with pre-computed label offsets ──────────────────────
const CITIES = [
  { name: "Mumbai",    lon: 72.877, lat: 19.076, lx: -72, ly: -13 },
  { name: "Ahmedabad", lon: 72.585, lat: 23.033, lx: -83, ly: -13 },
  { name: "Delhi NCR", lon: 77.209, lat: 28.614, lx:  11, ly: -15 },
  { name: "Gurugram",  lon: 77.026, lat: 28.459, lx: -83, ly:  16 },
  { name: "Noida",     lon: 77.391, lat: 28.535, lx:  11, ly:  20 },
  { name: "Kolkata",   lon: 88.363, lat: 22.572, lx:  11, ly: -13 },
  { name: "Pune",      lon: 73.856, lat: 18.520, lx: -55, ly:  18 },
  { name: "Hyderabad", lon: 78.474, lat: 17.385, lx:  11, ly:  18 },
  { name: "Bengaluru", lon: 77.594, lat: 12.972, lx: -80, ly: -13 },
  { name: "Chennai",   lon: 80.270, lat: 13.082, lx:  11, ly: -13 },
];

interface StatePath { name: string; d: string; }
interface Props { cityStats: CityStats[]; }

export default function IndiaMap({ cityStats }: Props) {
  const [paths,    setPaths]    = useState<StatePath[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [hovSt,    setHovSt]    = useState<string | null>(null);
  const [selected, setSelected] = useState<CityStats | null>(null);
  const [hovCity,  setHovCity]  = useState<string | null>(null);
  const [tip,      setTip]      = useState<{ x: number; y: number } | null>(null);

  const statsMap = new Map(cityStats.map((c) => [c.city, c]));

  useEffect(() => {
    fetch("/india-states.json")
      .then((r) => r.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const computed: StatePath[] = data.features.map((f: any) => ({
          name: f.properties?.name || f.properties?.NAME_1 || "",
          d: geoToD(f.geometry),
        })).filter((s: StatePath) => s.d);
        setPaths(computed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pick = (name: string) => {
    setSelected(
      statsMap.get(name) ?? {
        city: name, total: 0, residential: 0, commercial: 0,
        portfolio_value: 0, buy: 0, sell: 0, investment: 0,
      }
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

      {/* ── Map card ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
        {/* Header bar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>India Coverage Map</p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>Click any city marker to view statistics</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["#0F172A","Active city"],["#C8102E","Selected"],["#CBD5E1","No data"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#64748B" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* SVG map */}
        <div style={{ background: "#F0F4F8", position: "relative" }}>
          {loading ? (
            <div style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 32, height: 32, border: "3px solid #E2E8F0", borderTopColor: "#0F172A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Loading map…</p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              style={{ width: "100%", height: "auto", display: "block" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ocean / background */}
              <rect width={VW} height={VH} fill="#E8EFF6" />

              {/* State fills */}
              {paths.map((s) => (
                <path
                  key={s.name}
                  d={s.d}
                  fill={hovSt === s.name ? "#D8E3ED" : "#EEF2F7"}
                  stroke="#C5D0DC"
                  strokeWidth={0.7}
                  strokeLinejoin="round"
                  style={{ transition: "fill 0.15s ease", cursor: "default" }}
                  onMouseEnter={() => setHovSt(s.name)}
                  onMouseLeave={() => setHovSt(null)}
                />
              ))}

              {/* City markers */}
              {CITIES.map(({ name, lon, lat, lx, ly }) => {
                const [cx, cy] = project(lon, lat);
                const stats   = statsMap.get(name);
                const hasData = !!stats && stats.total > 0;
                const isSel   = selected?.city === name;
                const isHov   = hovCity === name;
                const r       = hasData ? 7 : 5;
                const fill    = isSel ? "#C8102E" : hasData ? "#0F172A" : "#94A3B8";

                return (
                  <g
                    key={name}
                    style={{ cursor: "pointer" }}
                    onClick={() => pick(name)}
                    onMouseEnter={(e) => {
                      setHovCity(name);
                      const rect = (e.currentTarget.closest("svg") as SVGSVGElement)?.getBoundingClientRect();
                      if (rect) setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                    onMouseLeave={() => { setHovCity(null); setTip(null); }}
                  >
                    {/* Pulse ring on hover / select */}
                    {(isHov || isSel) && (
                      <circle cx={cx} cy={cy} r={r + 9}
                        fill={isSel ? "rgba(200,16,46,0.14)" : "rgba(15,23,42,0.08)"} />
                    )}
                    {hasData && (
                      <circle cx={cx} cy={cy} r={r + 4}
                        fill="none"
                        stroke={isHov ? "#0F172A" : "#94A3B8"}
                        strokeWidth={1}
                        opacity={0.4} />
                    )}
                    {/* Main dot */}
                    <circle cx={cx} cy={cy} r={r}
                      fill={fill}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ transition: "fill 0.15s ease" }} />
                    {/* Assignment count */}
                    {hasData && (
                      <text x={cx} y={cy + r - 2}
                        textAnchor="middle"
                        fontSize={6} fontWeight={800} fill="#fff"
                        style={{ pointerEvents: "none", userSelect: "none", fontFamily: "Inter,sans-serif" }}>
                        {stats.total}
                      </text>
                    )}
                    {/* Label */}
                    <text x={cx + lx} y={cy + ly}
                      fontSize={isHov || isSel ? 10.5 : 9.5}
                      fontWeight={isHov || isSel ? 700 : 600}
                      fill={isSel ? "#C8102E" : isHov ? "#0F172A" : "#374151"}
                      style={{ pointerEvents: "none", userSelect: "none", fontFamily: "Inter,sans-serif", transition: "fill 0.15s ease" }}>
                      {name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Animated tooltip preview */}
          {tip && hovCity && !loading && (() => {
            const s = statsMap.get(hovCity);
            const hasData = !!s && s.total > 0;
            return (
              <div
                key={hovCity}
                style={{
                  position: "absolute", left: tip.x + 16, top: tip.y - 14,
                  background: "#0F172A", color: "#fff",
                  padding: hasData ? "12px 16px" : "8px 14px",
                  borderRadius: 12, minWidth: hasData ? 160 : undefined,
                  pointerEvents: "none",
                  boxShadow: "0 12px 32px rgba(15,23,42,0.3)", zIndex: 20,
                  animation: "tooltipIn 0.18s cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: hasData ? 8 : 0, whiteSpace: "nowrap" }}>{hovCity}</div>
                {hasData ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
                      <span>Assignments</span><span style={{ color: "#fff", fontWeight: 700 }}>{s!.total}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                      <span>Portfolio</span><span style={{ color: "#10B981", fontWeight: 700 }}>{formatCrore(s!.portfolio_value)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 3, height: 4, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ flex: s!.buy || 0.001, background: "#10B981" }} />
                      <div style={{ flex: s!.sell || 0.001, background: "#EF4444" }} />
                      <div style={{ flex: s!.investment || 0.001, background: "#F59E0B" }} />
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>No data yet</span>
                )}
              </div>
            );
          })()}
        </div>
      </div>
      <style>{`@keyframes tooltipIn { from { opacity: 0; transform: translateY(4px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

      {/* ── Stats panel ── */}
      <div style={{ position: "sticky", top: 88 }}>
        {selected ? (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(15,23,42,0.07)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>City Statistics</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>{selected.city}</h3>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ padding: 7, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", color: "#94A3B8", display: "flex", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#94A3B8"; }}>
                <X size={14} />
              </button>
            </div>

            {selected.total === 0 ? (
              <div style={{ padding: "36px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📍</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No assignments yet</p>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>Upload valuation data to see city-level statistics.</p>
              </div>
            ) : (
              <div style={{ padding: "0 24px 16px" }}>
                {/* Big total */}
                <div style={{ padding: "18px 0 14px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Total Valuations</span>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>{selected.total}</span>
                </div>

                {[
                  { label: "Residential",              val: selected.residential,                   color: "#1D4ED8" },
                  { label: "Commercial",               val: selected.commercial,                    color: "#7C3AED" },
                  { label: "Portfolio Value",          val: formatCrore(selected.portfolio_value),  color: "#059669", bold: true },
                  { label: "Buy Recommendations",      val: selected.buy,                           color: "#059669" },
                  { label: "Sell Recommendations",     val: selected.sell,                          color: "#DC2626" },
                  { label: "Investment Recos",         val: selected.investment,                    color: "#D97706" },
                ].map(({ label, val, color, bold }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
                    <span style={{ fontSize: bold ? 16 : 15, fontWeight: bold ? 700 : 600, color }}>{val}</span>
                  </div>
                ))}

                {/* Recommendation split bars */}
                <div style={{ paddingTop: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#CBD5E1", marginBottom: 10 }}>Recommendation Split</p>
                  {[
                    { label: "Buy",        val: selected.buy,        color: "#10B981" },
                    { label: "Sell",       val: selected.sell,       color: "#EF4444" },
                    { label: "Investment", val: selected.investment,  color: "#F59E0B" },
                  ].map((b) => (
                    <div key={b.label} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                        <span style={{ color: "#64748B" }}>{b.label}</span>
                        <span style={{ fontWeight: 600, color: "#374151" }}>
                          {selected.total > 0 ? Math.round((b.val / selected.total) * 100) : 0}%
                        </span>
                      </div>
                      <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", background: b.color, borderRadius: 3,
                          width: `${selected.total > 0 ? (b.val / selected.total) * 100 : 0}%`,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: 20, padding: 36, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>📍</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Select a City</p>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.65, marginBottom: 24 }}>Click any marker on the map to view detailed valuation statistics.</p>

            {cityStats.filter((c) => c.total > 0).length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#CBD5E1", marginBottom: 10 }}>Quick Select</p>
                {cityStats.filter((c) => c.total > 0).slice(0, 5).map((c) => (
                  <button key={c.city} onClick={() => setSelected(c)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, cursor: "pointer", marginBottom: 6, fontSize: 13, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0F172A"; e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#fff"; }}>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>{c.city}</span>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{c.total} assignments</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
