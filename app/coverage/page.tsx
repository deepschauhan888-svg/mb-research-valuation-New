"use client";
import { useEffect, useRef, useMemo } from "react";
import { useStore } from "@/lib/store";
import { computeCityStats } from "@/lib/analytics";
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
        gsap.fromTo(sel, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, stagger, ease: "power3.out",
          scrollTrigger: { trigger: ref.current!, start: "top 85%", once: true } });
      }, ref);
    })();
    return () => ctx?.revert();
  }, [sel, stagger]);
  return ref;
}

const CITY_INFO = [
  { city: "Mumbai",    region: "Mumbai Metropolitan Region", primary: true,  micro: "BKC, Worli, Andheri, Powai, Thane" },
  { city: "Delhi NCR",  region: "National Capital Region",    primary: true,  micro: "South Delhi, Dwarka, Vasant Kunj" },
  { city: "Bengaluru", region: "Bengaluru Urban",             primary: true,  micro: "Whitefield, Koramangala, Sarjapur" },
  { city: "Gurugram",  region: "NCR — Haryana",               primary: true,  micro: "Golf Course Road, Sohna Road, Dwarka Expressway" },
  { city: "Pune",      region: "Pune Metropolitan Region",    primary: false, micro: "Hinjewadi, Baner, Kharadi" },
  { city: "Hyderabad", region: "Hyderabad Metro",             primary: false, micro: "Gachibowli, HITEC City, Banjara Hills" },
  { city: "Chennai",   region: "Chennai Metropolitan Area",   primary: false, micro: "OMR, ECR, Anna Nagar" },
  { city: "Noida",      region: "NCR — Uttar Pradesh",         primary: false, micro: "Sector 150, Noida Extension" },
  { city: "Kolkata",   region: "Kolkata Metropolitan Area",   primary: false, micro: "New Town, Salt Lake, EM Bypass" },
  { city: "Ahmedabad", region: "Ahmedabad Metro",             primary: false, micro: "SG Highway, Bopal, Prahlad Nagar" },
];

export default function CoveragePage() {
  const valuations = useStore(s => s.valuations);
  const cityStats   = useMemo(() => computeCityStats(valuations), [valuations]);

  const heroRef = useReveal(".hero-el", 0.12);
  const mapRef  = useReveal(".map-block", 0.1);
  const listRef = useReveal(".city-row", 0.06);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>Coverage</p>
          <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(44px,6vw,84px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.05, marginBottom: 28, maxWidth: 760 }}>
            Active across<br /><em style={{ fontStyle: "italic", color: "#C8102E" }}>10 Indian cities.</em>
          </h1>
          <p className="hero-el t-body-lg" style={{ opacity: 0, maxWidth: 560 }}>
            Click any city marker on the map to explore valuation statistics, portfolio values, and recommendation breakdowns for that market.
          </p>
        </div>
      </section>

      {/* MAP */}
      <section className="section" style={{ paddingTop: 20 }} ref={mapRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div className="map-block" style={{ opacity: 0 }}>
            <IndiaMap cityStats={cityStats} />
          </div>
        </div>
      </section>

      {/* CITY DIRECTORY */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }} ref={listRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 14 }}>Market Directory</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 48 }}>
            City-by-city coverage.
          </h2>

          <div style={{ border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
            {CITY_INFO.map((c, i) => (
              <div key={c.city} className="city-row" style={{ opacity: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr auto", gap: 24, alignItems: "center", padding: "22px 28px", borderBottom: i < CITY_INFO.length - 1 ? "1px solid #F3F4F6" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.primary ? "#C8102E" : "#D1D5DB" }} />
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A", fontFamily: "Cormorant Garamond,serif" }}>{c.city}</span>
                </div>
                <span style={{ fontSize: 13, color: "#6B7280", fontFamily: "Inter,sans-serif" }}>{c.region}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>{c.micro}</span>
                {c.primary && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#C8102E", background: "rgba(200,16,46,0.08)", padding: "4px 10px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter,sans-serif", justifySelf: "end" }}>Primary Market</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
