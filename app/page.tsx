"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, BarChart3, Shield, Eye, Award, FileText, MapPin, Quote } from "lucide-react";
import Magnetic from "@/components/Magnetic";

/* ── Particle field ──────────────────────────────────────────────────────── */
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i, size: 2 + Math.round(Math.random() * 3),
      top: Math.round(Math.random() * 100), left: Math.round(Math.random() * 100),
      dur: 6 + Math.round(Math.random() * 5), delay: Math.round(Math.random() * 4),
    }))
  ).current;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ width: p.size, height: p.size, top: `${p.top}%`, left: `${p.left}%`, animation: `floatC ${p.dur}s ease-in-out infinite ${p.delay}s` }} />
      ))}
    </div>
  );
}

/* ── GSAP scroll reveal ──────────────────────────────────────────────────── */
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

const TESTIMONIALS = [
  { quote: "MB Research provided an exceptionally thorough and defensible valuation. Their independence gave our credit committee full confidence.", name: "Head of Credit Risk", org: "Leading Private Sector Bank" },
  { quote: "In a market filled with conflicts of interest, MB Research stands apart. Their research-first approach has consistently delivered accurate, timely assessments.", name: "Investment Director", org: "Real Estate Private Equity Fund" },
  { quote: "The depth of micro-market intelligence and the rigour of their comparable analysis is unlike anything we have seen from other valuation firms.", name: "Chief Risk Officer", org: "Housing Finance Company" },
];

const CLIENTS = ["Banks", "NBFCs", "Developers", "Family Offices", "Private Equity", "Institutional Investors", "Housing Finance Cos", "Investment Funds"];

