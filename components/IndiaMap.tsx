"use client";
import { useState, useRef, useEffect } from "react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

interface Props { cityStats: CityStats[]; }

/* ── Premium India SVG paths (simplified, accurate outline) ── */
const INDIA_OUTLINE = "M 338 42 C 348 38 362 40 374 44 C 388 48 402 50 416 46 C 432 42 448 44 460 52 C 474 60 488 56 502 62 C 516 68 528 78 536 92 C 544 106 548 122 546 138 C 544 154 538 168 536 184 C 534 200 538 216 542 230 C 546 244 548 260 544 274 C 540 288 530 298 520 310 C 510 322 498 332 486 344 C 474 356 462 368 452 382 C 442 396 434 412 426 428 C 418 444 410 460 402 476 C 394 492 386 508 380 524 C 374 540 370 558 364 574 C 358 590 352 606 346 618 C 340 630 334 618 328 606 C 322 594 316 580 308 566 C 300 552 290 538 280 524 C 270 510 260 496 252 480 C 244 464 238 446 232 430 C 226 414 220 396 216 378 C 212 360 210 342 208 324 C 206 306 204 288 204 270 C 204 252 206 234 210 216 C 214 198 220 182 228 166 C 236 150 244 136 250 120 C 256 104 258 88 264 72 C 270 56 280 44 294 42 C 308 40 322 44 338 42 Z";

/* State fill paths — simplified decorative regions */
const STATE_REGIONS = [
  { d: "M 294 42 C 308 40 322 44 338 42 C 332 60 320 72 306 78 C 292 84 278 82 268 72 C 274 58 284 46 294 42 Z", fill: "rgba(200,16,46,0.04)" },
  { d: "M 338 42 C 348 38 362 40 374 44 C 380 58 378 74 368 84 C 358 94 344 96 332 90 C 326 76 330 58 338 42 Z", fill: "rgba(200,16,46,0.03)" },
  { d: "M 374 44 C 402 50 428 44 460 52 C 468 68 464 88 452 98 C 440 108 424 108 410 100 C 396 92 386 78 380 64 C 376 56 374 50 374 44 Z", fill: "rgba(255,255,255,0.02)" },
  { d: "M 460 52 C 488 56 516 68 536 92 C 530 110 516 122 500 126 C 484 130 468 124 456 112 C 444 100 442 84 452 70 C 456 62 458 56 460 52 Z", fill: "rgba(200,16,46,0.025)" },
  { d: "M 204 270 C 204 252 206 234 210 216 C 228 218 244 228 252 244 C 260 260 258 278 246 290 C 234 302 218 302 208 292 C 206 284 204 278 204 270 Z", fill: "rgba(255,255,255,0.02)" },
  { d: "M 536 184 C 542 200 548 218 546 234 C 530 238 514 232 504 220 C 494 208 494 192 506 182 C 518 172 532 174 536 184 Z", fill: "rgba(200,16,46,0.02)" },
];

/* ── City coordinates (mapped to the SVG viewBox 200×640, viewport 820px wide) ── */
const CITIES: { name: string; cx: number; cy: number; labelX: number; labelY: number; primary: boolean }[] = [
  { name: "Delhi NCR",  cx: 354, cy: 148, labelX:  10, labelY: -14, primary: true  },
  { name: "Mumbai",     cx: 234, cy: 376, labelX: -90, labelY: -12, primary: true  },
  { name: "Bengaluru",  cx: 340, cy: 510, labelX:  10, labelY: -12, primary: true  },
  { name: "Gurugram",   cx: 344, cy: 158, labelX:  10, labelY:  18, primary: true  },
  { name: "Pune",       cx: 244, cy: 408, labelX: -66, labelY:  18, primary: false },
  { name: "Hyderabad",  cx: 362, cy: 458, labelX:  10, labelY:  18, primary: false },
  { name: "Chennai",    cx: 390, cy: 518, labelX:  10, labelY: -12, primary: false },
  { name: "Noida",      cx: 364, cy: 142, labelX:  10, labelY: -12, primary: false },
  { name: "Kolkata",    cx: 486, cy: 308, labelX:  10, labelY: -12, primary: false },
  { name: "Ahmedabad",  cx: 224, cy: 298, labelX: -92, labelY: -12, primary: false },
];

/* ── Decorative connection lines between clustered cities ── */
const CONNECTIONS = [
  { x1: 354, y1: 148, x2: 344, y2: 158 }, // Delhi — Gurugram
  { x1: 344, y1: 158, x2: 364, y2: 142 }, // Gurugram — Noida
  { x1: 234, y1: 376, x2: 244, y2: 408 }, // Mumbai — Pune
  { x1: 340, y1: 510, x2: 390, y2: 518 }, // Bengaluru — Chennai
  { x1: 340, y1: 510, x2: 362, y2: 458 }, // Bengaluru — Hyderabad
];

