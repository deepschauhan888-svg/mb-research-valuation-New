"use client";
import { useState, useEffect, useRef } from "react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

// ── Projection (matches india-states.json bounds) ───────────────────────────
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
  if (geometry.type === "Polygon") {
    return (geometry.coordinates as number[][][]).map(ringToD).filter(Boolean).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as number[][][][])
      .flatMap((poly: number[][][]) => poly.map(ringToD))
      .filter(Boolean).join(" ");
  }
  return "";
}

// ── City definitions (pre-projected) ────────────────────────────────────────
interface CityDef { name: string; cx: number; cy: number; primary: boolean; lx: number; ly: number; }
const CITIES: CityDef[] = [
  { name: "Delhi NCR",  cx: 166.7, cy: 151.0, primary: true,  lx:  10, ly: -13 },
  { name: "Mumbai",     cx:  95.7, cy: 336.8, primary: true,  lx:  11, ly: -13 },
  { name: "Bengaluru",  cx: 175.0, cy: 454.8, primary: true,  lx: -84, ly: -13 },
  { name: "Gurugram",   cx: 165.1, cy: 154.8, primary: true,  lx: -78, ly:  18 },
  { name: "Pune",       cx: 113.9, cy: 348.4, primary: false, lx: -52, ly:  17 },
  { name: "Hyderabad",  cx: 189.8, cy: 369.7, primary: false, lx:  11, ly:  17 },
  { name: "Chennai",    cx: 219.6, cy: 452.9, primary: false, lx:  11, ly: -13 },
  { name: "Noida",      cx: 171.7, cy: 154.8, primary: false, lx:  11, ly: -13 },
  { name: "Kolkata",    cx: 353.3, cy: 269.0, primary: false, lx:  11, ly: -13 },
  { name: "Ahmedabad",  cx:  92.4, cy: 261.3, primary: false, lx: -90, ly: -13 },
];

// Mumbai is the hub for connection lines
const HUB = CITIES.find(c => c.name === "Mumbai")!;
// India visual center (for quadratic bezier control point)
const CENTER_X = 214.6, CENTER_Y = 280.6;

// Compute quadratic bezier control point: midpoint pulled toward India center
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Pull 28% toward the center to create an inward curve
  const cx = mx + (CENTER_X - mx) * 0.28;
  const cy = my + (CENTER_Y - my) * 0.28;
  return `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}`;
}

interface StatePath { d: string; }
interface Props { cityStats: CityStats[]; }

