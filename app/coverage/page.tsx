"use client";
import { useEffect, useRef, useState } from "react";
import { CityStats } from "@/types/valuation";
import IndiaMap from "@/components/IndiaMap";

/* ── Static city list (public page — no analyst data) ────────────────────── */
const EMPTY_STATS: CityStats[] = [
  "Mumbai","Delhi NCR","Bengaluru","Gurugram","Pune",
  "Hyderabad","Chennai","Noida","Kolkata","Ahmedabad",
].map(city => ({ city, total:0, residential:0, commercial:0, portfolio_value:0, buy:0, sell:0, investment:0 }));

/* ── Continent polygon data (lon, lat) ───────────────────────────────────── */
const CONTINENTS = [
  { d: [[-17,14],[-14,20],[-5,27],[0,30],[10,34],[20,38],[36,32],[40,22],[43,16],[50,12],[52,5],[44,10],[38,12],[32,12],[35,-18],[24,-34],[18,-35],[8,-22],[2,-4],[0,5],[-5,4],[-10,5],[-17,14]] },
  { d: [[-80,8],[-74,2],[-65,-2],[-52,-4],[-40,-7],[-38,-12],[-40,-22],[-48,-28],[-54,-34],[-60,-42],[-68,-54],[-72,-42],[-66,-28],[-62,-18],[-66,-8],[-72,-2],[-78,0],[-80,8]] },
  { d: [[-170,72],[-145,62],[-130,56],[-124,48],[-122,38],[-118,32],[-108,26],[-92,18],[-84,10],[-78,8],[-80,10],[-84,18],[-90,22],[-80,28],[-76,36],[-70,44],[-64,48],[-56,50],[-58,60],[-66,64],[-78,72],[-100,72],[-130,72],[-155,70],[-170,72]] },
  { d: [[-10,36],[0,38],[8,44],[14,44],[18,42],[28,42],[32,48],[28,54],[22,58],[15,62],[10,58],[6,56],[2,52],[-2,50],[-6,44],[-10,36]] },
  { d: [[26,36],[37,36],[47,44],[55,44],[65,38],[68,36],[74,40],[90,48],[100,50],[110,50],[122,52],[140,46],[144,40],[142,32],[138,26],[126,20],[120,14],[108,20],[104,10],[100,2],[106,-4],[116,-8],[108,-8],[100,-2],[94,14],[90,22],[88,22],[84,22],[80,14],[74,8],[74,12],[72,20],[68,24],[62,24],[56,24],[52,16],[48,28],[42,18],[36,12],[32,18],[30,30],[28,40],[26,36]] },
  { d: [[114,-22],[118,-34],[130,-32],[136,-36],[140,-38],[148,-38],[152,-32],[152,-26],[148,-18],[142,-14],[136,-12],[130,-14],[122,-18],[114,-22]] },
];

/* India highlighted separately */
const INDIA_POLY = [[68,37],[78,35],[97,28],[92,22],[89,21],[85,19],[80,13],[77,8],[76,8],[73,14],[72,19],[68,22],[67,24],[68,28],[68,37]];

/* ── City lights (lon, lat, brightness) ──────────────────────────────────── */
const CITY_LIGHTS = [
  // World
  [-74,40.7,4],[-87,41.8,3.5],[-118,34,3.5],[-122,37.8,3],[-0.1,51.5,4],[2,48.8,3.5],[13,52.5,3],[13,42,3],[37,55.7,3.5],[31,30,3],[28,41,2.5],[55,25,3],[46,24.5,2.5],
  [103.8,1.4,3.5],[101,13.8,3],[116.4,39.9,4],[121.5,31.2,4],[114,22.4,3.5],[126.9,37.6,3.5],[139.7,35.7,4.5],[135.5,34.7,3.5],
  [151.2,-33.9,3],[144.9,-37.8,3],[-46.6,-23.5,3.5],[-43.2,-22.9,3],
  // India — the focal cluster (brighter, more detail)
  [72.8,19.1,5],[77.2,28.6,5],[77.6,12.9,4.5],[88.4,22.6,4.5],[80.3,13.1,4.5],[78.5,17.4,4.5],[73.9,18.5,4],[72.6,23,4],[77,28.5,4],
  [72.6,23.2,3],[79.9,23.2,2.5],[85.8,20.3,2.5],[74.8,15.4,2.5],[76,10.8,2.5],[72.8,21,2.5],[76.5,29.9,2.5],
];

