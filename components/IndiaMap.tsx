"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { X } from "lucide-react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

interface Props { cityStats: CityStats[]; }

const CITIES: { name: string; coordinates: [number, number]; offset: [number, number] }[] = [
  { name: "Mumbai",    coordinates: [72.877, 19.076],  offset: [-66, -14] },
  { name: "Delhi NCR", coordinates: [77.209, 28.614],  offset: [12,  -16] },
  { name: "Bengaluru", coordinates: [77.594, 12.972],  offset: [12,  -14] },
  { name: "Pune",      coordinates: [73.856, 18.520],  offset: [12,  -14] },
  { name: "Hyderabad", coordinates: [78.474, 17.385],  offset: [12,  -14] },
  { name: "Chennai",   coordinates: [80.270, 13.082],  offset: [12,  -14] },
  { name: "Kolkata",   coordinates: [88.363, 22.572],  offset: [12,  -14] },
  { name: "Ahmedabad", coordinates: [72.585, 23.033],  offset: [-76, -14] },
  { name: "Gurugram",  coordinates: [77.026, 28.459],  offset: [12,  18]  },
  { name: "Noida",     coordinates: [77.391, 28.535],  offset: [12,  -14] },
];

export default function IndiaMap({ cityStats }: Props) {
  const [selected, setSelected] = useState<CityStats | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [tooltip,  setTooltip]  = useState<{ name: string; x: number; y: number } | null>(null);

  const statsMap = new Map(cityStats.map(c => [c.city, c]));

  const pick = (name: string) => {
    const s = statsMap.get(name) ?? { city: name, total: 0, residential: 0, commercial: 0, portfolio_value: 0, buy: 0, sell: 0, investment: 0 };
    setSelected(s);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

      {/* Map card */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>India Coverage Map</p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>Click any city marker to view detailed statistics</p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[["#0F172A","Active city"],["#C8102E","Selected"],["#CBD5E1","No data"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#64748B" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", background: "#F8FAFC" }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [82.5, 22], scale: 1100 }}
            width={680} height={580}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={1}>
              <Geographies geography="/india-states.json">
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo}
                      style={{
                        default: { fill: "#EEF2F7", stroke: "#CBD5E1", strokeWidth: 0.6, outline: "none" },
                        hover:   { fill: "#E2E8F0", stroke: "#94A3B8", strokeWidth: 0.6, outline: "none" },
                        pressed: { fill: "#E2E8F0", stroke: "#94A3B8", strokeWidth: 0.6, outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {CITIES.map(({ name, coordinates, offset }) => {
                const stats   = statsMap.get(name);
                const hasData = !!stats && stats.total > 0;
                const isSel   = selected?.city === name;
                const isHov   = hovered === name;
                const r       = hasData ? 7 : 5;
                const fill    = isSel ? "#C8102E" : hasData ? "#0F172A" : "#94A3B8";

                return (
                  <Marker key={name} coordinates={coordinates}
                    onClick={() => pick(name)}
                    onMouseEnter={(e: React.MouseEvent) => {
                      setHovered(name);
                      const svg = (e.target as Element).closest("svg");
                      const rect = svg?.getBoundingClientRect();
                      if (rect) setTooltip({ name, x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                    onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                    style={{ cursor: "pointer" }}
                  >
                    {(isHov || isSel) && <circle r={r + 9} fill={isSel ? "rgba(200,16,46,0.14)" : "rgba(15,23,42,0.07)"} />}
                    {hasData && <circle r={r + 4} fill="none" stroke={isHov ? "#0F172A" : "#94A3B8"} strokeWidth={1} opacity={0.35} />}
                    <circle r={r} fill={fill} stroke="#fff" strokeWidth={2} />
                    {hasData && (
                      <text textAnchor="middle" y={r - 2}
                        style={{ fontSize: 6, fontWeight: 800, fill: "#fff", fontFamily: "Inter,sans-serif", pointerEvents: "none", userSelect: "none" }}>
                        {stats.total}
                      </text>
                    )}
                    <text x={offset[0]} y={offset[1]}
                      style={{
                        fontSize: isHov || isSel ? 10.5 : 9.5,
                        fontWeight: isHov || isSel ? 700 : 600,
                        fill: isSel ? "#C8102E" : isHov ? "#0F172A" : "#475569",
                        fontFamily: "Inter,sans-serif",
                        pointerEvents: "none", userSelect: "none",
                      }}
                    >{name}</text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && hovered && (
            <div style={{ position:"absolute", left: tooltip.x+14, top: tooltip.y-10, background:"#0F172A", color:"#fff", padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, pointerEvents:"none", whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(15,23,42,0.2)", zIndex:20 }}>
              {hovered}
              {(() => { const s = statsMap.get(hovered); return s?.total ? ` · ${s.total} assignments` : " · No data"; })()}
            </div>
          )}
        </div>
      </div>

      {/* Stats panel */}
      <div style={{ position: "sticky", top: 88 }}>
        {selected ? (
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:20, overflow:"hidden", boxShadow:"0 4px 32px rgba(15,23,42,0.07)" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #F1F5F9", background:"#F8FAFC", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94A3B8", marginBottom:4 }}>City Statistics</p>
                <h3 style={{ fontSize:22, fontWeight:800, color:"#0F172A", letterSpacing:"-0.02em" }}>{selected.city}</h3>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ padding:7, background:"#fff", border:"1px solid #E2E8F0", borderRadius:8, cursor:"pointer", color:"#94A3B8", display:"flex", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="#F1F5F9"; e.currentTarget.style.color="#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#94A3B8"; }}>
                <X size={14} />
              </button>
            </div>

            {selected.total === 0 ? (
              <div style={{ padding:"32px 24px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>📍</div>
                <p style={{ fontSize:14, fontWeight:600, color:"#374151", marginBottom:4 }}>No assignments yet</p>
                <p style={{ fontSize:13, color:"#94A3B8", lineHeight:1.6 }}>Upload valuation data to populate city statistics.</p>
              </div>
            ) : (
              <div style={{ padding:"0 24px 16px" }}>
                <div style={{ padding:"20px 0 16px", borderBottom:"1px solid #F1F5F9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"#64748B" }}>Total Valuations</span>
                  <span style={{ fontSize:32, fontWeight:800, color:"#0F172A", letterSpacing:"-0.03em" }}>{selected.total}</span>
                </div>
                {[
                  { label:"Residential",              val: selected.residential,                      color:"#1D4ED8" },
                  { label:"Commercial",               val: selected.commercial,                       color:"#7C3AED" },
                  { label:"Portfolio Value",          val: formatCrore(selected.portfolio_value),    color:"#059669", bold:true },
                  { label:"Buy Recommendations",      val: selected.buy,                             color:"#059669" },
                  { label:"Sell Recommendations",     val: selected.sell,                            color:"#DC2626" },
                  { label:"Investment Recos",         val: selected.investment,                      color:"#D97706" },
                ].map(({ label, val, color, bold }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F8FAFC" }}>
                    <span style={{ fontSize:13, color:"#64748B" }}>{label}</span>
                    <span style={{ fontSize: bold ? 16 : 15, fontWeight: bold ? 700 : 600, color }}>{val}</span>
                  </div>
                ))}
                <div style={{ paddingTop:16 }}>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#CBD5E1", marginBottom:10 }}>Recommendation Split</p>
                  {[
                    { label:"Buy", val:selected.buy, color:"#10B981" },
                    { label:"Sell", val:selected.sell, color:"#EF4444" },
                    { label:"Investment", val:selected.investment, color:"#F59E0B" },
                  ].map(b => (
                    <div key={b.label} style={{ marginBottom:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11 }}>
                        <span style={{ color:"#64748B" }}>{b.label}</span>
                        <span style={{ fontWeight:600, color:"#374151" }}>{selected.total > 0 ? Math.round(b.val/selected.total*100) : 0}%</span>
                      </div>
                      <div style={{ height:5, background:"#F1F5F9", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", background:b.color, borderRadius:3, width:`${selected.total > 0 ? b.val/selected.total*100 : 0}%`, transition:"width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background:"#F8FAFC", border:"1.5px dashed #E2E8F0", borderRadius:20, padding:36, textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fff", border:"1px solid #E2E8F0", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:22 }}>📍</div>
            <p style={{ fontSize:15, fontWeight:700, color:"#0F172A", marginBottom:6 }}>Select a City</p>
            <p style={{ fontSize:13, color:"#94A3B8", lineHeight:1.65, marginBottom:24 }}>Click any marker on the map to view valuation statistics.</p>
            {cityStats.filter(c=>c.total>0).length > 0 && (
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#CBD5E1", marginBottom:10 }}>Top Cities</p>
                {cityStats.filter(c=>c.total>0).slice(0,5).map(c => (
                  <button key={c.city} onClick={() => setSelected(c)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"10px 14px", background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, cursor:"pointer", marginBottom:6, fontSize:13, transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#0F172A"; e.currentTarget.style.background="#F8FAFC"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.background="#fff"; }}>
                    <span style={{ fontWeight:600, color:"#0F172A" }}>{c.city}</span>
                    <span style={{ fontSize:12, color:"#94A3B8" }}>{c.total} assignments</span>
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
