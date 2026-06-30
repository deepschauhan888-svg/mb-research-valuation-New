"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";

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

const SERVICES = [
  {
    id: "residential", icon: Building2, color: "#1D4ED8", tag: "Core Service",
    title: "Residential Valuation",
    desc: "Comprehensive valuation for apartments, villas, row houses, and plotted developments across all ticket sizes — from affordable housing to ultra-luxury.",
    scope: ["Apartments & Condominiums","Villas & Row Houses","Plotted Developments","Society Resale Units","Under-construction Inventory"],
    method: ["Sales Comparison Approach","RERA Transaction Database","Floor & View Adjustments","Age & Amenity Benchmarking"],
    deliverables: ["Detailed Valuation Report","Comparable Transaction Analysis","Market Commentary","Lender-Grade Documentation"],
    tat: "2–4 working days",
  },
  {
    id: "commercial", icon: TrendingUp, color: "#C8102E", tag: "Institutional",
    title: "Commercial Valuation",
    desc: "Grade A and Grade B office spaces, retail units, warehouses, and mixed-use assets. Income capitalisation, DCF, and direct comparable approaches.",
    scope: ["Grade A & B Office Spaces","Retail & High-Street Units","Warehouses & Logistics Parks","Mixed-Use Developments","Co-working Spaces"],
    method: ["Income Capitalisation Approach","Discounted Cash Flow (DCF)","Lease & Yield Analysis","Macro & Micro Market Context"],
    deliverables: ["Income Approach Workings","DCF Model (where applicable)","Lease Abstract Summary","REIT-Compliant Reports"],
    tat: "3–5 working days",
  },
  {
    id: "advisory", icon: BarChart3, color: "#059669", tag: "Advisory",
    title: "Investment Advisory",
    desc: "Independent Buy, Sell, or Hold recommendations derived purely from research data — supporting portfolio decisions for institutional investors.",
    scope: ["Buy / Sell / Hold Recommendations","Portfolio Assessment Programs","NPA & Stressed Asset Valuation","Pre-Acquisition Due Diligence"],
    method: ["Comparable Market Analysis","Risk-Adjusted Return Modelling","Highest & Best Use Analysis","Scenario Sensitivity Testing"],
    deliverables: ["Investment Recommendation Memo","Portfolio-Level Summary","Risk Assessment Note","Management Presentation"],
    tat: "Scoped per assignment",
  },
];

export default function ServicesPage() {
  const heroRef = useReveal(".hero-el", 0.12);
  const cardRef = useReveal(".svc-block", 0.1);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>What We Offer</p>
          <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(44px,6vw,84px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.05, marginBottom: 28, maxWidth: 760 }}>
            Three services.<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>One standard of excellence.</em>
          </h1>
          <p className="hero-el t-body-lg" style={{ opacity: 0, maxWidth: 580 }}>
            Every service is built on the same foundation: independent research, defensible methodology, and a commitment to accuracy over convenience.
          </p>
        </div>
      </section>

      {/* SERVICE BLOCKS */}
      <section ref={cardRef as React.RefObject<HTMLDivElement>}>
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} id={s.id} className="svc-block" style={{ opacity: 0, background: i % 2 === 0 ? "#fff" : "#F9FAFB", borderTop: "1px solid #E5E7EB", padding: "88px 0", scrollMarginTop: 90 }}>
              <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
                  {/* Left */}
                  <div>
                    <div style={{ width: 56, height: 56, background: `${s.color}12`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                      <Icon size={24} style={{ color: s.color }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{s.tag}</span>
                    <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 500, color: "#0A0A0A", margin: "10px 0 20px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>{s.title}</h2>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75, marginBottom: 28, fontFamily: "Inter,sans-serif" }}>{s.desc}</p>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Inter,sans-serif" }}>Typical Turnaround</p>
                      <p style={{ fontFamily: "DM Mono,monospace", fontSize: 14, color: s.color, fontWeight: 600 }}>{s.tat}</p>
                    </div>
                  </div>

                  {/* Right grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                    {[
                      { label: "Scope", items: s.scope },
                      { label: "Methodology", items: s.method },
                      { label: "Deliverables", items: s.deliverables },
                    ].map(col => (
                      <div key={col.label}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontFamily: "Inter,sans-serif" }}>{col.label}</p>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                          {col.items.map(item => (
                            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "#374151", lineHeight: 1.5, fontFamily: "Inter,sans-serif" }}>
                              <CheckCircle2 size={14} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)" }} />
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 20 }}>
            Commission an assignment.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 36, fontFamily: "Inter,sans-serif" }}>Tell us about your asset, city, and timeline. We confirm scope within 24 hours.</p>
          <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "15px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "Inter,sans-serif" }}>
            Request a Valuation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