/* ── Build equirectangular canvas texture ───────────────────────────────── */
function buildEarthTexture(THREE: typeof import("three")) {
  const W = 2048, H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d")!;

  const tx = (lon: number) => (lon + 180) / 360 * W;
  const ty = (lat: number) => (90 - lat) / 180 * H;

  /* Deep dark ocean */
  c.fillStyle = "#050C18";
  c.fillRect(0, 0, W, H);

  /* Faint latitude lines — very subtle */
  c.strokeStyle = "rgba(50,80,140,0.06)";
  c.lineWidth = 0.8;
  [-60,-30,0,30,60].forEach(lat => {
    c.beginPath(); c.moveTo(0, ty(lat)); c.lineTo(W, ty(lat)); c.stroke();
  });

  /* Continents */
  CONTINENTS.forEach(({ d }) => {
    c.beginPath();
    d.forEach(([lon, lat], i) => { i===0 ? c.moveTo(tx(lon),ty(lat)) : c.lineTo(tx(lon),ty(lat)); });
    c.closePath();
    c.fillStyle = "#0C1826";
    c.fill();
    c.strokeStyle = "rgba(80,120,180,0.08)";
    c.lineWidth = 0.5;
    c.stroke();
  });

  /* India — slightly highlighted */
  c.beginPath();
  INDIA_POLY.forEach(([lon, lat], i) => { i===0 ? c.moveTo(tx(lon),ty(lat)) : c.lineTo(tx(lon),ty(lat)); });
  c.closePath();
  c.fillStyle = "#0E1D30";
  c.fill();
  c.strokeStyle = "rgba(200,16,46,0.35)";
  c.lineWidth = 1.2;
  c.stroke();

  /* City lights */
  CITY_LIGHTS.forEach(([lon, lat, r]) => {
    const x = tx(lon), y = ty(lat);
    const g = c.createRadialGradient(x, y, 0, x, y, r * 8);
    g.addColorStop(0,   `rgba(255,220,140,${Math.min(r/5*0.8, 0.8)})`);
    g.addColorStop(0.4, `rgba(255,180,80,${Math.min(r/5*0.4, 0.4)})`);
    g.addColorStop(1,   "transparent");
    c.beginPath(); c.arc(x, y, r * 8, 0, Math.PI*2);
    c.fillStyle = g; c.fill();
    c.beginPath(); c.arc(x, y, r*0.6, 0, Math.PI*2);
    c.fillStyle = `rgba(255,245,200,${Math.min(r/5, 1)})`; c.fill();
  });

  return new THREE.CanvasTexture(cv);
}

