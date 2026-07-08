"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

function useGsapReveal(sel: string, stagger = 0.1) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let ctx: { revert(): void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(sel,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.85, stagger, ease: "power3.out",
            scrollTrigger: { trigger: ref.current!, start: "top 82%", once: true } });
      }, ref.current!);
    })();
    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

function Count({ to, prefix="", suffix="" }: { to: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1800, 1);
        setV(Math.round((1 - Math.pow(1 - p, 4)) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

const BUILDINGS = [
  { x:20,  w:42, h:260, ws:[[8,20],[8,60],[8,100],[8,140],[8,180],[28,20],[28,60],[28,100],[28,140],[28,180]] },
  { x:74,  w:30, h:340, ws:[[6,20],[6,60],[6,100],[6,140],[6,180],[6,220],[20,20],[20,60],[20,100],[20,140],[20,180],[20,220]] },
  { x:116, w:56, h:200, ws:[[8,20],[8,60],[8,100],[28,20],[28,60],[28,100],[44,20],[44,60],[44,100]] },
  { x:184, w:36, h:310, ws:[[7,20],[7,60],[7,100],[7,140],[7,200],[7,240],[24,20],[24,60],[24,100],[24,140],[24,200],[24,240]] },
  { x:232, w:50, h:390, ws:[[8,20],[8,60],[8,100],[8,140],[8,180],[8,220],[8,260],[8,300],[34,20],[34,60],[34,100],[34,140],[34,180],[34,220],[34,260],[34,300]] },
  { x:294, w:34, h:230, ws:[[7,20],[7,60],[7,100],[7,140],[22,20],[22,60],[22,100],[22,140]] },
  { x:340, w:62, h:320, ws:[[10,20],[10,60],[10,100],[10,140],[10,200],[10,240],[10,280],[42,20],[42,60],[42,100],[42,140],[42,200],[42,240],[42,280]] },
  { x:414, w:28, h:190, ws:[[6,20],[6,60],[6,100],[18,20],[18,60],[18,100]] },
  { x:454, w:44, h:270, ws:[[8,20],[8,60],[8,100],[8,140],[8,200],[30,20],[30,60],[30,100],[30,140],[30,200]] },
  { x:510, w:32, h:360, ws:[[6,20],[6,60],[6,100],[6,140],[6,200],[6,240],[6,280],[22,20],[22,60],[22,100],[22,140],[22,200],[22,240],[22,280]] },
  { x:554, w:54, h:225, ws:[[9,20],[9,60],[9,100],[36,20],[36,60],[36,100]] },
  { x:620, w:40, h:295, ws:[[7,20],[7,60],[7,100],[7,140],[7,200],[27,20],[27,60],[27,100],[27,140],[27,200]] },
  { x:672, w:36, h:345, ws:[[6,20],[6,60],[6,100],[6,140],[6,200],[6,240],[24,20],[24,60],[24,100],[24,140],[24,200],[24,240]] },
  { x:720, w:48, h:205, ws:[[8,20],[8,60],[8,100],[32,20],[32,60],[32,100]] },
  { x:780, w:30, h:280, ws:[[6,20],[6,60],[6,100],[6,140],[20,20],[20,60],[20,100],[20,140]] },
];

function Cityscape() {
  return (
    <svg viewBox="0 820 820 420" style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", height:"auto", maxHeight:"68vh", display:"block", pointerEvents:"none" }}>
      <defs>
        <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8102E" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#C8102E" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="1240" x2="820" y2="1240" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      {BUILDINGS.map((b, i) => (
        <g key={i} style={{ animation:`buildingRise 1.3s cubic-bezier(0.76,0,0.24,1) ${0.04*i+0.3}s both` }}>
          <rect x={b.x} y={1240-b.h} width={b.w} height={b.h}
            fill={`rgba(255,255,255,${0.015+(i%4)*0.007})`} stroke="rgba(255,255,255,0.055)" strokeWidth="0.5"/>
          {b.ws.map(([wx,wy],wi) => (
            <rect key={wi} x={b.x+wx} y={1240-b.h+wy} width={5} height={8}
              fill="rgba(255,210,120,0.7)"
              style={{ animation:`windowGlow ${2+(wi%5)}s ease-in-out infinite ${wi*0.18}s` }}/>
          ))}
          {b.h > 290 && <line x1={b.x+b.w/2} y1={1240-b.h} x2={b.x+b.w/2} y2={1240-b.h-18} stroke="rgba(255,255,255,0.15)" strokeWidth="0.7"/>}
        </g>
      ))}
      <rect x="0" y="1220" width="820" height="20" fill="url(#gnd)"/>
      <rect x="-100" y="820" width="70" height="420" fill="rgba(255,255,255,0.012)"
        style={{ animation:"lightSweep 9s ease-in-out infinite 2s" }}/>
    </svg>
  );
}

const QUOTES = [
  { q:"MB Research provided an exceptionally thorough valuation. Their independence gave our credit committee full confidence.", who:"Head of Credit Risk", org:"Leading Private Sector Bank" },
  { q:"In a market full of conflicts, MB Research stands apart. Research-first approach, consistently accurate and timely.", who:"Investment Director", org:"Real Estate Private Equity Fund" },
  { q:"The depth of micro-market intelligence and rigour of comparable analysis is unlike anything we have seen.", who:"Chief Risk Officer", org:"Housing Finance Company" },
];
const CLIENTS = ["Banks","NBFCs","Developers","Private Equity","Family Offices","Institutional Investors","Housing Finance","Investment Funds"];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const stRef = useGsapReveal(".st-el", 0.1) as React.RefObject<HTMLElement>;
  const srvRef = useGsapReveal(".sv-el", 0.12) as React.RefObject<HTMLElement>;
  const numRef = useGsapReveal(".nm-el", 0.1) as React.RefObject<HTMLElement>;
  const covRef = useGsapReveal(".cv-el", 0.05) as React.RefObject<HTMLElement>;
  const resRef = useGsapReveal(".re-el", 0.1) as React.RefObject<HTMLElement>;
  const [qi, setQi] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQi(i => (i+1) % QUOTES.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      const gsap = (await import("gsap")).default;
      const tl = gsap.timeline({ defaults: { ease:"power4.out" } });
      tl.fromTo(".h-word",  { yPercent:110 }, { yPercent:0, duration:1.1, stagger:0.06 }, 0.4)
        .fromTo(".h-sub",   { opacity:0, y:20 }, { opacity:1, y:0, duration:0.8 }, 1.3)
        .fromTo(".h-cta",   { opacity:0, y:16 }, { opacity:1, y:0, duration:0.7 }, 1.55)
        .fromTo(".h-scr",   { opacity:0 }, { opacity:1, duration:0.6 }, 2.0);
    })();
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="hero-dark" style={{ minHeight:"100svh", display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingBottom:"clamp(56px,7vw,100px)", position:"relative" }}>
        <div className="arch-grid"/>
        <div className="glow-orb" style={{ width:700, height:700, top:"5%", left:"50%", transform:"translateX(-50%)" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(12,12,11,0.92) 0%, rgba(12,12,11,0.25) 55%, transparent 100%)", pointerEvents:"none" }}/>
        <Cityscape/>

        <div className="wrap" style={{ position:"relative", zIndex:2 }}>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(56px,9vw,120px)", fontWeight:400, lineHeight:0.97, letterSpacing:"-0.025em", color:"#fff", marginBottom:36, maxWidth:900 }}>
            {[["Intelligence","normal","#fff"],["Behind Every","italic","rgba(255,255,255,0.55)"],["Square Foot.","normal","#fff"]].map(([line,style,color],i) => (
              <span key={i} style={{ display:"block", overflow:"hidden" }}>
                <span className="h-word" style={{ display:"inline-block", fontStyle:style as "italic"|"normal", color:color as string }}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="h-sub" style={{ opacity:0, fontFamily:"Inter,sans-serif", fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,0.5)", maxWidth:480, marginBottom:40 }}>
            India&apos;s independent real estate valuation firm. Conflict-free research trusted by banks, NBFCs, developers, and institutional investors.
          </p>

          <div className="h-cta" style={{ opacity:0, display:"flex", gap:12, flexWrap:"wrap", marginBottom:56 }}>
            <Link href="/enquiry" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--red)", color:"#fff", padding:"13px 26px", borderRadius:7, fontSize:14, fontWeight:600, fontFamily:"Inter,sans-serif", transition:"background 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--red-dark)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--red)"}>
              Request a Valuation <ArrowRight size={15}/>
            </Link>
            <Link href="/about" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.75)", padding:"13px 26px", borderRadius:7, fontSize:14, fontWeight:500, fontFamily:"Inter,sans-serif", border:"1px solid rgba(255,255,255,0.1)", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.13)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}>
              Our Story
            </Link>
          </div>

        </div>

        <div className="h-scr" style={{ opacity:0, position:"absolute", right:"clamp(24px,4vw,48px)", bottom:40, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ width:1, height:40, background:"rgba(255,255,255,0.15)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"50%", background:"rgba(255,255,255,0.5)", animation:"scrollDot 1.6s ease-in-out infinite" }}/>
          </div>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:"0.2em", textTransform:"uppercase", writingMode:"vertical-rl", fontFamily:"Inter,sans-serif" }}>Scroll</span>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ background:"var(--ink)", padding:"16px 0", overflow:"hidden" }}>
        <div className="marquee-inner">
          {[...Array(2)].flatMap(()=>CLIENTS.map((c,i)=>(
            <div key={`${c}-${i}`} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
              <span style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.2em", textTransform:"uppercase", padding:"0 32px", whiteSpace:"nowrap", fontFamily:"Inter,sans-serif" }}>{c}</span>
              <span style={{ color:"var(--red)", fontSize:10 }}>·</span>
            </div>
          )))}
        </div>
      </div>

      {/* ═══ STATEMENT ═══ */}
      <section ref={stRef} className="section">
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(40px,6vw,80px)", alignItems:"start" }}>
            <div>
              <p className="t-label st-el" style={{ marginBottom:24 }}>Who We Are</p>
              <h2 className="st-el" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:400, lineHeight:1.05, letterSpacing:"-0.02em", color:"var(--ink)" }}>
                We don&apos;t value<br/>properties. We<br/><em style={{ fontStyle:"italic", color:"var(--faint)" }}>build conviction.</em>
              </h2>
            </div>
            <div style={{ paddingTop:"clamp(32px,4vw,56px)" }}>
              <p className="t-body st-el" style={{ marginBottom:24 }}>
                MB Research was founded to end a structural problem in Indian real estate: the conflict between advisors who sell and advisors who value. We do only one — and we do it independently.
              </p>
              <p className="t-body st-el" style={{ marginBottom:32 }}>
                No brokerage desk. No referral incentives. No predetermined outcomes. Every valuation reflects only what the data shows.
              </p>
              <Link href="/about" className="hover-line st-el" style={{ fontSize:14, fontWeight:600, color:"var(--ink)", fontFamily:"Inter,sans-serif", display:"inline-flex", alignItems:"center", gap:6 }}>
                The full story <ArrowUpRight size={14}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section ref={srvRef} style={{ background:"var(--ink)", padding:"clamp(72px,8vw,120px) 0" }}>
        <div className="wrap">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"clamp(36px,4vw,56px)", flexWrap:"wrap", gap:16 }}>
            <p style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.25)", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"Inter,sans-serif" }}>Services</p>
            <Link href="/services" style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontFamily:"Inter,sans-serif", display:"flex", alignItems:"center", gap:5, transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
              View all <ArrowRight size={13}/>
            </Link>
          </div>
          {[
            { n:"01", title:"Residential Valuation", sub:"Apartments · Villas · Plots", href:"/services#residential" },
            { n:"02", title:"Commercial Valuation",  sub:"Offices · Retail · Warehouses", href:"/services#commercial" },
            { n:"03", title:"Investment Advisory",   sub:"Buy · Sell · Hold", href:"/services#advisory" },
          ].map((s,i) => (
            <Link key={i} href={s.href} className="sv-el"
              style={{ opacity:0, display:"flex", alignItems:"center", padding:"26px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", gap:20, transition:"padding 0.3s cubic-bezier(0.76,0,0.24,1)", textDecoration:"none" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.paddingLeft="18px"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.paddingLeft="0"; }}>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"rgba(255,255,255,0.18)", width:28, flexShrink:0 }}>{s.n}</span>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(22px,4vw,48px)", fontWeight:400, color:"#fff", flex:1, letterSpacing:"-0.015em" }}>{s.title}</h3>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)", fontFamily:"Inter,sans-serif", flexShrink:0 }}>{s.sub}</span>
              <ArrowUpRight size={16} style={{ color:"rgba(255,255,255,0.18)", flexShrink:0 }}/>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ NUMBERS ═══ */}
      <section ref={numRef} style={{ background:"var(--cream-2)" }}>
        <div className="wrap" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"var(--border)" }}>
          {[
            { to:248, sfx:"+", label:"Assignments Completed", sub:"Across all asset classes" },
            { to:10,  sfx:"",  label:"Cities Covered",        sub:"Primary metros to corridors" },
            { to:100, sfx:"%", label:"Conflict-Free Research", sub:"No brokerage · No bias" },
          ].map((n,i) => (
            <div key={i} className="nm-el" style={{ opacity:0, background:"var(--cream-2)", padding:"clamp(40px,5vw,64px) clamp(24px,4vw,48px)" }}>
              <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(52px,7vw,96px)", fontWeight:400, color:"var(--ink)", lineHeight:1, letterSpacing:"-0.025em", marginBottom:14 }}>
                <Count to={n.to} suffix={n.sfx}/>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", fontFamily:"Inter,sans-serif", marginBottom:5 }}>{n.label}</p>
              <p style={{ fontSize:12, color:"var(--faint)", fontFamily:"Inter,sans-serif" }}>{n.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COVERAGE TEASER ═══ */}
      <section ref={covRef} className="section-sm" style={{ background:"var(--cream)" }}>
        <div className="wrap">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"clamp(28px,3vw,40px)", flexWrap:"wrap", gap:16 }}>
            <p className="t-label">Coverage</p>
            <Link href="/coverage" className="hover-line" style={{ fontSize:13, color:"var(--muted)", fontFamily:"Inter,sans-serif", display:"flex", alignItems:"center", gap:5 }}>
              Interactive Map <ArrowUpRight size={13}/>
            </Link>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"clamp(12px,2vw,24px)", alignItems:"baseline" }}>
            {[{c:"Mumbai",p:true},{c:"Delhi NCR",p:true},{c:"Bengaluru",p:true},{c:"Gurugram",p:true},{c:"Pune"},{c:"Hyderabad"},{c:"Chennai"},{c:"Noida"},{c:"Kolkata"},{c:"Ahmedabad"}].map(({c,p},i) => (
              <Link key={c} href="/coverage" className="cv-el"
                style={{ opacity:0, fontFamily:"Cormorant Garamond,serif", fontSize:`clamp(${p?"28px":"22px"},${p?"3.5":"2.8"}vw,${p?"46px":"36px"})`, fontWeight:400, color:p?"var(--ink)":"var(--faint)", letterSpacing:"-0.01em", transition:"color 0.2s", textDecoration:"none" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
                onMouseLeave={e=>e.currentTarget.style.color=p?"var(--ink)":"var(--faint)"}>
                {c}{i<9&&<span style={{ color:"var(--border-2)", marginLeft:"0.3em", fontSize:"0.45em" }}>·</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH PREVIEW ═══ */}
      <section ref={resRef} style={{ background:"var(--ink)", padding:"clamp(72px,8vw,120px) 0" }}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(40px,6vw,80px)", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.25)", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"Inter,sans-serif", marginBottom:24 }} className="re-el">Publications</p>
              <h2 className="re-el" style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(32px,5vw,60px)", fontWeight:400, color:"#fff", lineHeight:1.06, letterSpacing:"-0.02em", marginBottom:24 }}>
                Research &amp; Market<br/><em style={{ fontStyle:"italic", color:"rgba(255,255,255,0.35)" }}>Intelligence.</em>
              </h2>
              <p className="re-el t-body" style={{ color:"rgba(255,255,255,0.4)", marginBottom:36 }}>
                Every assignment feeds our intelligence database. These publications surface the patterns our research uncovers.
              </p>
              <Link href="/research" className="re-el" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.75)", padding:"11px 20px", borderRadius:7, fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif", border:"1px solid rgba(255,255,255,0.09)", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.11)"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}>
                All Publications <ArrowRight size={14}/>
              </Link>
            </div>
            <div className="re-el" style={{ opacity:0, display:"flex", flexDirection:"column" }}>
              {[
                { tag:"Quarterly Index", title:"PropIndex", desc:"Residential price benchmarks across 10 cities and 40+ micro-markets.", color:"#3B82F6" },
                { tag:"Quarterly Index", title:"Rental Yield Index", desc:"Net and gross yield tracking across residential and commercial segments.", color:"#10B981" },
                { tag:"Deep Dive",       title:"Micro-Market Reports", desc:"Supply, demand, and pricing dynamics in specific corridors.", color:"#8B5CF6" },
              ].map((r,i) => (
                <Link key={i} href="/research" style={{ display:"block", padding:"20px 22px", background:"rgba(255,255,255,0.03)", borderTop:i===0?"1px solid rgba(255,255,255,0.06)":"none", borderBottom:"1px solid rgba(255,255,255,0.06)", transition:"background 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <span style={{ fontSize:9, fontWeight:700, color:r.color, letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"Inter,sans-serif" }}>{r.tag}</span>
                      <h4 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:22, fontWeight:400, color:"#fff", marginTop:4, marginBottom:6 }}>{r.title}</h4>
                      <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", fontFamily:"Inter,sans-serif" }}>{r.desc}</p>
                    </div>
                    <ArrowUpRight size={15} style={{ color:"rgba(255,255,255,0.15)", flexShrink:0, marginTop:4 }}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="section" style={{ background:"var(--cream-2)" }}>
        <div className="wrap" style={{ maxWidth:860 }}>
          <p className="t-label" style={{ textAlign:"center", marginBottom:48 }}>What Clients Say</p>
          <div style={{ position:"relative", minHeight:200 }}>
            {QUOTES.map((q,i) => (
              <div key={i} style={{ position:i===0?"relative":"absolute", inset:0, opacity:qi===i?1:0, transform:`translateY(${qi===i?0:16}px)`, transition:"opacity 0.7s ease, transform 0.7s ease", pointerEvents:qi===i?"auto":"none" }}>
                <div style={{ width:28, height:1, background:"var(--red)", margin:"0 auto 32px" }}/>
                <blockquote style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(20px,3vw,30px)", fontWeight:400, fontStyle:"italic", color:"var(--ink)", lineHeight:1.5, textAlign:"center", marginBottom:32 }}>
                  &ldquo;{q.q}&rdquo;
                </blockquote>
                <p style={{ textAlign:"center", fontSize:13, fontWeight:600, color:"var(--ink)", fontFamily:"Inter,sans-serif", marginBottom:3 }}>{q.who}</p>
                <p style={{ textAlign:"center", fontSize:12, color:"var(--faint)", fontFamily:"Inter,sans-serif" }}>{q.org}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:40 }}>
            {QUOTES.map((_,i) => (
              <button key={i} onClick={()=>setQi(i)}
                style={{ width:qi===i?22:6, height:6, borderRadius:3, background:qi===i?"var(--red)":"var(--border-2)", border:"none", cursor:"pointer", transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background:"var(--red)", padding:"clamp(72px,8vw,120px) 0" }}>
        <div className="wrap" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:32 }}>
          <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(32px,5vw,64px)", fontWeight:400, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.06 }}>
            Commission a<br/><em style={{ fontStyle:"italic", color:"rgba(255,255,255,0.6)" }}>valuation today.</em>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Link href="/enquiry" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", color:"var(--red)", padding:"14px 28px", borderRadius:7, fontSize:15, fontWeight:700, fontFamily:"Inter,sans-serif", transition:"background 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              Get in Touch <ArrowRight size={15}/>
            </Link>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", fontFamily:"Inter,sans-serif", textAlign:"center" }}>Response within 24 hours · Mon–Sat</p>
          </div>
        </div>
      </section>
    </>
  );
}