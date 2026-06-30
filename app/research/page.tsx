"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Mail, TrendingUp, BarChart3, Activity, FileText, Newspaper } from "lucide-react";

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

const PUBLICATIONS = [
  { icon: TrendingUp, tag: "Quarterly Index", color: "#1D4ED8", title: "PropIndex",
    desc: "Quarterly residential price benchmarks tracked across 10 cities and 40+ micro-markets, indexed against historical baselines.",
    period: "Q2 2025", pages: "32 pages" },
  { icon: Activity,   tag: "Quarterly Index", color: "#059669", title: "Rental Yield Index",
    desc: "Net and gross rental yield tracking for residential and commercial segments, benchmarked against capital value movement.",
    period: "Q2 2025", pages: "24 pages" },
  { icon: BarChart3,  tag: "Sentiment Study", color: "#D97706", title: "Housing Sentiment Index",
    desc: "Demand-side signals, consumer confidence indicators, and transaction velocity across primary and secondary markets.",
    period: "H1 2025", pages: "18 pages" },
  { icon: FileText,   tag: "Deep Dive", color: "#7C3AED", title: "Micro-Market Reports",
    desc: "Granular analysis of supply, demand, and pricing dynamics within specific corridors and emerging micro-markets.",
    period: "Ongoing", pages: "Varies" },
];

export default function ResearchPage() {
  const heroRef = useReveal(".hero-el", 0.12);
  const pubRef  = useReveal(".pub-card", 0.1);
  const nlRef   = useReveal(".nl-el", 0.1);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>Research &amp; Intelligence</p>
          <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(44px,6vw,84px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.05, marginBottom: 28, maxWidth: 760 }}>
            Independent market<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>intelligence, published.</em>
          </h1>
          <p className="hero-el t-body-lg" style={{ opacity: 0, maxWidth: 580 }}>
            Every assignment we complete feeds a proprietary intelligence database. These publications surface the patterns our research uncovers.
          </p>
        </div>
      </section>

      {/* PUBLICATIONS GRID */}
      <section className="section" style={{ paddingTop: 20 }} ref={pubRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {PUBLICATIONS.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="pub-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: 40, transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)", cursor: "default" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 56px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = p.color + "40"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                    <div style={{ width: 52, height: 52, background: `${p.color}12`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={24} style={{ color: p.color }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: p.color, background: `${p.color}10`, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 500, color: "#0A0A0A", marginBottom: 14, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.015em" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75, marginBottom: 28, fontFamily: "Inter,sans-serif" }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9CA3AF", fontFamily: "DM Mono,monospace" }}>
                      <span>{p.period}</span><span>·</span><span>{p.pages}</span>
                    </div>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: p.color, fontFamily: "Inter,sans-serif" }}>
                      Access Report <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="section" style={{ background: "#0A0A0A", position: "relative", overflow: "hidden" }} ref={nlRef as React.RefObject<HTMLDivElement>}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(200,16,46,0.08) 0%, transparent 70%)" }} />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="nl-el" style={{ opacity: 0, width: 56, height: 56, background: "rgba(200,16,46,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <Newspaper size={24} style={{ color: "#C8102E" }} />
          </div>
          <h2 className="nl-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 18, maxWidth: 560, margin: "0 auto 18px" }}>
            Research Newsletter
          </h2>
          <p className="nl-el" style={{ opacity: 0, fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 40, maxWidth: 460, margin: "0 auto 40px", fontFamily: "Inter,sans-serif" }}>
            Quarterly market intelligence delivered directly to your inbox. No spam — only research that matters.
          </p>
          <div className="nl-el" style={{ opacity: 0, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
              <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input type="email" placeholder="you@institution.com" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px 16px 14px 44px", fontSize: 14, color: "#fff", outline: "none", fontFamily: "Inter,sans-serif" }} />
            </div>
            <button style={{ background: "#C8102E", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#9B0B22"}
              onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