export default function IndiaMap({ cityStats }: Props) {
  const [selected, setSelected] = useState<CityStats | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const statsMap = new Map(cityStats.map(c => [c.city, c]));

  const pick = (name: string) => {
    const s = statsMap.get(name) ?? { city: name, total: 0, residential: 0, commercial: 0, portfolio_value: 0, buy: 0, sell: 0, investment: 0 };
    setSelected(prev => prev?.city === name ? null : s);
  };

  /* Animate connection lines in on mount */
  useEffect(() => {
    const lines = svgRef.current?.querySelectorAll(".conn-line") as NodeListOf<SVGLineElement>;
    if (!lines) return;
    lines.forEach((l, i) => {
      const len = Math.hypot(
        parseFloat(l.getAttribute("x2")!) - parseFloat(l.getAttribute("x1")!),
        parseFloat(l.getAttribute("y2")!) - parseFloat(l.getAttribute("y1")!)
      );
      l.style.strokeDasharray = `${len}`;
      l.style.strokeDashoffset = `${len}`;
      setTimeout(() => { l.style.transition = `stroke-dashoffset 1s cubic-bezier(0.76,0,0.24,1) ${i * 0.12 + 0.8}s`; l.style.strokeDashoffset = "0"; }, 10);
    });
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>

      {/* ── MAP ── */}
      <div style={{ background: "var(--cream-2)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", position: "relative" }}>

        {/* Header strip */}
        <div style={{ padding: "16px 24px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>Active Coverage</span>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {[["var(--ink)","Primary market"],["var(--border-2)","Active market"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* SVG Map */}
        <div style={{ padding: "24px 24px 16px", display: "flex", justifyContent: "center" }}>
          <svg
            ref={svgRef}
            viewBox="160 30 400 640"
            width="100%"
            style={{ maxHeight: 520, display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glow filter for selected city */}
              <filter id="city-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Subtle country shadow */}
              <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="rgba(12,12,11,0.1)" />
              </filter>
              {/* Red glow for selected */}
              <filter id="red-glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Radial gradient for selection ring */}
              <radialGradient id="sel-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--red)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Country fill */}
            <path d={INDIA_OUTLINE} fill="var(--white)" stroke="var(--border-2)" strokeWidth="1.2"
              strokeLinejoin="round" strokeLinecap="round" filter="url(#map-shadow)" />

            {/* Decorative state regions */}
            {STATE_REGIONS.map((r, i) => (
              <path key={i} d={r.d} fill={r.fill} />
            ))}

            {/* Subtle dot-grid texture over map */}
            <path d={INDIA_OUTLINE} fill="none"
              stroke="none" />
            {/* Internal grid pattern */}
            <defs>
              <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.7" fill="rgba(12,12,11,0.07)" />
              </pattern>
              <clipPath id="india-clip">
                <path d={INDIA_OUTLINE} />
              </clipPath>
            </defs>
            <rect x="160" y="30" width="400" height="640" fill="url(#dots)" clipPath="url(#india-clip)" />

            {/* Connection lines */}
            {CONNECTIONS.map((c, i) => (
              <line key={i} className="conn-line"
                x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                stroke="rgba(200,16,46,0.2)" strokeWidth="0.8" strokeLinecap="round" />
            ))}

            {/* City markers */}
            {CITIES.map(city => {
              const { name, cx, cy, labelX, labelY, primary } = city;
              const isHov = hovered === name;
              const isSel = selected?.city === name;
              const r = primary ? 6 : 5;

              return (
                <g key={name}
                  style={{ cursor: "pointer" }}
                  onClick={() => pick(name)}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}>

                  {/* Glow ring — selected */}
                  {isSel && (
                    <circle cx={cx} cy={cy} r={24} fill="url(#sel-grad)" />
                  )}

                  {/* Outer pulse ring — hover */}
                  {isHov && !isSel && (
                    <circle cx={cx} cy={cy} r={r + 10}
                      fill="none" stroke={primary ? "var(--ink)" : "var(--border-2)"} strokeWidth="0.8" opacity={0.4} />
                  )}

                  {/* Medium ring */}
                  <circle cx={cx} cy={cy} r={r + 4}
                    fill="none"
                    stroke={isSel ? "var(--red)" : primary ? "rgba(12,12,11,0.25)" : "rgba(12,12,11,0.12)"}
                    strokeWidth={isSel ? 1.5 : 0.8}
                    style={{ transition: "stroke 0.25s ease" }} />

                  {/* Main dot */}
                  <circle cx={cx} cy={cy} r={r}
                    fill={isSel ? "var(--red)" : primary ? "var(--ink)" : "var(--faint)"}
                    stroke="var(--cream-2)" strokeWidth="2"
                    filter={isSel ? "url(#red-glow)" : undefined}
                    style={{ transition: "fill 0.25s ease, r 0.25s ease" }} />

                  {/* City label */}
                  <text
                    x={cx + labelX}
                    y={cy + labelY}
                    fontSize={isHov || isSel ? 10 : 9}
                    fontWeight={isSel ? 700 : primary ? 600 : 500}
                    fill={isSel ? "var(--red)" : isHov ? "var(--ink)" : primary ? "var(--ink-2)" : "var(--faint)"}
                    fontFamily="Inter,sans-serif"
                    style={{ transition: "fill 0.2s ease, font-size 0.2s ease", pointerEvents: "none", userSelect: "none" }}>
                    {name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--faint)", fontFamily: "Inter,sans-serif", paddingBottom: 18 }}>
          Click any city to view coverage details
        </p>
      </div>

      {/* ── SIDE PANEL ── */}
      <div style={{ position: "sticky", top: 96 }}>
        {selected ? (
          <div style={{
            background: "var(--white)", border: "1px solid var(--border)", borderRadius: 18,
            overflow: "hidden", boxShadow: "0 8px 40px rgba(12,12,11,0.06)",
          }}>
            {/* Panel header */}
            <div style={{ padding: "20px 22px 18px", borderBottom: "1px solid var(--border)", background: "var(--cream-2)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 5 }}>Selected City</p>
                <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.015em" }}>{selected.city}</h3>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "5px 10px", fontSize: 11, color: "var(--faint)", cursor: "pointer", fontFamily: "Inter,sans-serif", marginTop: 4 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.color = "var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--faint)"; }}>
                Close
              </button>
            </div>

            {selected.total === 0 ? (
              <div style={{ padding: "32px 22px", textAlign: "center" }}>
                <div style={{ width: 36, height: 36, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-2)" }} />
                </div>
                <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif", fontWeight: 400, marginBottom: 6 }}>No assignments yet</p>
                <p style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>Upload valuation data to populate city-level analytics.</p>
              </div>
            ) : (
              <div style={{ padding: "18px 22px 22px" }}>
                {/* Total */}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--faint)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>Total Valuations</span>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 36, fontWeight: 400, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{selected.total}</span>
                </div>

                {/* Stats list */}
                {[
                  { label: "Residential",     value: String(selected.residential),          },
                  { label: "Commercial",       value: String(selected.commercial),           },
                  { label: "Portfolio Value",  value: formatCrore(selected.portfolio_value), emphasis: true },
                  { label: "Buy",              value: String(selected.buy),                  },
                  { label: "Sell",             value: String(selected.sell),                 },
                  { label: "Investment",       value: String(selected.investment),           },
                ].map(({ label, value, emphasis }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--cream-2)" }}>
                    <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>{label}</span>
                    <span style={{ fontSize: emphasis ? 15 : 13, fontWeight: emphasis ? 600 : 500, color: emphasis ? "var(--ink)" : "var(--muted)", fontFamily: "Inter,sans-serif" }}>{value}</span>
                  </div>
                ))}

                {/* Mini split bars */}
                {selected.total > 0 && (
                  <div style={{ marginTop: 18 }}>
                    <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 10 }}>Recommendation Split</p>
                    {[
                      { label: "Buy",        val: selected.buy,        color: "#10B981" },
                      { label: "Sell",       val: selected.sell,       color: "var(--red)" },
                      { label: "Investment", val: selected.investment,  color: "#F59E0B" },
                    ].map(b => (
                      <div key={b.label} style={{ marginBottom: 7 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "Inter,sans-serif" }}>
                          <span style={{ color: "var(--faint)" }}>{b.label}</span>
                          <span style={{ color: "var(--muted)", fontWeight: 500 }}>{selected.total > 0 ? Math.round(b.val / selected.total * 100) : 0}%</span>
                        </div>
                        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: b.color, borderRadius: 2, width: `${selected.total > 0 ? b.val / selected.total * 100 : 0}%`, transition: "width 0.6s cubic-bezier(0.76,0,0.24,1)" }} />
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
          <div style={{ background: "var(--cream-2)", border: "1px dashed var(--border-2)", borderRadius: 18, padding: "36px 28px", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", background: "var(--white)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Select a City</p>
            <p style={{ fontSize: 13, color: "var(--faint)", fontFamily: "Inter,sans-serif", lineHeight: 1.65 }}>Click any marker on the map to view coverage details for that city.</p>

            {/* Quick links */}
            {cityStats.filter(c => c.total > 0).length > 0 && (
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", fontFamily: "Inter,sans-serif", marginBottom: 4 }}>Active Markets</p>
                {cityStats.filter(c => c.total > 0).slice(0, 5).map(c => (
                  <button key={c.city} onClick={() => setSelected(c)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 9, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", fontFamily: "Inter,sans-serif" }}>{c.city}</span>
                    <span style={{ fontSize: 11, color: "var(--faint)", fontFamily: "DM Mono,monospace" }}>{c.total}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