export default function IndiaMap({ cityStats }: Props) {
  const [paths,    setPaths]    = useState<StatePath[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [selected, setSelected] = useState<CityStats | null>(null);
  const lineRefs  = useRef<(SVGPathElement | null)[]>([]);

  const statsMap = new Map(cityStats.map(c => [c.city, c]));

  // Fetch + project state boundaries
  useEffect(() => {
    fetch("/india-states.json")
      .then(r => r.json())
      .then(data => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const computed: StatePath[] = data.features.map((f: any) => ({ d: geoToD(f.geometry) })).filter((s: StatePath) => s.d);
        setPaths(computed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Animate connection lines in after map loads
  useEffect(() => {
    if (loading) return;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength?.() ?? 300;
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.transition = `stroke-dashoffset 1.2s cubic-bezier(0.76,0,0.24,1) ${i*0.1+0.6}s, opacity 0.3s ease ${i*0.1+0.4}s`;
        el.style.strokeDashoffset = "0";
        el.style.opacity = "1";
      }, 50);
    });
  }, [loading]);

  const pick = (name: string) => {
    const s = statsMap.get(name) ?? { city: name, total: 0, residential: 0, commercial: 0, portfolio_value: 0, buy: 0, sell: 0, investment: 0 };
    setSelected(prev => prev?.city === name ? null : s);
  };

  // Connection lines: hub (Mumbai) → every other city
  const connections = CITIES.filter(c => c.name !== HUB.name);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>

      {/* ── MAP CARD ── */}
      <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", position: "relative" }}>

        {/* Card header */}
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>Active Coverage · India</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {([["var(--ink)", "Primary"], ["var(--faint)", "Active"]] as const).map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* SVG Map */}
        <div style={{ padding: "20px 16px 12px", background: "var(--cream)" }}>
          {loading ? (
            <div style={{ height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : (
            <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: "block", maxHeight: 500 }}>
              <defs>
                <filter id="city-glow-red">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="city-glow-dark">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="sel-aura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--red)" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="var(--red)" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* ── State fills & borders ── */}
              {paths.map((s, i) => (
                <path key={i} d={s.d}
                  fill="#F0EDE6"
                  stroke="rgba(12,12,11,0.09)"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
              ))}

              {/* ── Subtle inner dot texture ── */}
              <defs>
                <pattern id="dot-tex" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="0.6" fill="rgba(12,12,11,0.055)"/>
                </pattern>
                <clipPath id="india-clip">
                  {paths.map((s, i) => <path key={i} d={s.d}/>)}
                </clipPath>
              </defs>
              <rect x="0" y="0" width={VW} height={VH} fill="url(#dot-tex)" clipPath="url(#india-clip)"/>

              {/* ── Connection lines (hub → cities) ── */}
              {connections.map((city, i) => {
                const isSelCity = selected?.city === city.name;
                const isHubSel  = selected?.city === HUB.name;
                const isHovCity = hovered === city.name || hovered === HUB.name;
                const active = isSelCity || isHubSel || isHovCity;
                return (
                  <path
                    key={city.name}
                    ref={el => { lineRefs.current[i] = el; }}
                    d={curvePath(HUB.cx, HUB.cy, city.cx, city.cy)}
                    fill="none"
                    stroke="var(--red)"
                    strokeWidth={active ? 1.2 : 0.8}
                    strokeDasharray={active ? "5 4" : "4 5"}
                    opacity={active ? 0.55 : 0.22}
                    style={{ transition: "opacity 0.35s ease, stroke-width 0.25s ease" }}
                  />
                );
              })}

              {/* ── City markers ── */}
              {CITIES.map(city => {
                const { name, cx, cy, primary, lx, ly } = city;
                const isHov = hovered === name;
                const isSel = selected?.city === name;
                const isHub = name === HUB.name;
                const r     = primary ? 6 : 4.5;

                return (
                  <g key={name} style={{ cursor: "pointer" }}
                    onClick={() => pick(name)}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}>

                    {/* Radial aura for selected or hub */}
                    {(isSel || (isHub && !selected)) && (
                      <circle cx={cx} cy={cy} r={22} fill="url(#sel-aura)"/>
                    )}

                    {/* Outer hover ring */}
                    {isHov && (
                      <circle cx={cx} cy={cy} r={r + 10} fill="none"
                        stroke={isSel ? "var(--red)" : "rgba(12,12,11,0.12)"}
                        strokeWidth="0.8"/>
                    )}

                    {/* Middle ring (always visible on primary/selected) */}
                    <circle cx={cx} cy={cy} r={r + 4} fill="none"
                      stroke={isSel ? "rgba(200,16,46,0.35)" : isHub ? "rgba(12,12,11,0.15)" : "rgba(12,12,11,0.08)"}
                      strokeWidth={isSel ? 1.2 : 0.8}
                      style={{ transition: "stroke 0.25s ease, stroke-opacity 0.25s ease" }}/>

                    {/* Core dot */}
                    <circle cx={cx} cy={cy} r={r}
                      fill={isSel ? "var(--red)" : primary ? "var(--ink)" : "var(--faint)"}
                      stroke="var(--cream)" strokeWidth="2"
                      filter={isSel ? "url(#city-glow-red)" : isHub ? "url(#city-glow-dark)" : undefined}
                      style={{ transition: "fill 0.25s ease, r 0.2s ease" }}/>

                    {/* Label */}
                    <text x={cx + lx} y={cy + ly}
                      fontSize={isHov || isSel ? 10 : 9}
                      fontWeight={isSel ? "700" : primary ? "600" : "500"}
                      fill={isSel ? "var(--red)" : isHov ? "var(--ink)" : primary ? "var(--ink-2)" : "var(--muted)"}
                      fontFamily="Inter,sans-serif"
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
            <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid var(--border)", background: "var(--cream-2)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 5 }}>City</p>
                <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1 }}>{selected.city}</h3>
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
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-2)" }}/>
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
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 10 }}>Split</p>
                    {[
                      { label: "Buy",        val: selected.buy,        color: "#10B981" },
                      { label: "Sell",       val: selected.sell,       color: "var(--red)" },
                      { label: "Investment", val: selected.investment,  color: "#F59E0B" },
                    ].map(b => (
                      <div key={b.label} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "Inter,sans-serif" }}>
                          <span style={{ color: "var(--faint)" }}>{b.label}</span>
                          <span style={{ color: "var(--muted)", fontWeight: 500 }}>{selected.total > 0 ? Math.round(b.val / selected.total * 100) : 0}%</span>
                        </div>
                        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: b.color, borderRadius: 2, width: `${selected.total > 0 ? b.val / selected.total * 100 : 0}%`, transition: "width 0.7s cubic-bezier(0.76,0,0.24,1)" }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "var(--cream-2)", border: "1px dashed var(--border-2)", borderRadius: 18, padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: "var(--white)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }}/>
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

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
