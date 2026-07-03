"use client";
import { useEffect, useRef } from "react";
import IndiaMap from "@/components/IndiaMap";

function useReveal(sel: string, stagger = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(sel, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.85, stagger, ease: "power3.out",
          scrollTrigger: { trigger: ref.current!, start: "top 85%", once: true } });
      }, ref);
    })();
    return () => ctx?.revert();
  }, [sel, stagger]);
  return ref;
}

/* Static city information — no analyst data */
const CITY_INFO = [
  { city: "Mumbai",    region: "Mumbai Metropolitan Region", primary: true,  micro: "BKC · Lower Parel · Worli · Andheri · Powai · Thane · Navi Mumbai" },
  { city: "Delhi NCR", region: "National Capital Region",    primary: true,  micro: "South Delhi · Dwarka · Vasant Kunj · Saket · Defence Colony" },
  { city: "Bengaluru", region: "Bengaluru Urban",            primary: true,  micro: "Whitefield · Koramangala · Sarjapur · Hebbal · Electronic City" },
  { city: "Gurugram",  region: "NCR — Haryana",              primary: true,  micro: "Golf Course Road · Sohna Road · Dwarka Expressway · SPR" },
  { city: "Pune",      region: "Pune Metropolitan Region",   primary: false, micro: "Hinjewadi · Baner · Kharadi · Koregaon Park · Kalyani Nagar" },
  { city: "Hyderabad", region: "Hyderabad Metro",            primary: false, micro: "Gachibowli · HITEC City · Banjara Hills · Financial District" },
  { city: "Chennai",   region: "Chennai Metropolitan Area",  primary: false, micro: "OMR · ECR · Anna Nagar · Velachery · Perungudi" },
  { city: "Noida",     region: "NCR — Uttar Pradesh",        primary: false, micro: "Sector 150 · Noida Extension · Greater Noida West" },
  { city: "Kolkata",   region: "Kolkata Metropolitan Area",  primary: false, micro: "New Town · Salt Lake · EM Bypass · Alipore" },
  { city: "Ahmedabad", region: "Ahmedabad Metro",            primary: false, micro: "SG Highway · Bopal · Prahlad Nagar · GIFT City" },
];

/* Empty stats — map is shown without analyst data on public page */
const EMPTY_STATS = CITY_INFO.map(c => ({
  city: c.city, total: 0, residential: 0, commercial: 0,
  portfolio_value: 0, buy: 0, sell: 0, investment: 0,
}));

export default function CoveragePage() {
  const heroRef = useReveal(".hero-el", 0.12);
  const mapRef  = useReveal(".map-block", 0.1);
  const listRef = useReveal(".city-row", 0.05);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" style={{ borderBottom: "1px solid #E5E7EB" }} ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>Coverage</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
            <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.08 }}>
              Active across<br />
              <em style={{ fontStyle: "italic", color: "#C8102E" }}>10 Indian cities.</em>
            </h1>
            <div>
              <p className="hero-el t-body-lg" style={{ opacity: 0, marginBottom: 20 }}>
                MB Research maintains active micro-market intelligence across 10 cities in India — from primary metros to emerging corridors.
              </p>
              <p className="hero-el" style={{ opacity: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "Inter,sans-serif", lineHeight: 1.7 }}>
                Our coverage goes beyond city boundaries. We track individual sub-localities, new supply pipelines, pricing corridors, and RERA filings at the project level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP — public version shows city markers without analyst-specific counts */}
      <section className="section" style={{ paddingTop: 48 }} ref={mapRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div className="map-block" style={{ opacity: 0 }}>
            <IndiaMap cityStats={EMPTY_STATS} />
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#D1D5DB", marginTop: 20, fontFamily: "Inter,sans-serif" }}>
            Click any city marker to learn about our micro-market coverage in that area.
          </p>
        </div>
      </section>

      {/* CITY DIRECTORY */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }} ref={listRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 14 }}>Market Directory</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
              City-by-city coverage.
            </h2>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8102E" }} />Primary Market
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D1D5DB" }} />Active Market
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
            {CITY_INFO.map((c, i) => (
              <div key={c.city} className="city-row" style={{ opacity: 0, display: "grid", gridTemplateColumns: "180px 1fr 1.5fr", gap: 24, alignItems: "center", padding: "22px 28px", borderBottom: i < CITY_INFO.length - 1 ? "1px solid #F3F4F6" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.primary ? "#C8102E" : "#D1D5DB", flexShrink: 0 }} />
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A", fontFamily: "Cormorant Garamond,serif" }}>{c.city}</span>
                </div>
                <span style={{ fontSize: 13, color: "#6B7280", fontFamily: "Inter,sans-serif" }}>{c.region}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>{c.micro}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE COVER */}
      <section className="section" style={{ borderTop: "1px solid #E5E7EB" }}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 14 }}>Scope of Coverage</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 40 }}>
            What our research covers.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { icon: "🏠", title: "Residential", items: ["Apartments", "Villas & Row Houses", "Plotted Developments", "Under-construction"] },
              { icon: "🏢", title: "Commercial",  items: ["Grade A Offices", "Retail Spaces", "Warehouses", "Mixed-use Assets"] },
              { icon: "🌍", title: "Land",        items: ["NA & Agricultural", "Industrial Plots", "Greenfield Parcels", "MIDC / SEZ Land"] },
              { icon: "📊", title: "Data Sources", items: ["RERA Filings", "Sub-Registrar Data", "Developer Pricing", "Circle Rate Schedules"] },
            ].map(cat => (
              <div key={cat.title} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: "#0A0A0A", marginBottom: 16, fontFamily: "Cormorant Garamond,serif" }}>{cat.title}</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {cat.items.map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280", fontFamily: "Inter,sans-serif" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