/* ══ Globe component (Three.js) ═══════════════════════════════════════════ */
function GlobeCanvas({ onTransitionDone }: { onTransitionDone: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const doneRef  = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    let renderer: import("three").WebGLRenderer;
    let animId: number;
    let ctx: { revert(): void } | undefined;

    (async () => {
      const THREE = await import("three");
      const gsap  = (await import("gsap")).default;

      const W = window.innerWidth, H = window.innerHeight;

      /* ── Renderer ── */
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x050912, 1);
      mountRef.current!.appendChild(renderer.domElement);

      /* ── Scene / Camera ── */
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
      camera.position.set(0, 0.25, 3.2);
      camera.lookAt(0, 0, 0);

      /* ── Earth texture ── */
      const earthTex = buildEarthTexture(THREE);
      earthTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      /* ── Earth mesh ── */
      const earthGeo = new THREE.SphereGeometry(1, 96, 96);
      const earthMat = new THREE.MeshPhongMaterial({
        map: earthTex, shininess: 8,
        specular: new THREE.Color(0x112244),
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      /* ── Atmospheric glow (back-side, slightly larger sphere) ── */
      const atmMat = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.5);
            gl_FragColor = vec4(0.18, 0.45, 1.0, 1.0) * intensity * 0.9;
          }`,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        transparent: true,
      });
      const atm = new THREE.Mesh(new THREE.SphereGeometry(1.12, 32, 32), atmMat);
      scene.add(atm);

      /* ── Star field (tiny points in background) ── */
      const starVerts: number[] = [];
      for (let i = 0; i < 2000; i++) {
        const θ = Math.random() * Math.PI * 2;
        const φ = Math.acos(2 * Math.random() - 1);
        const r = 18 + Math.random() * 5;
        starVerts.push(r*Math.sin(φ)*Math.cos(θ), r*Math.sin(φ)*Math.sin(θ), r*Math.cos(φ));
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.055, transparent: true, opacity: 0.65 }));
      scene.add(stars);

      /* ── Lighting ── */
      scene.add(new THREE.AmbientLight(0x112233, 0.4));
      const sun = new THREE.DirectionalLight(0x334466, 0.35);
      sun.position.set(-4, 2, 3);
      scene.add(sun);

      /* ── Render loop ── */
      const render = () => { animId = requestAnimationFrame(render); renderer.render(scene, camera); };
      render();

      /* ── Handle resize ── */
      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w/h; camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      /* ── GSAP animation timeline ──
         1. Slow rotation: Africa/Europe visible → India centered
         2. Camera zoom toward India
         3. Fade out — trigger map
      ── */

      /* Starting rotation: lon≈-20° faces camera (Atlantic / Africa visible)
         Target rotation: bring India (lon≈80°E) to face camera
         Three.js texture maps lon=0° at rotation.y=0 facing viewer,
         each +radian of rotation.y moves the visible longitude eastward.
         80° east ≈ +1.40 rad; we start at -0.35 (lon≈-20°) and animate to +1.40  */
      earth.rotation.y = -0.35;
      earth.rotation.x = 0.08; // slight tilt for realism

      const finish = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        onTransitionDone();
      };

      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        /* Phase 1 – slow luxurious rotation (6.5s) */
        tl.to(earth.rotation, { y: 1.40, duration: 6.5, ease: "power1.inOut" }, 0)

          /* Phase 2 – camera gently zooms toward India */
          .to(camera.position, { z: 1.65, y: 0.18, duration: 3.2, ease: "power2.inOut" }, 5.0)

          /* Phase 3 – fade renderer canvas → trigger map crossfade */
          .to(renderer.domElement, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, 8.0)
          .call(finish, [], 8.4);
      });

    })();

    return () => {
      ctx?.revert();
      cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, [onTransitionDone]);

  return (
    <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 50, background: "#050912" }}>
      {/* Skip button */}
      <button
        onClick={() => { if (!doneRef.current) { (doneRef as React.MutableRefObject<boolean>).current = true; onTransitionDone(); }}}
        style={{ position: "absolute", bottom: 40, right: 48, fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.28)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "7px 16px", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s", zIndex: 60 }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
        Skip
      </button>
      {/* Eyebrow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -340px)", textAlign: "center", pointerEvents: "none", zIndex: 60 }}>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(140,180,240,0.4)" }}>
          MB Research · Pan-India Coverage
        </p>
      </div>
    </div>
  );
}

/* ══ City directory ════════════════════════════════════════════════════════ */
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

/* ══ Map experience (final Coverage interface) ════════════════════════════ */
function MapExperience({ visible }: { visible: boolean }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    let ctx: { revert(): void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!listRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(".dir-row",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current!, start: "top 85%", once: true } });
      }, listRef.current);
    })();
    return () => ctx?.revert();
  }, [visible]);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.9s ease", paddingTop: 64 }}>
      {/* Page header */}
      <section style={{ padding: "clamp(64px,8vw,112px) 0 clamp(40px,4vw,56px)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 18 }}>Coverage</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "end" }}>
            <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(38px,5vw,68px)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.06 }}>
              Active across<br/><em style={{ fontStyle: "italic", color: "var(--red)" }}>10 Indian cities.</em>
            </h1>
            <p className="t-body">Deep micro-market intelligence across every city we cover — from primary metros to emerging corridors. Click any city on the map to explore.</p>
          </div>
        </div>
      </section>

      {/* Interactive map — the centrepiece */}
      <section style={{ padding: "clamp(40px,5vw,64px) 0", background: "var(--cream-2)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <IndiaMap cityStats={EMPTY_STATS} />
        </div>
      </section>

      {/* City directory */}
      <section style={{ padding: "clamp(64px,7vw,96px) 0" }} ref={listRef}>
        <div className="wrap">
          <p className="t-label" style={{ marginBottom: 14 }}>Market Directory</p>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 40 }}>
            City-by-city coverage.
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--white)" }}>
            {CITY_INFO.map((c, i) => (
              <div key={c.city} className="dir-row"
                style={{ opacity: 0, display: "grid", gridTemplateColumns: "180px 1fr 1.5fr", gap: 24, alignItems: "center", padding: "20px 28px", borderBottom: i < CITY_INFO.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.primary ? "var(--red)" : "var(--border-2)", flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>{c.city}</span>
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

/* ══ Page ══════════════════════════════════════════════════════════════════ */
export default function CoveragePage() {
  /* Phase: "loading" → check session → "globe" or "map" */
  const [phase, setPhase] = useState<"loading"|"globe"|"map">("loading");
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mbr_cov_v2")) {
      setPhase("map"); setMapVisible(true);
    } else {
      setPhase("globe");
    }
  }, []);

  const handleTransitionDone = () => {
    sessionStorage.setItem("mbr_cov_v2", "1");
    /* Brief hold on dark background, then reveal map */
    setTimeout(() => setMapVisible(true), 100);
    setTimeout(() => setPhase("map"), 1200);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: mapVisible ? "var(--cream)" : "#050912", transition: "background 1.0s ease" }}>
      {phase === "globe" && <GlobeCanvas onTransitionDone={handleTransitionDone} />}
      <MapExperience visible={mapVisible} />
    </div>
  );
}