export default function HomePage() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const srvRef    = useReveal(".srv-card",   0.12);
  const whyRef    = useReveal(".why-card",   0.1);
  const covRef    = useReveal(".cov-pill",   0.04);
  const resRef    = useReveal(".res-card",   0.1);
  const teamRef   = useReveal(".team-card",  0.12);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsap = (await import("gsap")).default;
      if (!heroRef.current) return;
      ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".hero-badge", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
          .fromTo(".hero-word",  { opacity: 0, y: "110%" }, { opacity: 1, y: "0%", duration: 0.9, stagger: 0.05 }, 0.4)
          .fromTo(".hero-sub",   { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 1.05)
          .fromTo(".hero-ctas",  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.25)
          .fromTo(".hero-kv",    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.4);
      }, heroRef);
    })();
    return () => ctx?.revert();
  }, []);

  /* Mouse parallax */
  const paralRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!paralRef.current) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 16;
      const dy = (e.clientY / window.innerHeight - 0.5) * 10;
      paralRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const S: React.CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "0 40px" };

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", padding: "80px 0 60px", overflow: "hidden" }}>
        <div className="grain" />
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }} />
        <div className="mesh-blob" style={{ width: 420, height: 420, top: "-12%", left: "-6%", background: "radial-gradient(circle, rgba(200,16,46,0.07) 0%, transparent 70%)", animation: "floatA 9s ease-in-out infinite" }} />
        <div className="mesh-blob" style={{ width: 360, height: 360, bottom: "-10%", right: "-4%", background: "radial-gradient(circle, rgba(15,23,42,0.05) 0%, transparent 70%)", animation: "floatB 11s ease-in-out infinite 1s" }} />
        <ParticleField />
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: "radial-gradient(ellipse, rgba(200,16,46,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={S} ref={paralRef}>
          <div className="hero-badge" style={{ opacity: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,16,46,0.06)", border: "1px solid rgba(200,16,46,0.18)", borderRadius: 20, padding: "6px 16px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>India&apos;s Independent Valuation Research</span>
          </div>

          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 400, fontSize: "clamp(52px, 7.5vw, 108px)", lineHeight: 1.0, letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: 28, maxWidth: 760 }}>
            <span style={{ display: "block", overflow: "hidden" }}><span className="hero-word" style={{ display: "inline-block" }}>Intelligence</span></span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span className="hero-word" style={{ display: "inline-block", fontStyle: "italic", color: "#C8102E" }}>Behind</span>{" "}
              <span className="hero-word" style={{ display: "inline-block" }}>Every</span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}><span className="hero-word" style={{ display: "inline-block" }}>Square Foot.</span></span>
          </h1>

          <p className="hero-sub" style={{ opacity: 0, fontSize: 18, lineHeight: 1.75, color: "#6B7280", maxWidth: 520, marginBottom: 44, fontFamily: "Inter,sans-serif" }}>
            MB Research is India&apos;s independent real estate valuation and research firm — trusted by banks, NBFCs, developers, and institutional investors for precise, conflict-free intelligence.
          </p>

          <div className="hero-ctas" style={{ opacity: 0, display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 64 }}>
            <Magnetic strength={0.3}>
              <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0A0A0A", color: "#fff", padding: "15px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background 0.25s, box-shadow 0.25s", fontFamily: "Inter,sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,16,46,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0A0A0A"; e.currentTarget.style.boxShadow = "none"; }}>
                Request a Valuation <ArrowRight size={16} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#0A0A0A", padding: "15px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1.5px solid #E5E7EB", transition: "border-color 0.25s, background 0.25s", fontFamily: "Inter,sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "transparent"; }}>
                About MB Research
              </Link>
            </Magnetic>
          </div>

          {/* Key value propositions — not analytics, just capability statements */}
          <div style={{ display: "flex", gap: 0, paddingTop: 32, borderTop: "1px solid #E5E7EB", flexWrap: "wrap" }}>
            {[
              { icon: "🏠", text: "Residential Valuation" },
              { icon: "🏢", text: "Commercial Valuation" },
              { icon: "📊", text: "Investment Advisory" },
              { icon: "🇮🇳", text: "Pan-India Coverage" },
            ].map((v, i) => (
              <div key={v.text} className="hero-kv" style={{ opacity: 0, display: "flex", alignItems: "center", gap: 8, padding: "10px 28px 10px 0", marginRight: 0, borderRight: i < 3 ? "1px solid #E5E7EB" : "none", paddingRight: 28, marginRight2: 0 } as React.CSSProperties}>
                <span style={{ fontSize: 16 }}>{v.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", fontFamily: "Inter,sans-serif", whiteSpace: "nowrap", paddingRight: 28 }}>{v.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(180deg, #0A0A0A 0%, transparent 100%)" }} />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>Scroll</span>
        </div>
      </section>

      {/* ══ CLIENT MARQUEE ══ */}
      <div style={{ background: "#0A0A0A", padding: "18px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].flatMap(() =>
            CLIENTS.map((c, i) => (
              <div key={`${c}-${i}`} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0 36px", whiteSpace: "nowrap", fontFamily: "Inter,sans-serif" }}>{c}</span>
                <span style={{ color: "#C8102E", fontSize: 12 }}>·</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══ WHO WE ARE (introduction, not full story) ══ */}
      <section className="section">
        <div style={S}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p className="t-label" style={{ marginBottom: 18 }}>Who We Are</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1, marginBottom: 24 }}>
                Research-first.<br />Always independent.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#6B7280", marginBottom: 16, fontFamily: "Inter,sans-serif" }}>
                MB Research is a conflict-free real estate valuation and research firm. We hold no brokerage relationships and carry no advisory conflicts — every valuation we produce is driven purely by data and methodology.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#9CA3AF", marginBottom: 36, fontFamily: "Inter,sans-serif" }}>
                Trusted by banks, NBFCs, private equity, and family offices across India for independent, institutional-grade property intelligence.
              </p>
              <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
                Our Full Story <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Independent Research", desc: "No brokerage conflicts. No advisory bias. Pure data." },
                { label: "Institutional Standards", desc: "RICS-aligned methodology across every asset class." },
                { label: "Pan-India Coverage", desc: "Active across 10 cities with deep micro-market data." },
                { label: "Transparent Methodology", desc: "All assumptions documented. No black boxes." },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", gap: 14, padding: "18px 20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", flexShrink: 0, marginTop: 6 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", marginBottom: 3, fontFamily: "Inter,sans-serif" }}>{p.label}</p>
                    <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "Inter,sans-serif" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES PREVIEW ══ */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }} ref={srvRef as React.RefObject<HTMLDivElement>}>
        <div style={S}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Our Services</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1 }}>
                Three services.<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>One standard.</em>
              </h2>
            </div>
            <Link href="/services" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: Building2, title: "Residential Valuation", color: "#1D4ED8", desc: "Apartments, villas, and plotted developments valued against live RERA data and verified transaction comparables.", href: "/services#residential" },
              { icon: TrendingUp, title: "Commercial Valuation", color: "#C8102E", desc: "Grade A offices, retail, and industrial assets using income capitalisation, DCF, and yield-based approaches.", href: "/services#commercial" },
              { icon: BarChart3,  title: "Investment Advisory",  color: "#059669", desc: "Independent Buy / Sell / Hold recommendations derived purely from data — no brokerage, no bias.", href: "/services#advisory" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="srv-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "36px 32px", transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 56px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = s.color + "30"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}>
                  <div style={{ width: 48, height: 48, background: `${s.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 12, fontFamily: "Cormorant Garamond,serif" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24, fontFamily: "Inter,sans-serif" }}>{s.desc}</p>
                  <Link href={s.href} style={{ fontSize: 13, fontWeight: 600, color: s.color, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                    Learn More <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ WHY MB RESEARCH (6 points, no charts) ══ */}
      <section className="section" ref={whyRef as React.RefObject<HTMLDivElement>}>
        <div style={S}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="t-label" style={{ marginBottom: 14 }}>Why Choose Us</p>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1, maxWidth: 520, margin: "0 auto" }}>
              Research that institutions rely on.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: Shield,    title: "Independent Research",      desc: "No brokerage relationships. No conflicts of interest. Every recommendation reflects only what the data shows." },
              { icon: Eye,       title: "Institutional Methodology", desc: "RICS-aligned valuation standards applied consistently — regardless of asset class or ticket size." },
              { icon: Award,     title: "Pan-India Coverage",        desc: "Active across 10 cities with deep micro-market data, RERA coverage, and sub-registrar transaction databases." },
              { icon: BarChart3, title: "Data-Driven Decisions",     desc: "Proprietary transaction database spanning multiple years. Every comparable is verified, not estimated." },
              { icon: FileText,  title: "Transparent Process",       desc: "All assumptions visible. All comparables documented. Every adjustment is justified before sign-off." },
              { icon: Building2, title: "Research Culture",          desc: "A team built on research — not sales. Every member specialises in market analysis and valuation methodology." },
            ].map(w => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="why-card" style={{ opacity: 0, padding: "28px 24px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, transition: "all 0.3s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "#D1D5DB"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}>
                  <div style={{ width: 40, height: 40, background: "rgba(200,16,46,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={18} style={{ color: "#C8102E" }} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A", marginBottom: 8, fontFamily: "Cormorant Garamond,serif" }}>{w.title}</h4>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ COVERAGE PREVIEW (city pills only, no analytics) ══ */}
      <section className="section-sm" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }} ref={covRef as React.RefObject<HTMLDivElement>}>
        <div style={S}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Coverage</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                Active across 10 Indian cities.
              </h2>
            </div>
            <Link href="/coverage" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              Explore Coverage Map <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Mumbai", "Delhi NCR", "Bengaluru", "Gurugram", "Pune", "Hyderabad", "Chennai", "Noida", "Kolkata", "Ahmedabad"].map((c, i) => (
              <Link key={c} href="/coverage" className="cov-pill" style={{
                opacity: 0, padding: "10px 20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 30,
                fontSize: 14, fontWeight: 500, color: i < 4 ? "#0A0A0A" : "#6B7280",
                fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s", textDecoration: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8102E"; e.currentTarget.style.color = "#C8102E"; e.currentTarget.style.background = "rgba(200,16,46,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = i < 4 ? "#0A0A0A" : "#6B7280"; e.currentTarget.style.background = "#fff"; }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />{c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RESEARCH PREVIEW (3 cards, link to /research) ══ */}
      <section className="section" ref={resRef as React.RefObject<HTMLDivElement>}>
        <div style={S}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Publications</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                Research &amp; Intelligence.
              </h2>
            </div>
            <Link href="/research" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              All Publications <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { tag: "Index", title: "PropIndex", desc: "Quarterly residential price benchmarks across 10 cities and 40+ micro-markets.", color: "#1D4ED8" },
              { tag: "Index", title: "Rental Yield Index", desc: "Net and gross yield tracking for residential and commercial segments.", color: "#059669" },
              { tag: "Reports", title: "Micro-Market Reports", desc: "Deep-dive supply, demand, and pricing analysis for specific corridors.", color: "#7C3AED" },
            ].map(r => (
              <div key={r.title} className="res-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 24px", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: `${r.color}12`, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{r.tag}</span>
                <h4 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", margin: "16px 0 10px", fontFamily: "Cormorant Garamond,serif" }}>{r.title}</h4>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20, fontFamily: "Inter,sans-serif" }}>{r.desc}</p>
                <Link href="/research" style={{ fontSize: 12, fontWeight: 600, color: r.color, display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter,sans-serif" }}>
                  Access Report <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LEADERSHIP PREVIEW ══ */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }} ref={teamRef as React.RefObject<HTMLDivElement>}>
        <div style={S}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Leadership</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                The team.
              </h2>
            </div>
            <Link href="/leadership" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              Meet the Team <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { name: "Prasun Kumar",    role: "Chief Marketing Officer",  color: "#1E3A5F", accent: "#3B82F6" },
              { name: "Abhishek Bhadra", role: "Head of Research",         color: "#1F2937", accent: "#10B981" },
              { name: "Deepak Chauhan",  role: "Research Analyst",         color: "#4C1D95", accent: "#8B5CF6" },
            ].map(m => (
              <div key={m.name} className="team-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 24px", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}, ${m.accent})`, marginBottom: 18 }} />
                <h4 style={{ fontSize: 17, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, fontFamily: "Cormorant Garamond,serif" }}>{m.name}</h4>
                <p style={{ fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section">
        <div style={{ ...S, textAlign: "center" }}>
          <p className="t-label" style={{ marginBottom: 14 }}>Testimonials</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 56 }}>
            What our clients say.
          </h2>
          <div style={{ maxWidth: 720, margin: "0 auto", minHeight: 200, position: "relative" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: 0, opacity: tIdx === i ? 1 : 0, transform: `translateY(${tIdx === i ? 0 : 20}px)`, transition: "opacity 0.6s ease, transform 0.6s ease", pointerEvents: tIdx === i ? "auto" : "none" }}>
                <Quote size={28} style={{ color: "#C8102E", margin: "0 auto 24px", display: "block", opacity: 0.5 }} />
                <p style={{ fontSize: "clamp(17px,2vw,22px)", fontFamily: "Cormorant Garamond,serif", fontStyle: "italic", color: "#0A0A0A", lineHeight: 1.6, marginBottom: 32 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ width: 40, height: 2, background: "#C8102E", margin: "0 auto 16px" }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter,sans-serif" }}>{t.name}</p>
                <p style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>{t.org}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 40 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTIdx(i)}
                style={{ width: tIdx === i ? 24 : 8, height: 8, borderRadius: 4, background: tIdx === i ? "#C8102E" : "#E5E7EB", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{ background: "#0A0A0A", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...S, textAlign: "center", position: "relative" }}>
          <p className="t-label" style={{ marginBottom: 20, color: "#C8102E" }}>Get Started</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.05, marginBottom: 22, maxWidth: 600, margin: "0 auto 22px" }}>
            Commission an independent valuation.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 44, fontFamily: "Inter,sans-serif" }}>
            We respond within 24 hours · Mon–Sat · 9 AM – 7 PM IST
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "16px 34px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background 0.2s", fontFamily: "Inter,sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = "#9B0B22"}
              onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
              Request a Valuation <ArrowRight size={16} />
            </Link>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.7)", padding: "16px 34px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.15)", transition: "all 0.2s", fontFamily: "Inter,sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
