"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, BarChart3, Shield, Eye, Award, FileText, MapPin, ChevronRight, Quote } from "lucide-react";

/* ── GSAP animate-in on scroll ───────────────────────────────────────────── */
function useReveal(selector: string, stagger = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap   = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          selector,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger, ease: "power3.out",
            scrollTrigger: { trigger: ref.current!, start: "top 82%", once: true } }
        );
      }, ref);
    };
    init();
    return () => ctx?.revert();
  }, [selector, stagger]);
  return ref;
}

/* ── Counter animation ───────────────────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "", dur = 2 }: { to: number; prefix?: string; suffix?: string; dur?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / (dur * 1000), 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(ease * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, dur]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

/* ── Floating stat card ──────────────────────────────────────────────────── */
function FloatCard({ label, value, unit, style, anim }: {
  label: string; value: string; unit?: string;
  style?: React.CSSProperties; anim: string;
}) {
  return (
    <div style={{
      position: "absolute", background: "#fff",
      border: "1px solid #E5E7EB", borderRadius: 14,
      padding: "16px 20px", boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
      minWidth: 140, animation: `${anim} 4s ease-in-out infinite`,
      backdropFilter: "blur(8px)", ...style,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 6, fontFamily: "Inter,sans-serif" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "Cormorant Garamond,serif" }}>
        {value}<span style={{ fontSize: 13, fontWeight: 500, color: "#9CA3AF", marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

/* ── Service Card ────────────────────────────────────────────────────────── */
function ServiceCard({ icon: Icon, title, desc, items, href, color }: {
  icon: React.ElementType; title: string; desc: string;
  items: string[]; href: string; color: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", border: `1px solid ${hov ? color + "40" : "#E5E7EB"}`,
        borderRadius: 20, padding: "40px 36px", cursor: "default",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hov ? `0 24px 64px rgba(0,0,0,0.09)` : "0 2px 8px rgba(0,0,0,0.03)",
        transform: hov ? "translateY(-6px)" : "none", position: "relative", overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `${color}08`, borderBottomLeftRadius: 80 }} />
      <div style={{ width: 48, height: 48, background: `${color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <Icon size={22} style={{ color }} />
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 500, color: "#0A0A0A", marginBottom: 12, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24, fontFamily: "Inter,sans-serif" }}>{desc}</p>
      <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {items.map(it => (
          <li key={it} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", fontFamily: "Inter,sans-serif" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />{it}
          </li>
        ))}
      </ul>
      <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color, fontFamily: "Inter,sans-serif", transition: "gap 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.gap = "10px"}
        onMouseLeave={e => e.currentTarget.style.gap = "6px"}>
        Learn More <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/* ── Why point ───────────────────────────────────────────────────────────── */
function WhyPoint({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: string }) {
  return (
    <div className="reveal" style={{ transitionDelay: delay }}>
      <div style={{ width: 44, height: 44, background: "rgba(200,16,46,0.06)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Icon size={20} style={{ color: "#C8102E" }} />
      </div>
      <h4 style={{ fontSize: 17, fontWeight: 600, color: "#0A0A0A", marginBottom: 10, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.01em" }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>{desc}</p>
    </div>
  );
}

/* ── Process step ────────────────────────────────────────────────────────── */
function ProcessStep({ n, title, desc, last }: { n: string; title: string; desc: string; last?: boolean }) {
  return (
    <div className="reveal" style={{ display: "flex", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "2px solid #C8102E", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#C8102E", fontFamily: "DM Mono,monospace" }}>{n}</span>
        </div>
        {!last && <div style={{ width: 1, flex: 1, background: "#E5E7EB", marginTop: 8 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 40 }}>
        <h4 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", marginBottom: 8, fontFamily: "Cormorant Garamond,serif" }}>{title}</h4>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Testimonial ─────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: "MB Research provided an exceptionally thorough and defensible valuation report. Their independence and methodology gave our credit committee full confidence.", name: "Head of Credit Risk", org: "Leading Private Sector Bank" },
  { quote: "In a market filled with conflicts of interest, MB Research stands apart. Their research-first approach has consistently delivered accurate, timely assessments.", name: "Investment Director", org: "Real Estate Private Equity Fund" },
  { quote: "The depth of micro-market intelligence and the rigour of their comparable analysis is unlike anything we have seen from other valuation firms.", name: "Chief Risk Officer", org: "Housing Finance Company" },
];

/* ══════════════════════ PAGE ════════════════════════════════════════════ */
export default function HomePage() {
  /* GSAP hero entry */
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const init = async () => {
      const gsap = (await import("gsap")).default;
      if (!heroRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge",   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(".hero-h1",      { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.0 }, 0.45)
        .fromTo(".hero-sub",     { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 0.85)
        .fromTo(".hero-ctas",    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.05)
        .fromTo(".hero-stats",   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
        .fromTo(".float-card",   { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.12, duration: 0.6 }, 1.3);
    };
    init();
  }, []);

  /* Mouse parallax */
  const paralRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!paralRef.current) return;
      const { clientX: x, clientY: y } = e;
      const { innerWidth: w, innerHeight: h } = window;
      const dx = (x / w - 0.5) * 18;
      const dy = (y / h - 0.5) * 12;
      paralRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* Scroll reveals */
  const srvRef   = useReveal(".srv-card",  0.14);
  const whyRef   = useReveal(".why-point", 0.1);
  const procRef  = useReveal(".reveal",    0.1);
  const resRef   = useReveal(".res-card",  0.1);
  const teamRef  = useReveal(".team-card", 0.1);

  /* Testimonial slider */
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const S = (gap: number, extra?: React.CSSProperties): React.CSSProperties =>
    ({ maxWidth: 1160, margin: "0 auto", padding: "0 40px", ...extra });

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", padding: "80px 0 60px", overflow: "hidden" }}>
        {/* Dot grid bg */}
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }} />

        {/* Red glow */}
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: "radial-gradient(ellipse, rgba(200,16,46,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={S(0)} ref={paralRef}>
          {/* Eyebrow badge */}
          <div className="hero-badge" style={{ opacity: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,16,46,0.06)", border: "1px solid rgba(200,16,46,0.18)", borderRadius: 20, padding: "6px 16px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>India&apos;s Premier Valuation Intelligence</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "flex-start" }}>
            <div>
              {/* Main headline */}
              <h1 className="hero-h1" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontWeight: 400, fontSize: "clamp(52px, 7.5vw, 108px)", lineHeight: 1.0, letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: 28, maxWidth: 760 }}>
                Intelligence
                <br />
                <em style={{ fontStyle: "italic", color: "#C8102E" }}>Behind</em> Every
                <br />
                Square Foot.
              </h1>

              <p className="hero-sub" style={{ opacity: 0, fontSize: 18, lineHeight: 1.75, color: "#6B7280", maxWidth: 520, marginBottom: 44, fontFamily: "Inter,sans-serif" }}>
                India&apos;s independent real estate valuation and research platform. Trusted by banks, NBFCs, developers, and institutional investors for precise, research-driven intelligence.
              </p>

              {/* CTAs */}
              <div className="hero-ctas" style={{ opacity: 0, display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 64 }}>
                <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0A0A0A", color: "#fff", padding: "15px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", fontFamily: "Inter,sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,16,46,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0A0A0A"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  Request a Valuation <ArrowRight size={16} />
                </Link>
                <Link href="/research" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#0A0A0A", padding: "15px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1.5px solid #E5E7EB", transition: "all 0.25s", fontFamily: "Inter,sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A0A0A"; e.currentTarget.style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "transparent"; }}>
                  Explore Research
                </Link>
              </div>

              {/* Stats row */}
              <div className="hero-stats" style={{ opacity: 0, display: "flex", gap: 48, paddingTop: 32, borderTop: "1px solid #E5E7EB" }}>
                {[
                  { label: "Assignments Completed", num: 248, sfx: "+" },
                  { label: "Portfolio Assessed",     pre: "₹", num: 4820, sfx: " Cr+" },
                  { label: "Cities Covered",         num: 10 },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 36, fontWeight: 500, color: "#0A0A0A", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.02em" }}>
                      <Counter to={s.num} prefix={s.pre} suffix={s.sfx} />
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards cluster */}
            <div style={{ position: "relative", width: 200, height: 420, flexShrink: 0, display: "none" }} className="xl:block">
              <FloatCard label="Assignments" value="248" unit="+" style={{ top: 20, right: 0, animation: "floatA 4s ease-in-out infinite" }} anim="floatA" />
              <FloatCard label="Portfolio Value" value="₹4,820" unit="Cr" style={{ top: 170, right: 30, animation: "floatB 5s ease-in-out infinite 0.8s" }} anim="floatB" />
              <FloatCard label="Cities" value="10" style={{ top: 310, right: 0, animation: "floatC 4.5s ease-in-out infinite 1.5s" }} anim="floatC" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(180deg, #0A0A0A 0%, transparent 100%)", animation: "shimmer 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>Scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════ */}
      <div style={{ background: "#0A0A0A", padding: "20px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].flatMap(() =>
            ["Banks", "NBFCs", "Real Estate Developers", "Institutional Investors", "Family Offices", "Private Equity", "Housing Finance Companies", "Investment Funds"].map((c, i) => (
              <div key={`${c}-${i}`} style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 40px", whiteSpace: "nowrap", fontFamily: "Inter,sans-serif" }}>{c}</span>
                <span style={{ color: "#C8102E", fontSize: 14 }}>·</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
      <section className="section" ref={srvRef as React.RefObject<HTMLDivElement>}>
        <div style={S(0)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>What We Offer</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1 }}>
                Three services.<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>One standard.</em>
              </h2>
            </div>
            <Link href="/services" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              All Services <ArrowRight size={14} />
            </Link>
          </div>
          <div className="srv-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <div className="srv-card"><ServiceCard icon={Building2}  title="Residential Valuation"  color="#1D4ED8" href="/services#residential" desc="Apartments, villas, and plotted developments valued against live RERA data and verified transaction comparables." items={["Sales Comparison Approach","RERA Transaction Database","Micro-Market Analysis","Lender-Grade Reports"]} /></div>
            <div className="srv-card"><ServiceCard icon={TrendingUp}  title="Commercial Valuation"   color="#C8102E" href="/services#commercial" desc="Grade A offices, retail, and industrial assets. Income capitalisation, DCF, and yield-based valuations for institutional mandates." items={["Income Capitalisation","Discounted Cash Flow","Lease & Yield Analysis","REIT Compliance"]} /></div>
            <div className="srv-card"><ServiceCard icon={BarChart3}   title="Investment Advisory"   color="#059669" href="/services#advisory" desc="Independent Buy / Sell / Hold recommendations derived purely from data. No brokerage. No bias. Just research." items={["Buy · Sell · Hold Calls","Portfolio Assessment","NPA & Stressed Assets","Acquisition Due Diligence"]} /></div>
          </div>
        </div>
      </section>

      {/* ══ WHY MB RESEARCH ═══════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }} ref={whyRef as React.RefObject<HTMLDivElement>}>
        <div style={S(0)}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p className="t-label" style={{ marginBottom: 14 }}>Why Choose Us</p>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1, maxWidth: 540, margin: "0 auto" }}>
              Research that institutions rely on.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {[
              { icon: Shield,    title: "Independent Research",      desc: "No brokerage ties. No advisory conflicts. Every report reflects solely what the data says — not what a client wants to hear." },
              { icon: Eye,       title: "Institutional Methodology", desc: "RICS-aligned valuation standards applied consistently across every asset class and every city we cover." },
              { icon: Award,     title: "Pan-India Coverage",        desc: "Active across 10 cities with micro-market depth — from BKC to Whitefield, Golf Course Road to Banjara Hills." },
              { icon: BarChart3, title: "Data-Driven Decisions",     desc: "Proprietary transaction database spanning 6 years. RERA-backed comparables. Circle rate benchmarking." },
              { icon: FileText,  title: "Transparent Methodology",   desc: "All assumptions visible. All comparables documented. Every adjustment justified. No black boxes." },
              { icon: Building2, title: "Research-First Culture",    desc: "15+ years of combined real estate research experience drives every valuation we produce." },
            ].map((w, i) => (
              <div key={w.title} className="why-point" style={{ opacity: 0 }}>
                <WhyPoint {...w} delay={`${i * 0.08}s`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ═══════════════════════════════════════════════════════ */}
      <section className="section" ref={procRef as React.RefObject<HTMLDivElement>}>
        <div style={S(0)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Our Process</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,52px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1, marginBottom: 24 }}>
                How we arrive at<br /><em style={{ fontStyle: "italic", color: "#C8102E" }}>a number.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.75, fontFamily: "Inter,sans-serif" }}>
                Every assignment follows a rigorous, documented process designed to meet institutional lending, investment, and compliance standards.
              </p>
            </div>
            <div>
              {[
                { n: "01", title: "Client Intake & Scoping",    desc: "Define purpose, applicable standard (RICS/IVS), value premise, and deliverable format." },
                { n: "02", title: "Site Inspection",            desc: "Physical inspection of every asset. Photography, measurement verification, condition assessment." },
                { n: "03", title: "Market Research",            desc: "RERA data, sub-registrar transactions, developer pricing — all sourced and verified." },
                { n: "04", title: "Comparable Analysis",        desc: "3–5 verified transactions adjusted for floor, age, view, amenities, and time." },
                { n: "05", title: "Valuation Modelling",        desc: "Sales Comparison, Income Capitalisation, or DCF applied and reconciled." },
                { n: "06", title: "Senior Review & Sign-off",   desc: "Independent review of assumptions, comparables, and final value conclusion." },
                { n: "07", title: "Report Delivery",            desc: "Delivered in agreed format, archived in the MB Research intelligence database." },
              ].map((s, i, arr) => (
                <ProcessStep key={s.n} {...s} last={i === arr.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COVERAGE ══════════════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
        <div style={S(0)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Coverage</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                Active across 10 Indian cities.
              </h2>
            </div>
            <Link href="/coverage" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              View Coverage Map <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Mumbai","Delhi NCR","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Gurugram","Noida","Ahmedabad"].map((c, i) => (
              <Link key={c} href="/coverage" style={{
                padding: "10px 20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 30,
                fontSize: 14, fontWeight: 500, color: i < 4 ? "#0A0A0A" : "#6B7280",
                fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s", textDecoration: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8102E"; e.currentTarget.style.color = "#C8102E"; e.currentTarget.style.background = "rgba(200,16,46,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = i < 4 ? "#0A0A0A" : "#6B7280"; e.currentTarget.style.background = "#fff"; }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />{c}
                {i < 4 && <span style={{ fontSize: 9, fontWeight: 700, color: "#C8102E", background: "rgba(200,16,46,0.08)", padding: "2px 6px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Primary</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RESEARCH ══════════════════════════════════════════════════════ */}
      <section className="section" ref={resRef as React.RefObject<HTMLDivElement>}>
        <div style={S(0)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>Publications</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.1 }}>
                Research &amp; Intelligence.
              </h2>
            </div>
            <Link href="/research" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              All Publications <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { tag: "Index", title: "PropIndex", desc: "Quarterly residential price benchmarks across 10 cities and 40+ micro-markets.", color: "#1D4ED8" },
              { tag: "Index", title: "Rental Yield Index", desc: "Net and gross yield tracking for residential and commercial segments.", color: "#059669" },
              { tag: "Sentiment", title: "Housing Sentiment Index", desc: "Demand-side signals, consumer confidence, and transaction velocity.", color: "#D97706" },
              { tag: "Reports", title: "Micro-Market Reports", desc: "Deep-dive analysis of supply, demand, and pricing in specific corridors.", color: "#7C3AED" },
            ].map((r, i) => (
              <div key={r.title} className="res-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 24px", transition: "all 0.35s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "#D1D5DB"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: `${r.color}12`, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{r.tag}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "DM Mono,monospace" }}>Q{(i % 4) + 1} 2025</span>
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", marginBottom: 10, fontFamily: "Cormorant Garamond,serif" }}>{r.title}</h4>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20, fontFamily: "Inter,sans-serif" }}>{r.desc}</p>
                <div style={{ height: 1, background: "#F3F4F6", marginBottom: 16 }} />
                <Link href="/research" style={{ fontSize: 12, fontWeight: 600, color: r.color, display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter,sans-serif" }}>
                  Access Report <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LEADERSHIP ════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }} ref={teamRef as React.RefObject<HTMLDivElement>}>
        <div style={S(0)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="t-label" style={{ marginBottom: 14 }}>The Team</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                Leadership.
              </h2>
            </div>
            <Link href="/leadership" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
              Meet the Team <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { initials: "PK", name: "Prasun Kumar",    role: "Chief Marketing Officer",  bio: "A visionary business and marketing leader with a passion for growth, innovation, and value creation.", color: "#1E3A5F", accent: "#3B82F6" },
              { initials: "AB", name: "Abhishek Bhadra", role: "Head of Research",         bio: "15+ years in real estate research, market analysis, investment advisory, and strategic planning.", color: "#1F2937", accent: "#10B981" },
              { initials: "DC", name: "Deepak Chauhan",  role: "Research Analyst",         bio: "Supports valuation analysis, comparable benchmarking and investment recommendations.", color: "#4C1D95", accent: "#8B5CF6" },
            ].map(m => (
              <div key={m.name} className="team-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "36px", transition: "all 0.35s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                {/* Avatar */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}, ${m.accent})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: `0 4px 20px ${m.accent}30` }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "Inter,sans-serif" }}>{m.initials}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, fontFamily: "Cormorant Garamond,serif" }}>{m.name}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontFamily: "Inter,sans-serif" }}>{m.role}</p>
                <div style={{ height: 1, background: "#F3F4F6", marginBottom: 16 }} />
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */}
      <section className="section">
        <div style={S(0)}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="t-label" style={{ marginBottom: 14 }}>Testimonials</p>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
              What our clients say.
            </h2>
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ position: "relative", minHeight: 180 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: 0, transition: "opacity 0.6s ease, transform 0.6s ease", opacity: tIdx === i ? 1 : 0, transform: `translateY(${tIdx === i ? 0 : 20}px)`, pointerEvents: tIdx === i ? "auto" : "none" }}>
                  <Quote size={28} style={{ color: "#C8102E", margin: "0 auto 24px", display: "block", opacity: 0.6 }} />
                  <p style={{ fontSize: "clamp(17px,2vw,22px)", fontFamily: "Cormorant Garamond,serif", fontStyle: "italic", color: "#0A0A0A", lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ width: 40, height: 2, background: "#C8102E", margin: "0 auto 16px" }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter,sans-serif" }}>{t.name}</p>
                  <p style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>{t.org}</p>
                </div>
              ))}
            </div>
            {/* Dots */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 40 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTIdx(i)}
                  style={{ width: tIdx === i ? 24 : 8, height: 8, borderRadius: 4, background: tIdx === i ? "#C8102E" : "#E5E7EB", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════════ */}
      <section style={{ background: "#0A0A0A", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={S(0, { textAlign: "center", position: "relative" })}>
          <p className="t-label" style={{ marginBottom: 20, color: "#C8102E" }}>Get Started</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.05, marginBottom: 24, maxWidth: 640, margin: "0 auto 24px" }}>
            Commission an independent valuation.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 44, fontFamily: "Inter,sans-serif" }}>
            We respond within 24 hours · Mon–Sat · 9 AM – 7 PM IST
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "16px 34px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", fontFamily: "Inter,sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#9B0B22"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.transform = "none"; }}>
              Request a Valuation <ArrowRight size={16} />
            </Link>
            <Link href="/research" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.75)", padding: "16px 34px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.15)", transition: "all 0.25s", fontFamily: "Inter,sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}>
              Explore Research
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
