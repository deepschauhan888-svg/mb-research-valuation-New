"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        gsap.fromTo(sel, { opacity:0, y:32 }, { opacity:1, y:0, duration:0.85, stagger, ease:"power3.out",
          scrollTrigger: { trigger: ref.current!, start:"top 84%", once:true } });
      }, ref.current!);
    })();
    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
const METHOD=[
  {n:"01",t:"Intake & Scoping",b:"Define purpose, applicable standard, value premise, and deliverable format."},
  {n:"02",t:"Site Inspection",b:"Physical inspection of every asset. Photography, measurement, condition assessment."},
  {n:"03",t:"Market Research",b:"RERA data, sub-registrar transactions, developer pricing — sourced and verified."},
  {n:"04",t:"Comparable Analysis",b:"3–5 verified transactions adjusted for floor, age, view, amenities, and time."},
  {n:"05",t:"Valuation Modelling",b:"Sales Comparison, Income Capitalisation, or DCF applied and reconciled."},
  {n:"06",t:"Senior Review",b:"Independent review of all assumptions, comparables, and the final value conclusion."},
  {n:"07",t:"Report Delivery",b:"Delivered in agreed format. Archived in the MB Research intelligence database."},
];
export default function About() {
  const r1 = useReveal(".a1", 0.1) as React.RefObject<HTMLElement>;
  const r2 = useReveal(".a2", 0.08) as React.RefObject<HTMLElement>;
  const r3 = useReveal(".a3", 0.07) as React.RefObject<HTMLElement>;
  return (
    <div style={{ paddingTop:64 }}>
      {/* HERO */}
      <section className="section" style={{ borderBottom:"1px solid var(--border)" }}>
        <div className="wrap">
          <p className="t-label" style={{ marginBottom:20 }}>Our Story</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(32px,5vw,72px)", alignItems:"start" }}>
            <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(40px,5.5vw,72px)", fontWeight:400, letterSpacing:"-0.025em", color:"var(--ink)", lineHeight:1.06 }}>
              Founded to end<br/><em style={{ fontStyle:"italic", color:"var(--faint)" }}>conflicts of interest.</em>
            </h1>
            <div style={{ paddingTop:"clamp(16px,2vw,32px)" }}>
              <p className="t-body" style={{ marginBottom:20 }}>MB Research was founded on a single conviction: property valuation must be driven by rigorous, independent analysis — not relationships, commercial convenience, or outcomes a client already expects.</p>
              <p className="t-body">Every assignment we complete enters our proprietary intelligence database — building a compound research advantage that no firm juggling brokerage and advisory can match.</p>
            </div>
          </div>
        </div>
      </section>
      {/* PRINCIPLES */}
      <section className="section" ref={r1}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(32px,5vw,72px)" }}>
            <div>
              <p className="t-label a1" style={{ marginBottom:18 }}>What Makes Us Different</p>
              <p className="t-body a1" style={{ marginBottom:18 }}>The Indian real estate industry is characterised by structural conflicts. Most valuation firms simultaneously operate as brokers and developers — making true independence impossible.</p>
              <p className="t-body a1" style={{ marginBottom:32 }}>MB Research carries none of those relationships. We have no brokerage desk. We earn no commissions. We carry no referral incentives. Our only product is research.</p>
              <p className="t-label a1" style={{ marginBottom:14 }}>Who Trusts Us</p>
              {["Banks & NBFCs","Real Estate Developers","Private Equity Firms","Family Offices","Institutional Investors","Housing Finance Companies"].map((c,i) => (
                <div key={c} className="a1" style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:"1px solid var(--border)", fontSize:14, color:"var(--muted)", fontFamily:"Inter,sans-serif" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--red)", flexShrink:0 }}/>{c}
                </div>
              ))}
            </div>
            <div>
              <p className="t-label a1" style={{ marginBottom:18 }}>Our Principles</p>
              {[
                {t:"Independence above all",d:"A valuation that confirms what the client wants to hear is not a valuation — it is a liability."},
                {t:"Every assumption is visible",d:"Our reports show every comparable, every adjustment, and every assumption. Credit committees can verify our work."},
                {t:"Data before opinion",d:"Market views are checked against the transaction record. When data conflicts with opinion, data wins."},
                {t:"Senior sign-off on everything",d:"No report leaves without review at a senior level. There are no junior-only assignments at MB Research."},
              ].map(p => (
                <div key={p.t} className="a1" style={{ padding:"20px 22px", background:"var(--white)", border:"1px solid var(--border)", borderRadius:12, marginBottom:10 }}>
                  <h3 style={{ fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:6, fontFamily:"Inter,sans-serif" }}>{p.t}</h3>
                  <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65, fontFamily:"Inter,sans-serif" }}>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* METHODOLOGY */}
      <section className="section" style={{ background:"var(--cream-2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }} ref={r2}>
        <div className="wrap">
          <p className="t-label a2" style={{ marginBottom:18 }}>Methodology</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(32px,5vw,64px)", alignItems:"start" }}>
            <div>
              <h2 className="a2" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(28px,3.5vw,48px)", fontWeight:400, letterSpacing:"-0.02em", color:"var(--ink)", lineHeight:1.12, marginBottom:24 }}>
                How we arrive<br/><em style={{ fontStyle:"italic", color:"var(--faint)" }}>at a number.</em>
              </h2>
              <p className="t-body a2" style={{ marginBottom:28 }}>Every assignment follows a rigorous, documented process designed to meet institutional lending, investment, and compliance standards. Nothing is estimated. Everything is verified.</p>
              {[["Standards","RICS · IVS · RBI Guidelines"],["Data Sources","RERA · Sub-Registrar · Proprietary DB"],["Comparables","Minimum 3–5 verified transactions"]].map(([l,v]) => (
                <div key={l} className="a2" style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--border)", fontSize:13, fontFamily:"Inter,sans-serif" }}>
                  <span style={{ color:"var(--faint)" }}>{l}</span>
                  <span style={{ color:"var(--muted)", fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="a2" style={{ opacity:0, border:"1px solid var(--border)", borderRadius:14, overflow:"hidden", background:"var(--white)" }}>
              {METHOD.map((m,i) => (
                <div key={m.n} style={{ padding:"18px 22px", borderBottom:i<METHOD.length-1?"1px solid var(--border)":"none" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"var(--red)", marginBottom:8, fontFamily:"DM Mono,monospace" }}>{m.n}</div>
                  <h3 style={{ fontSize:14, fontWeight:600, color:"var(--ink)", marginBottom:4, fontFamily:"Inter,sans-serif" }}>{m.t}</h3>
                  <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.65, fontFamily:"Inter,sans-serif" }}>{m.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section style={{ background:"var(--black)", padding:"clamp(64px,7vw,100px) 0" }} ref={r3}>
        <div className="wrap" style={{ textAlign:"center" }}>
          <h2 className="a3" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(28px,4vw,52px)", fontWeight:400, color:"#fff", letterSpacing:"-0.02em", marginBottom:16 }}>Commission a valuation today.</h2>
          <p className="a3" style={{ fontSize:15, color:"rgba(255,255,255,0.35)", marginBottom:32, fontFamily:"Inter,sans-serif" }}>Independent. Institutional. Reliable.</p>
          <Link href="/enquiry" className="a3" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--red)", color:"#fff", padding:"13px 28px", borderRadius:7, fontSize:14, fontWeight:600, fontFamily:"Inter,sans-serif", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--red-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--red)"}>
            Get in Touch <ArrowRight size={14}/>
          </Link>
        </div>
      </section>
    </div>
  );
}