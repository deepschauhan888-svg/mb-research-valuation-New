"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import IndiaMap from "@/components/IndiaMap";
import { CityStats } from "@/types/valuation";

/* ── Coordinate helpers (equirectangular strip) ─────────────────────────────
   Strip: 1260 × 720 px  →  lon 0–180°, lat 90°N – 30°S
   Scale: 7 px / °lon, 6 px / °lat                                          */
const lx = (lon: number) => +(lon * 7).toFixed(0);
const ly = (lat: number) => +((90 - lat) * 6).toFixed(0);

/* ── Continent paths in strip coordinates ───────────────────────────────── */
const P_AFRICA = `M${lx(0)},${ly(34)} L${lx(13)},${ly(32)} L${lx(28)},${ly(31)}
  L${lx(35)},${ly(29)} L${lx(43)},${ly(22)} L${lx(52)},${ly(11)}
  L${lx(47)},${ly(-2)} L${lx(40)},${ly(-12)} L${lx(33)},${ly(-30)}
  L${lx(17)},${ly(-35)} L${lx(8)},${ly(-22)} L${lx(2)},${ly(-4)}
  L${lx(0)},${ly(6)} Z`.replace(/\n\s*/g, " ");

const P_ARABIA = `M${lx(32)},${ly(30)} L${lx(55)},${ly(30)}
  L${lx(58)},${ly(22)} L${lx(56)},${ly(13)} L${lx(44)},${ly(12)}
  L${lx(38)},${ly(18)} L${lx(32)},${ly(24)} Z`.replace(/\n\s*/g, " ");

const P_INDIA = `M${lx(68)},${ly(37)} L${lx(79)},${ly(35)}
  L${lx(97)},${ly(28)} L${lx(92)},${ly(22)} L${lx(89)},${ly(21)}
  L${lx(85)},${ly(19)} L${lx(80)},${ly(13)} L${lx(77)},${ly(8)}
  L${lx(76)},${ly(8)} L${lx(73)},${ly(14)} L${lx(72)},${ly(19)}
  L${lx(68)},${ly(22)} L${lx(67)},${ly(24)} L${lx(68)},${ly(28)} Z`.replace(/\n\s*/g, " ");

const P_PAKISTAN = `M${lx(60)},${ly(35)} L${lx(68)},${ly(37)}
  L${lx(68)},${ly(28)} L${lx(67)},${ly(24)} L${lx(63)},${ly(24)}
  L${lx(60)},${ly(28)} Z`.replace(/\n\s*/g, " ");

const P_SE_ASIA = `M${lx(97)},${ly(28)} L${lx(105)},${ly(22)}
  L${lx(108)},${ly(12)} L${lx(110)},${ly(20)} L${lx(103)},${ly(26)}
  L${lx(97)},${ly(28)} Z`.replace(/\n\s*/g, " ");

/* Globe strip starting & ending offsets
   Start: Middle East centred (lon ≈ 42)   → strip x=294 at SVG centre 300
   End:   India centred (lon ≈ 82, lat ≈ 23) → strip x=574, y=402              */
const START_X = 300 - lx(42);    //  =  6
const START_Y = 300 - ly(24);    //  = -96
const END_X   = 300 - lx(82);    //  = -274
const END_Y   = 300 - ly(23);    //  = -102

/* Graticule lines */
const GRAT_LONS = [0, 30, 60, 90, 120, 150];
const GRAT_LATS = [60, 30, 0, -30];

