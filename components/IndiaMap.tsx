"use client";
import { useState, useEffect } from "react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

// ── Projection (calibrated to india-states.json bounds) ─────────────────────
const VW = 520, VH = 600;
const LON0 = 67.0, LON1 = 98.5, LAT0 = 5.5, LAT1 = 36.5;

function proj(lon: number, lat: number): [number, number] {
  return [
    +((lon - LON0) / (LON1 - LON0) * VW).toFixed(1),
    +((LAT1 - lat) / (LAT1 - LAT0) * VH).toFixed(1),
  ];
}

function ringToD(ring: number[][]): string {
  const pts = ring.filter(p => Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1]));
  if (pts.length < 2) return "";
  return pts.map((p, i) => {
    const [x, y] = proj(p[0], p[1]);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join("") + "Z";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function geoToD(geometry: any): string {
  if (!geometry) return "";
  if (geometry.type === "Polygon")
    return (geometry.coordinates as number[][][]).map(ringToD).filter(Boolean).join(" ");
  if (geometry.type === "MultiPolygon")
    return (geometry.coordinates as number[][][][])
      .flatMap((poly: number[][][]) => poly.map(ringToD))
      .filter(Boolean).join(" ");
  return "";
}

// ── City definitions — projected positions ───────────────────────────────────
// All markers are generated dynamically: add a city here and it appears on the map.
interface CityDef { name: string; cx: number; cy: number; primary: boolean; lx: number; ly: number; }

const CITIES: CityDef[] = [
  { name: "Delhi NCR",  cx: 166.7, cy: 151.0, primary: true,  lx:  11, ly: -13 },
  { name: "Mumbai",     cx:  95.7, cy: 336.8, primary: true,  lx:  11, ly: -13 },
  { name: "Bengaluru",  cx: 175.0, cy: 454.8, primary: true,  lx: -83, ly: -13 },
  { name: "Gurugram",   cx: 165.1, cy: 154.8, primary: true,  lx: -76, ly:  18 },
  { name: "Pune",       cx: 113.9, cy: 348.4, primary: false, lx: -51, ly:  17 },
  { name: "Hyderabad",  cx: 189.8, cy: 369.7, primary: false, lx:  11, ly:  17 },
  { name: "Chennai",    cx: 219.6, cy: 452.9, primary: false, lx:  11, ly: -13 },
  { name: "Noida",      cx: 171.7, cy: 154.8, primary: false, lx:  11, ly: -13 },
  { name: "Kolkata",    cx: 353.3, cy: 269.0, primary: false, lx:  11, ly: -13 },
  { name: "Ahmedabad",  cx:  92.4, cy: 261.3, primary: false, lx: -89, ly: -13 },
];

interface Props { cityStats: CityStats[]; }

export default function IndiaMap({ cityStats }: Props) {
  const [paths,    setPaths]    = useState<{ d: string }[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [selected, setSelected] = useState<CityStats | null>(null);

  const statsMap = new Map(cityStats.map(c => [c.city, c]));

  useEffect(() => {
    fetch("/india-states.json")
      .then(r => r.json())
      .then(data => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const computed = data.features.map((f: any) => ({ d: geoToD(f.geometry) })).filter((s: { d: string }) => s.d);
        setPaths(computed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pick = (name: string) => {
    const s = statsMap.get(name) ?? {
      city: name, total: 0, residential: 0, commercial: 0,
      portfolio_value: 0, buy: 0, sell: 0, investment: 0,
    };
    setSelected(prev => prev?.city === name ? null : s);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>

      {/* ── MAP ── */}
      <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>
              Active Coverage · India
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {([ ["var(--ink)", "Primary"], ["var(--faint)", "Active"] ] as const).map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* SVG */}
        <div style={{ padding: "20px 16px 10px", background: "var(--cream)" }}>
          {loading ? (
            <div style={{ height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 22, height: 22, border: "2px solid var(--border)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : (
            <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: "block", maxHeight: 490 }}>
              <defs>
                {/* Glow for selected marker */}
                <filter id="sel-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Very soft glow for primary hubs */}
                <filter id="hub-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Radial gradient for selected city aura */}
                <radialGradient id="sel-aura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--red)" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                </radialGradient>
                {/* Dot texture pattern */}
                <pattern id="dot-tex" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="0.6" fill="rgba(12,12,11,0.06)" />
                </pattern>
                <clipPath id="india-clip">
                  {paths.map((s, i) => <path key={i} d={s.d} />)}
                </clipPath>
              </defs>

              {/* ── State fills ── */}
              {paths.map((s, i) => (
                <path key={i} d={s.d}
                  fill="#EFECE5"
                  stroke="rgba(12,12,11,0.08)"
                  strokeWidth="0.55"
                  strokeLinejoin="round"
                />
              ))}

              {/* ── Dot texture over land ── */}
              <rect x="0" y="0" width={VW} height={VH}
                fill="url(#dot-tex)"
                clipPath="url(#india-clip)" />

              {/* ── City markers (fully dynamic) ── */}
              {CITIES.map(({ name, cx, cy, primary, lx, ly }) => {
                const isSel = selected?.city === name;
                const isHov = hovered === name;
                const r     = primary ? 6 : 4.5;

                return (
                  <g key={name} style={{ cursor: "pointer" }}
                    onClick={() => pick(name)}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}>

                    {/* Soft ambient aura — selected only */}
                    {isSel && (
                      <circle cx={cx} cy={cy} r={28} fill="url(#sel-aura)" />
                    )}

                    {/* Ripple rings — selected only (3 rings staggered) */}
                    {isSel && [0, 0.55, 1.1].map(delay => (
                      <circle key={delay} cx={cx} cy={cy} r={r + 5}
                        fill="none"
                        stroke="var(--red)"
                        strokeWidth="0.9"
                        style={{
                          transformOrigin: `${cx}px ${cy}px`,
                          animation: `mapRipple 2.4s cubic-bezier(0,0.6,0.4,1) infinite ${delay}s`,
                        }} />
                    ))}

                    {/* Hover outer ring */}
                    {isHov && !isSel && (
                      <circle cx={cx} cy={cy} r={r + 9}
                        fill="none"
                        stroke="rgba(12,12,11,0.1)"
                        strokeWidth="0.8"
                        style={{ transition: "opacity 0.2s" }} />
                    )}

                    {/* Medium ring — always visible on primary/hovered/selected */}
                    <circle cx={cx} cy={cy} r={r + 4}
                      fill="none"
                      stroke={isSel ? "rgba(200,16,46,0.3)" : isHov ? "rgba(12,12,11,0.18)" : primary ? "rgba(12,12,11,0.1)" : "rgba(12,12,11,0.05)"}
                      strokeWidth={isSel ? 1.2 : 0.8}
                      style={{ transition: "stroke 0.3s ease" }} />

                    {/* Core dot */}
                    <circle cx={cx} cy={cy} r={isSel ? r + 1 : r}
                      fill={isSel ? "var(--red)" : primary ? "var(--ink)" : "var(--faint)"}
                      stroke="var(--cream)" strokeWidth="2"
                      filter={isSel ? "url(#sel-glow)" : isHov && primary ? "url(#hub-glow)" : undefined}
                      style={{
                        transition: "fill 0.25s ease, r 0.2s ease",
                        animation: isSel ? "pulseDot 2s ease-in-out infinite" : undefined,
                      }} />

                    {/* City label */}
                    <text
                      x={cx + lx} y={cy + ly}
                      fontSize={isHov || isSel ? 10.5 : 9.5}
                      fontWeight={isSel ? "700" : primary ? "600" : "400"}
                      fill={isSel ? "var(--red)" : isHov ? "var(--ink)" : primary ? "var(--ink-2)" : "var(--muted)"}
                      fontFamily="Inter,sans-serif"
                      letterSpacing="0.01em"
                      style={{ transition: "fill 0.2s ease", pointerEvents: "none", userSelect: "none" }}>
                      {name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 10, color: "var(--faint)", fontFamily: "Inter,sans-serif", paddingBottom: 16, letterSpacing: "0.06em" }}>
          Click any city marker to view details
        </p>
      </div>

      {/* ── SIDE PANEL ── */}
      <div style={{ position: "sticky", top: 96 }}>
        {selected ? (
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 40px rgba(12,12,11,0.06)" }}>
            {/* Panel header */}
            <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid var(--border)", background: "var(--cream-2)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 6 }}>City</p>
                <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1 }}>
                  {selected.city}
                </h3>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "var(--faint)", cursor: "pointer", fontFamily: "Inter,sans-serif", marginTop: 4, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.color = "var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--faint)"; }}>
                Close
              </button>
            </div>

            {selected.total === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <div style={{ width: 32, height: 32, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-2)" }} />
                </div>
                <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "var(--ink)", marginBottom: 8 }}>No assignments yet</p>
                <p style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter,sans-serif", lineHeight: 1.65 }}>Upload valuation data to populate this city&apos;s analytics.</p>
              </div>
            ) : (
              <div style={{ padding: "16px 20px 20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>Total Valuations</span>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 36, fontWeight: 400, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{selected.total}</span>
                </div>

                {[
                  { label: "Residential",    value: String(selected.residential) },
                  { label: "Commercial",     value: String(selected.commercial) },
                  { label: "Portfolio",      value: formatCrore(selected.portfolio_value), em: true },
                  { label: "Buy",            value: String(selected.buy) },
                  { label: "Sell",           value: String(selected.sell) },
                  { label: "Investment",     value: String(selected.investment) },
                ].map(({ label, value, em }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--cream-2)" }}>
                    <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>{label}</span>
                    <span style={{ fontSize: em ? 14 : 13, fontWeight: em ? 600 : 500, color: em ? "var(--ink)" : "var(--muted)", fontFamily: "Inter,sans-serif" }}>{value}</span>
                  </div>
                ))}

                {selected.total > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 10 }}>Recommendation Split</p>
                    {[
                      { label: "Buy",        val: selected.buy,       color: "#10B981" },
                      { label: "Sell",       val: selected.sell,      color: "var(--red)" },
                      { label: "Investment", val: selected.investment, color: "#F59E0B" },
                    ].map(b => (
                      <div key={b.label} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "Inter,sans-serif" }}>
                          <span style={{ color: "var(--faint)" }}>{b.label}</span>
                          <span style={{ color: "var(--muted)", fontWeight: 500 }}>
                            {selected.total > 0 ? Math.round(b.val / selected.total * 100) : 0}%
                          </span>
                        </div>
                        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: b.color, borderRadius: 2, width: `${selected.total > 0 ? b.val / selected.total * 100 : 0}%`, transition: "width 0.7s cubic-bezier(0.76,0,0.24,1)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div style={{ background: "var(--cream-2)", border: "1px dashed var(--border-2)", borderRadius: 18, padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: "var(--white)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Select a City</p>
            <p style={{ fontSize: 13, color: "var(--faint)", fontFamily: "Inter,sans-serif", lineHeight: 1.65 }}>Click any marker on the map to view coverage details.</p>

            {cityStats.filter(c => c.total > 0).length > 0 && (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 4 }}>Active Markets</p>
                {cityStats.filter(c => c.total > 0).slice(0, 5).map(c => (
                  <button key={c.city} onClick={() => setSelected(c)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 9, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--ink)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", fontFamily: "Inter,sans-serif" }}>{c.city}</span>
                    <span style={{ fontSize: 11, color: "var(--faint)", fontFamily: "DM Mono,monospace" }}>{c.total}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyframes for ripple + pulse animations */}
      <style>{`
        @keyframes mapRipple {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3.8); opacity: 0; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.75; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
