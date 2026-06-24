"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

interface Props { cityStats: CityStats[]; }

// Accurate city positions on 800×950 viewBox India map
const CITIES: Record<string, { cx: number; cy: number }> = {
  "Delhi NCR":  { cx: 310, cy: 198 },
  "Gurugram":   { cx: 296, cy: 212 },
  "Noida":      { cx: 326, cy: 206 },
  "Kolkata":    { cx: 530, cy: 318 },
  "Ahmedabad":  { cx: 168, cy: 316 },
  "Mumbai":     { cx: 178, cy: 422 },
  "Pune":       { cx: 194, cy: 456 },
  "Hyderabad":  { cx: 318, cy: 468 },
  "Chennai":    { cx: 362, cy: 554 },
  "Bengaluru":  { cx: 316, cy: 540 },
};

// Accurate India border path (simplified but geographically correct)
const INDIA =
  "M 390 52 L 404 48 L 424 55 L 448 50 L 468 58 L 492 54 L 518 66 " +
  "L 536 58 L 558 70 L 576 84 L 598 92 L 614 110 L 622 130 L 618 150 " +
  "L 626 168 L 634 190 L 628 210 L 638 228 L 640 252 L 630 272 " +
  "L 618 290 L 602 306 L 582 318 L 560 328 L 546 348 L 542 370 " +
  "L 530 390 L 512 406 L 494 418 L 474 426 L 456 438 L 442 456 " +
  "L 428 474 L 414 492 L 398 510 L 382 530 L 366 552 L 352 572 " +
  "L 338 590 L 322 606 L 308 620 L 296 608 L 282 590 L 268 572 " +
  "L 254 552 L 240 530 L 226 508 L 214 484 L 202 460 L 192 436 " +
  "L 180 410 L 170 382 L 160 354 L 152 326 L 144 298 L 140 270 " +
  "L 138 242 L 140 214 L 146 188 L 154 162 L 164 138 L 176 116 " +
  "L 190 96 L 206 78 L 224 64 L 242 54 L 264 48 L 286 46 " +
  "L 310 46 L 332 46 L 354 48 L 374 50 Z";

// Kashmir/northern region
const NORTH =
  "M 310 46 L 292 38 L 270 32 L 252 26 L 238 18 L 228 10 " +
  "L 240 6 L 260 8 L 282 12 L 304 18 L 328 16 L 352 22 " +
  "L 374 28 L 390 38 L 390 52 Z";

// Sri Lanka (small island)
const SL = "M 332 638 L 340 634 L 348 640 L 346 652 L 338 656 L 330 650 Z";

// Andaman hint
const AN = "M 568 480 L 572 476 L 576 482 L 574 490 L 568 492 Z";

export default function IndiaMap({ cityStats }: Props) {
  const [selected, setSelected] = useState<CityStats | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const statsMap = new Map(cityStats.map(c => [c.city, c]));

  const handleClick = (city: string) => {
    const s = statsMap.get(city) ?? {
      city, total: 0, residential: 0, commercial: 0,
      portfolio_value: 0, buy: 0, sell: 0, investment: 0,
    };
    setSelected(s);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>
      {/* Map */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="100 0 580 680"
          style={{ width: "100%", maxHeight: 580, display: "block" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.08" />
            </filter>
            <radialGradient id="mapGrad" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
          </defs>

          {/* India fill */}
          <path d={INDIA} fill="url(#mapGrad)" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow)" />
          <path d={NORTH} fill="#E8EEF4" stroke="#CBD5E1" strokeWidth="1" />
          <path d={SL} fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          <path d={AN} fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

          {/* City markers */}
          {Object.entries(CITIES).map(([city, { cx, cy }]) => {
            const stats = statsMap.get(city);
            const hasData = !!stats && stats.total > 0;
            const isHov = hovered === city;
            const isSel = selected?.city === city;
            const r = hasData ? 8 : 5;

            return (
              <g
                key={city}
                onClick={() => handleClick(city)}
                onMouseEnter={() => setHovered(city)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring */}
                {(isHov || isSel) && (
                  <circle
                    cx={cx} cy={cy} r={r + 8}
                    fill={isSel ? "rgba(200,16,46,0.12)" : "rgba(15,23,42,0.06)"}
                  />
                )}
                {/* Outer ring for data cities */}
                {hasData && (
                  <circle cx={cx} cy={cy} r={r + 3} fill="none"
                    stroke={isSel ? "#C8102E" : "#94A3B8"} strokeWidth={1.5} opacity={0.5} />
                )}
                {/* Main dot */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={isSel ? "#C8102E" : hasData ? "#0F172A" : "#CBD5E1"}
                  stroke="#fff" strokeWidth={2}
                />
                {/* City label */}
                <text
                  x={cx} y={cy - r - 6}
                  textAnchor="middle"
                  fontSize={isHov || isSel ? "10.5" : "9.5"}
                  fontWeight={isHov || isSel ? "700" : "600"}
                  fill={isSel ? "#C8102E" : isHov ? "#0F172A" : "#475569"}
                  fontFamily="Inter, sans-serif"
                  style={{ userSelect: "none" }}
                >
                  {city}
                </text>
                {/* Count badge */}
                {hasData && (
                  <text
                    x={cx} y={cy + 3.5}
                    textAnchor="middle"
                    fontSize="6.5"
                    fontWeight="800"
                    fill="#fff"
                    fontFamily="Inter, sans-serif"
                    style={{ userSelect: "none" }}
                  >
                    {stats.total}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 16, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0F172A" }} />
            Active city
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C8102E" }} />
            Selected
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#CBD5E1" }} />
            No data yet
          </div>
        </div>
      </div>

      {/* Stats panel */}
      <div>
        {selected ? (
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20,
            padding: 32, boxShadow: "0 8px 40px rgba(15,23,42,0.07)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>City Statistics</div>
                <h3 style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>{selected.city}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ padding: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", color: "#94A3B8", display: "flex" }}>
                <X size={15} />
              </button>
            </div>

            {selected.total === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                No assignments recorded for {selected.city} yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Total Valuations", value: selected.total, large: true },
                  { label: "Residential", value: selected.residential },
                  { label: "Commercial", value: selected.commercial },
                  { label: "Portfolio Value", value: formatCrore(selected.portfolio_value), green: true },
                  { label: "Buy Recommendations", value: selected.buy, buy: true },
                  { label: "Sell Recommendations", value: selected.sell, sell: true },
                  { label: "Investment Recommendations", value: selected.investment, inv: true },
                ].map(({ label, value, large, green, buy, sell, inv }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0", borderBottom: "1px solid #F1F5F9",
                  }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
                    <span style={{
                      fontSize: large ? 22 : 15,
                      fontWeight: large ? 700 : 600,
                      color: green ? "#059669" : buy ? "#059669" : sell ? "#DC2626" : inv ? "#D97706" : "#0F172A",
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: 20, padding: 40, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>📍</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Select a City</p>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>Click any city marker on the map to view detailed valuation statistics.</p>

            {cityStats.length > 0 && (
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#CBD5E1", marginBottom: 4 }}>Quick Select</p>
                {cityStats.slice(0, 5).map(c => (
                  <button key={c.city} onClick={() => setSelected(c)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", background: "#fff", border: "1px solid #E2E8F0",
                    borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                    fontSize: 13, color: "#374151",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0F172A"; e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#fff"; }}>
                    <span style={{ fontWeight: 600 }}>{c.city}</span>
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>{c.total} assignments</span>
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