/* ── Counter animation ──────────────────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setV(Math.round(e * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => { raf = requestAnimationFrame(tick); }, 200);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-IN")}{suffix}</span>;
}

/* ── Globe SVG ──────────────────────────────────────────────────────────── */
function GlobeSVG() {
  return (
    <svg viewBox="0 0 600 600" width="100%" style={{ display: "block", maxWidth: 520, maxHeight: 520 }}>
      <defs>
        {/* Clip to sphere */}
        <clipPath id="g-clip"><circle cx="300" cy="300" r="238"/></clipPath>
        {/* Ocean fill */}
        <radialGradient id="g-ocean" cx="42%" cy="38%" r="58%">
          <stop offset="0%"   stopColor="#121E30"/>
          <stop offset="100%" stopColor="#080D16"/>
        </radialGradient>
        {/* 3-D sphere overlay — darkens edges */}
        <radialGradient id="g-rim" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="transparent"/>
          <stop offset="62%"  stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.72)"/>
        </radialGradient>
        {/* Specular highlight */}
        <radialGradient id="g-spec" cx="34%" cy="30%" r="30%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        {/* India glow filter */}
        <filter id="g-india-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Atmosphere gradient */}
        <radialGradient id="g-atm" cx="50%" cy="50%" r="50%">
          <stop offset="86%"  stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(80,140,255,0.09)"/>
        </radialGradient>
      </defs>

      {/* Atmosphere glow */}
      <circle cx="300" cy="300" r="252" fill="url(#g-atm)"/>

      <g clipPath="url(#g-clip)">
        {/* Ocean */}
        <rect width="600" height="600" fill="url(#g-ocean)"/>

        {/* Continent strip — GSAP animates this group */}
        <g className="g-strip" style={{ transform: `translate(${START_X}px, ${START_Y}px)` }}>

          {/* Graticule */}
          {GRAT_LONS.map(lon => (
            <line key={lon} x1={lx(lon)} y1={0} x2={lx(lon)} y2={720}
              stroke="rgba(140,185,255,0.09)" strokeWidth="0.6"/>
          ))}
          {GRAT_LATS.map(lat => (
            <line key={lat} x1={0} y1={ly(lat)} x2={1260} y2={ly(lat)}
              stroke="rgba(140,185,255,0.09)" strokeWidth="0.6"/>
          ))}
          {/* Equator — slightly brighter */}
          <line x1={0} y1={ly(0)} x2={1260} y2={ly(0)}
            stroke="rgba(140,185,255,0.16)" strokeWidth="0.8"/>
          {/* Tropic of Cancer (23.5°N) — dotted */}
          <line x1={0} y1={ly(23.5)} x2={1260} y2={ly(23.5)}
            stroke="rgba(200,16,46,0.18)" strokeWidth="0.5" strokeDasharray="4 6"/>

          {/* Continents (very subtle fill — continental shelves aesthetic) */}
          <path d={P_AFRICA}   fill="#16222E" stroke="rgba(150,190,240,0.12)" strokeWidth="0.5"/>
          <path d={P_ARABIA}   fill="#16222E" stroke="rgba(150,190,240,0.10)" strokeWidth="0.5"/>
          <path d={P_PAKISTAN} fill="#16222E" stroke="rgba(150,190,240,0.10)" strokeWidth="0.5"/>
          <path d={P_SE_ASIA}  fill="#16222E" stroke="rgba(150,190,240,0.10)" strokeWidth="0.5"/>

          {/* India — the focal point */}
          <path d={P_INDIA}
            fill="#1E2D44"
            stroke="rgba(200,16,46,0.65)"
            strokeWidth="1.0"
            filter="url(#g-india-glow)"
            className="g-india"/>
        </g>

        {/* 3-D sphere rim */}
        <circle cx="300" cy="300" r="238" fill="url(#g-rim)"/>
        {/* Specular */}
        <circle cx="300" cy="300" r="238" fill="url(#g-spec)"/>
      </g>

      {/* Sphere outline */}
      <circle cx="300" cy="300" r="238" fill="none" stroke="rgba(100,160,255,0.14)" strokeWidth="0.8"/>
    </svg>
  );
}

