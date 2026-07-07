"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";

function useReveal(sel: string, stagger = 0.1) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let ctx: { revert(): void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(sel, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.85, stagger, ease: "power3.out",
          scrollTrigger: { trigger: ref.current!, start: "top 84%", once: true }
        });
      }, ref.current!);
    })();
    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

const PUBS = [
  { tag: "Quarterly Index", color: "#3B82F6", title: "PropIndex",
    desc: "Quarterly residential price benchmarks tracked across 10 cities and 40+ micro-markets, indexed against historical baselines.",
    period: "Q2 2025", pages: "32 pages" },
  { tag: "Quarterly Index", color: "#10B981", title: "Rental Yield Index",
    desc: "Net and gross rental yield tracking for residential and commercial segments, benchmarked against capital value movement.",
    period: "Q2 2025", pages: "24 pages" },
  { tag: "Sentiment Study", color: "#F59E0B", title: "Housing Sentiment Index",
    desc: "Demand-side signals, consumer confidence indicators, and transaction velocity across primary and secondary markets.",
    period: "H1 2025", pages: "18 pages" },
  { tag: "Deep Dive", color: "#8B5CF6", title: "Micro-Market Reports",
    desc: "Granular analysis of supply, demand, and pricing dynamics within specific corridors and emerging micro-markets.",
    period: "Ongoing", pages: "Varies" },
];

function PubCard({ p }: { p: typeof PUBS[number] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--white)", border: `1px solid ${hov ? p.color + "50" : "var(--border)"}`,
        borderRadius: 18, padding: "clamp(28px,3vw,40px)",
        transition: "all 0.35s cubic-bezier(0.76,0,0.24,1)",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 24px 60px rgba(0,0,0,0.08)" : "none",
        position: "relative", overflow: "hidden", cursor: "default",
      }}
    >
      {/* Corner fold */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 0, height: 0,
        borderStyle: "solid",
        borderWidth: hov ? "0 36px 36px 0" : "0 0 0 0",
        borderColor: `transparent ${p.color}30 transparent transparent`,
        transition: "border-width 0.35s cubic-bezier(0.76,0,0.24,1)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: p.color, background: `${p.color}14`, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{p.tag}</span>
        <span style={{ fontSize: 11, color: "var(--faint)", fontFamily: "DM Mono,monospace" }}>{p.period}</span>
      </div>

      <h3 style={{
        fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400,
        color: "var(--ink)", marginBottom: 14, letterSpacing: "-0.015em",
        transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)",
        transform: hov ? "translateX(4px)" : "none",
      }}>{p.title}</h3>

      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, marginBottom: 28, fontFamily: "Inter,sans-serif" }}>{p.desc}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "DM Mono,monospace" }}>{p.pages}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: p.color, fontFamily: "Inter,sans-serif" }}>
          Access Report
          <ArrowUpRight size={13} style={{ transform: hov ? "translate(2px,-2px)" : "none", transition: "transform 0.25s" }} />
        </span>
      </div>
    </div>
  );
}

export default function Research() {
  const r1 = useReveal(".rh", 0.12) as React.RefObject<HTMLElement>;
  const r2 = useReveal(".rp", 0.1) as React.RefObject<HTMLElement>;

  return (
    <div style={{ paddingTop: 64 }}>
      <section className="section" style={{ borderBottom: "1px solid var(--border)" }} ref={r1}>
        <div className="wrap">
          <p className="t-label rh" style={{ marginBottom: 20 }}>Research & Intelligence</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "end" }}>
            <h1 className="rh" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.06 }}>
              Independent market<br /><em style={{ fontStyle: "italic", color: "var(--faint)" }}>intelligence, published.</em>
            </h1>
            <p className="rh t-body">Every assignment feeds our proprietary intelligence database. These publications surface the patterns our research uncovers — available to institutional clients and subscribers.</p>
          </div>
        </div>
      </section>

      <section className="section" ref={r2}>
        <div className="wrap">
          <div className="rp" style={{ opacity: 0, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, marginBottom: 60 }}>
            {PUBS.map(p => <PubCard key={p.title} p={p} />)}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--black)", padding: "clamp(64px,7vw,100px) 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(200,16,46,0.07) 0%, transparent 70%)" }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "rgba(200,16,46,0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Mail size={20} style={{ color: "var(--red)" }} />
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>Research Newsletter</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginBottom: 36, maxWidth: 440, margin: "0 auto 36px", fontFamily: "Inter,sans-serif" }}>Quarterly market intelligence delivered to your inbox. No spam — only research that matters.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 440, margin: "0 auto" }}>
            <input type="email" placeholder="you@institution.com" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#fff", outline: "none", fontFamily: "Inter,sans-serif" }} />
            <button style={{ background: "var(--red)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "background 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--red-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--red)"}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}