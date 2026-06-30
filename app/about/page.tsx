"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Eye, Award, FileText, Building2 } from "lucide-react";

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

const WHY = [
  { icon: ShieldCheck, title: "Independent Research",    desc: "No brokerage relationships. No conflicts of interest. Every recommendation is purely research-driven." },
  { icon: BarChart3,   title: "Market Intelligence",     desc: "Proprietary transaction data covering 10 Indian cities with micro-market and RERA integration." },
  { icon: Eye,         title: "Data-Driven Decisions",   desc: "Every recommendation traces to verifiable comparables and documented valuation assumptions." },
  { icon: Award,       title: "Institutional Standards", desc: "Methodology trusted by banks, NBFCs, private equity, and institutional investors across India." },
  { icon: FileText,    title: "Transparent Methodology", desc: "All assumptions visible. All comparables justified. No black boxes. No surprises." },
  { icon: Building2,   title: "Research-First Culture",  desc: "15+ years of combined real estate research experience drives every valuation we produce." },
];

const STATS = [
  { num: "248+",       label: "Valuations Completed" },
  { num: "₹4,820 Cr", label: "Portfolio Assessed" },
  { num: "10",         label: "Cities Covered" },
  { num: "15+ yrs",    label: "Combined Experience" },
];

const METHOD = [
  { n: "01", title: "Intake & Scoping",         body: "Define purpose, applicable standard, and value premise. Confirm scope, timeline, and deliverable format upfront." },
  { n: "02", title: "Site Visit & Data",         body: "Visit every asset. Collect primary data from site, RERA filings, sub-registrar records, and developer offices." },
  { n: "03", title: "Comparable Analysis",       body: "Identify 3–5 recent comparable transactions in the same micro-market, adjusted for floor, view, age, and amenities." },
  { n: "04", title: "Valuation Calculation",     body: "Apply Sales Comparison (residential), Income Capitalisation or DCF (commercial), or Residual Method (land)." },
  { n: "05", title: "Senior Review & Sign-off",  body: "Every report reviewed by a senior analyst before dispatch. Mathematical accuracy and assumptions fully verified." },
  { n: "06", title: "Delivery & Archiving",      body: "Report delivered in agreed format. All assignments archived in the MB Research intelligence database." },
];

const CITIES = ["Mumbai","Delhi NCR","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Gurugram","Noida","Ahmedabad"];

export default function AboutPage() {
  const heroRef   = useReveal(".hero-el", 0.12);
  const storyRef  = useReveal(".story-el", 0.1);
  const expRef    = useReveal(".exp-el", 0.06);
  const methodRef = useReveal(".method-el", 0.08);
  const whyRef    = useReveal(".why-el", 0.08);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>About MB Research</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.08 }}>
              Research-first.<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>Always independent.</em>
            </h1>
            <p className="hero-el t-body-lg" style={{ opacity: 0 }}>
              MB Research was founded on one conviction: that property valuation must be driven by rigorous, independent analysis — not relationships, convenience, or outcomes a client already expects.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "56px 32px", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 44, fontWeight: 500, color: "#0A0A0A", letterSpacing: "-0.03em", marginBottom: 8 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, fontFamily: "Inter,sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY + VALUES */}
      <section className="section" ref={storyRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }}>
            <div className="story-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Our Story</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 24, lineHeight: 1.2 }}>Trusted by institutions across India.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6B7280", marginBottom: 18, fontFamily: "Inter,sans-serif" }}>Today we are trusted by lenders, developers, family offices, and institutional investors across India&apos;s most competitive markets. Our track record is built on transparency, precision, and a refusal to compromise.</p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6B7280", marginBottom: 32, fontFamily: "Inter,sans-serif" }}>Every assignment we complete enters our proprietary intelligence database — compounding in value over time and allowing us to surface insights no single valuation firm has been able to offer previously.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {["Banks & NBFCs","Real Estate Developers","Private Equity Firms","Family Offices","Institutional Investors"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: "1px solid #F3F4F6", fontSize: 14, color: "#374151", fontFamily: "Inter,sans-serif" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>
            </div>

            <div className="story-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Why MB Research</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {WHY.map(w => {
                  const Icon = w.icon;
                  return (
                    <div key={w.title} style={{ display: "flex", gap: 18, padding: "20px 22px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, transition: "all 0.25s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "#D1D5DB"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}>
                      <div style={{ width: 38, height: 38, background: "rgba(200,16,46,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} style={{ color: "#C8102E" }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginBottom: 4, fontFamily: "Inter,sans-serif" }}>{w.title}</h3>
                        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, fontFamily: "Inter,sans-serif" }}>{w.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE + COVERAGE */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }} ref={expRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
            <div className="exp-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Expertise</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(24px,2.6vw,34px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 28 }}>Valuation Expertise.</h2>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                {[
                  { type: "Residential", items: ["Apartments & Condominiums","Villas & Row Houses","Plotted Developments","Under-construction Inventory"] },
                  { type: "Commercial",  items: ["Grade A & B Office Spaces","Retail & High Street","Warehouses & Logistics","Mixed-use Developments"] },
                  { type: "Land",        items: ["Agricultural & NA Plots","Industrial Land","Greenfield Parcels","MIDC & SEZ Properties"] },
                ].map((cat, i) => (
                  <div key={cat.type} style={{ padding: "22px 26px", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{cat.type}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {cat.items.map(item => (
                        <span key={item} style={{ fontSize: 12, background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151", padding: "4px 11px", borderRadius: 6, fontFamily: "Inter,sans-serif" }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="exp-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Market Coverage</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(24px,2.6vw,34px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 28 }}>Pan-India Presence.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                {CITIES.map((city, i) => (
                  <div key={city} style={{ padding: "15px 18px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < 4 ? "#C8102E" : "#D1D5DB", flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "#374151", fontFamily: "Inter,sans-serif" }}>{city}</span>
                    {i < 4 && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: "#C8102E", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Inter,sans-serif" }}>Primary</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="section" ref={methodRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 18 }}>Research Methodology</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.15, marginBottom: 48 }}>How we arrive at a number.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
            {METHOD.map((m, i) => (
              <div key={m.n} className="method-el" style={{ opacity: 0, padding: "32px 30px", background: "#fff", borderRight: i % 2 === 0 ? "1px solid #E5E7EB" : "none", borderBottom: i < METHOD.length - 2 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 12, fontFamily: "DM Mono,monospace", letterSpacing: "0.05em" }}>{m.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: "#0A0A0A", marginBottom: 10, fontFamily: "Cormorant Garamond,serif" }}>{m.title}</h3>
                <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.75, fontFamily: "Inter,sans-serif" }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", padding: "96px 0", position: "relative", overflow: "hidden" }} ref={whyRef as React.RefObject<HTMLDivElement>}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)" }} />
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <h2 className="why-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 18 }}>Work with MB Research.</h2>
          <p className="why-el" style={{ opacity: 0, fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 36, fontFamily: "Inter,sans-serif" }}>Trusted by lenders, developers, and institutions across India.</p>
          <Link href="/enquiry" className="why-el" style={{ opacity: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "15px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "Inter,sans-serif", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#9B0B22"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