/* ── Cinematic intro ────────────────────────────────────────────────────── */
function GlobeIntro({ onDone }: { onDone: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"globe"|"stats">("globe");
  const [statsVisible, setStatsVisible] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  /* GSAP globe animation */
  useEffect(() => {
    let ctx: { revert(): void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        /* 1. Globe fades in */
        tl.fromTo(".g-globe-container",
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0)

        /* 2. Eyebrow line fades in */
          .fromTo(".g-eyebrow",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.6)

        /* 3. Continent strip rotates to India */
          .to(".g-strip",
          { x: END_X, y: END_Y, duration: 5.8, ease: "power1.inOut" }, 0.8)

        /* 4. India glow intensifies */
          .to(".g-india",
          { stroke: "rgba(200,16,46,0.95)", duration: 1.5, ease: "power2.out" }, 5.5)

        /* 5. Zoom in on globe */
          .to(".g-globe-container",
          { scale: 2.8, duration: 2.2, ease: "power3.in" }, 6.2)

        /* 6. Fade out globe */
          .to(".g-globe-wrap",
          { opacity: 0, duration: 0.7, ease: "power2.in" }, 7.8)

        /* 7. Show stats */
          .call(() => setPhase("stats"), [], 8.1)
          .call(() => setStatsVisible(true), [], 8.2);
      });
    })();
    return () => ctx?.revert();
  }, []);

  /* Skip on click */
  const skip = useCallback(() => {
    import("gsap").then(m => { m.default.globalTimeline.clear(); });
    finish();
  }, [finish]);

  return (
    <div ref={wrapRef}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "#050A12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

      {/* Globe phase */}
      {phase === "globe" && (
        <div className="g-globe-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p className="g-eyebrow" style={{ opacity: 0, fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(140,180,240,0.5)", marginBottom: 40 }}>
            MB Research · Pan-India Coverage
          </p>
          <div className="g-globe-container" style={{ opacity: 0, width: "min(72vw, 460px)", position: "relative" }}>
            <GlobeSVG/>
            {/* Vertical label — India */}
            <div className="g-india-label" style={{ position: "absolute", right: "8%", top: "42%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0 }}>
              <div style={{ width: 1, height: 24, background: "rgba(200,16,46,0.5)" }}/>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,16,46,0.7)", writingMode: "vertical-rl" }}>India</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats phase */}
      {phase === "stats" && (
        <StatsPanel visible={statsVisible} onDone={finish}/>
      )}

      {/* Skip button */}
      <button onClick={skip}
        style={{ position: "absolute", bottom: 40, right: 48, fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "7px 16px", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
        Skip intro
      </button>

      <style>{`
        @keyframes statFade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes statLine { from { transform:scaleX(0); } to { transform:scaleX(1); } }
      `}</style>
    </div>
  );
}

/* ── Stats panel ────────────────────────────────────────────────────────── */
function StatsPanel({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const STATS = [
    { num: 10,   pre: "",  suf: "",    label: "Cities Covered" },
    { num: 248,  pre: "",  suf: "+",   label: "Valuation Assignments" },
    { num: 4820, pre: "₹", suf: " Cr+",label: "Portfolio Assessed" },
  ];

  /* After stats display for ~3s, fade out and call onDone */
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  return (
    <div style={{ textAlign: "center", padding: "0 40px" }}>
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,16,46,0.7)", marginBottom: 48, animation: visible ? "statFade 0.6s ease both" : "none" }}>
        Pan-India Research Intelligence
      </p>
      <div style={{ display: "flex", gap: "clamp(32px,6vw,80px)", justifyContent: "center", flexWrap: "wrap" }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ animation: visible ? `statFade 0.7s ease ${i * 0.2 + 0.1}s both` : "none" }}>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(48px,8vw,88px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.025em", marginBottom: 12 }}>
              {visible ? <Counter to={s.num} prefix={s.pre} suffix={s.suf}/> : "0"}
            </div>
            <div style={{ width: 32, height: 1, background: "rgba(200,16,46,0.6)", margin: "0 auto 12px", animation: visible ? `statLine 0.6s ease ${i * 0.2 + 0.5}s both` : "none", transformOrigin: "left" }}/>
            <p style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Static page data ───────────────────────────────────────────────────── */
const CITY_INFO = [
  { city:"Mumbai",    region:"Mumbai Metropolitan Region", primary:true,  micro:"BKC · Lower Parel · Worli · Andheri · Powai" },
  { city:"Delhi NCR", region:"National Capital Region",    primary:true,  micro:"South Delhi · Dwarka · Vasant Kunj · Saket" },
  { city:"Bengaluru", region:"Bengaluru Urban",            primary:true,  micro:"Whitefield · Koramangala · Sarjapur · Hebbal" },
  { city:"Gurugram",  region:"NCR — Haryana",              primary:true,  micro:"Golf Course Road · Sohna Road · Dwarka Expressway" },
  { city:"Pune",      region:"Pune Metropolitan Region",   primary:false, micro:"Hinjewadi · Baner · Kharadi · Kalyani Nagar" },
  { city:"Hyderabad", region:"Hyderabad Metro",            primary:false, micro:"Gachibowli · HITEC City · Banjara Hills" },
  { city:"Chennai",   region:"Chennai Metropolitan Area",  primary:false, micro:"OMR · ECR · Anna Nagar · Velachery" },
  { city:"Noida",     region:"NCR — Uttar Pradesh",        primary:false, micro:"Sector 150 · Noida Extension · Greater Noida West" },
  { city:"Kolkata",   region:"Kolkata Metropolitan Area",  primary:false, micro:"New Town · Salt Lake · EM Bypass · Alipore" },
  { city:"Ahmedabad", region:"Ahmedabad Metro",            primary:false, micro:"SG Highway · Bopal · Prahlad Nagar · GIFT City" },
];

const EMPTY_STATS: CityStats[] = CITY_INFO.map(c => ({
  city: c.city, total: 0, residential: 0, commercial: 0,
  portfolio_value: 0, buy: 0, sell: 0, investment: 0,
}));

/* ── Map + directory content ────────────────────────────────────────────── */
function CoverageContent() {
  const listRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let ctx: { revert(): void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!listRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(".city-row",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current!, start: "top 85%", once: true } });
      }, listRef.current!);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section className="section" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 20 }}>Coverage</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "end" }}>
            <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.06 }}>
              Active across<br/><em style={{ fontStyle: "italic", color: "var(--red)" }}>10 Indian cities.</em>
            </h1>
            <div>
              <p className="t-body" style={{ marginBottom: 16 }}>MB Research maintains deep micro-market intelligence across 10 cities — from primary metros to emerging corridors.</p>
              <p style={{ fontSize: 14, color: "var(--faint)", fontFamily: "Inter,sans-serif", lineHeight: 1.7 }}>Our coverage tracks sub-localities, new supply pipelines, pricing corridors, and RERA filings at the project level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section-sm" style={{ background: "var(--cream-2)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap"><IndiaMap cityStats={EMPTY_STATS}/></div>
      </section>

      {/* City directory */}
      <section className="section" ref={listRef as React.RefObject<HTMLElement>}>
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 14 }}>Market Directory</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 40 }}>City-by-city coverage.</h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--white)" }}>
            {CITY_INFO.map((c, i) => (
              <div key={c.city} className="city-row"
                style={{ opacity: 0, display: "grid", gridTemplateColumns: "180px 1fr 1.5fr", gap: 24, alignItems: "center", padding: "20px 28px", borderBottom: i < CITY_INFO.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.primary ? "var(--red)" : "var(--border-2)", flexShrink: 0 }}/>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>{c.city}</span>
                </div>
                <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter,sans-serif" }}>{c.region}</span>
                <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter,sans-serif" }}>{c.micro}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function CoveragePage() {
  const [phase, setPhase] = useState<"loading"|"intro"|"map">("loading");
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    /* Check if visitor has already seen the intro */
    if (sessionStorage.getItem("mbr_cov_seen")) {
      setPhase("map");
      setMapVisible(true);
    } else {
      setPhase("intro");
    }
  }, []);

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem("mbr_cov_seen", "1");
    setPhase("map");
    /* Small delay so the dark-to-light transition feels intentional */
    setTimeout(() => setMapVisible(true), 80);
  }, []);

  return (
    <>
      {/* Cinematic intro (first visit only) */}
      {phase === "intro" && <GlobeIntro onDone={handleIntroDone}/>}

      {/* Coverage content — fades in after intro */}
      <div style={{ opacity: mapVisible ? 1 : 0, transition: "opacity 0.9s ease", pointerEvents: mapVisible ? "all" : "none" }}>
        {(phase === "map" || phase === "intro") && <CoverageContent/>}
      </div>

      {/* Loading state: blank dark screen until session checked */}
      {phase === "loading" && (
        <div style={{ minHeight: "100vh", background: "var(--cream)" }}/>
      )}
    </>
  );
}
