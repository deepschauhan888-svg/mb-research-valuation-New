"use client";
import { useEffect, useRef, useState } from "react";

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

/* Photo placeholder — sized for easy replacement with real photo */
function Portrait({ name, color, accent }: { name: string; color: string; accent: string }) {
  const [hov, setHov] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("");

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(160deg, ${color} 0%, ${accent} 100%)`,
        transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "scale(1.02)" : "scale(1)",
        marginBottom: 24,
      }}
    >
      {/* Subtle texture */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />

      {/* Initials — placeholder until photo is added */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.02em" }}>
          {initials}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8, fontFamily: "Inter,sans-serif" }}>
          Photo Placeholder
        </span>
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)" }} />
    </div>
  );
}

/* LinkedIn icon */
const LinkedinIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const TEAM = [
  {
    name: "Prasun Kumar",
    role: "Chief Marketing Officer",
    bio: "A visionary business and marketing leader with a passion for growth, innovation, and value creation. Drives MB Research's brand strategy and institutional partnerships.",
    color: "#1E3A5F",
    accent: "#3B82F6",
  },
  {
    name: "Abhishek Bhadra",
    role: "Head of Research",
    bio: "A real estate research leader with deep experience in market analysis, investment advisory, and strategic planning. Oversees methodology and quality across every assignment.",
    color: "#1F2937",
    accent: "#10B981",
  },
  {
    name: "Deepak Chauhan",
    role: "Research Analyst",
    bio: "Supports valuation analysis, comparable benchmarking, and investment recommendations. Specialises in residential micro-market data and RERA transaction research.",
    color: "#4C1D95",
    accent: "#8B5CF6",
  },
];

export default function LeadershipPage() {
  const heroRef = useReveal(".hero-el", 0.12);
  const teamRef = useReveal(".team-col", 0.15);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" style={{ borderBottom: "1px solid #E5E7EB" }} ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>Leadership</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
            <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.08 }}>
              The people<br />
              <em style={{ fontStyle: "italic", color: "#6B7280" }}>behind every valuation.</em>
            </h1>
            <p className="hero-el t-body-lg" style={{ opacity: 0 }}>
              Senior involvement on every assignment. No junior-only outputs. Every report reflects the analyst who signed it.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" ref={teamRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {TEAM.map(m => (
              <div key={m.name} className="team-col" style={{ opacity: 0 }}>

                {/* Portrait placeholder — replace src with real photo when available */}
                {/* To add a real photo later:
                    <img src="/images/team/prasun-kumar.jpg" alt={m.name}
                      style={{ width:"100%", aspectRatio:"3/4", objectFit:"cover", borderRadius:16, marginBottom:24 }} />
                */}
                <Portrait name={m.name} color={m.color} accent={m.accent} />

                {/* Info */}
                <h2 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.01em" }}>
                  {m.name}
                </h2>
                <p style={{ fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18, fontFamily: "Inter,sans-serif" }}>
                  {m.role}
                </p>

                <div style={{ height: 1, background: "#F3F4F6", marginBottom: 18 }} />

                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75, marginBottom: 22, fontFamily: "Inter,sans-serif" }}>
                  {m.bio}
                </p>

                {/* LinkedIn placeholder */}
                <button
                  title="LinkedIn — link to be added"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", background: "#F9FAFB",
                    border: "1px solid #E5E7EB", borderRadius: 8,
                    fontSize: 13, fontWeight: 500, color: "#374151",
                    cursor: "pointer", fontFamily: "Inter,sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent; e.currentTarget.style.color = m.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
                >
                  <LinkedinIcon color="currentColor" />
                  LinkedIn Profile
                </button>
              </div>
            ))}
          </div>

          {/* Photo replacement note */}
          <div style={{ marginTop: 64, padding: "20px 24px", background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9CA3AF", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>
              Portrait placeholders are sized at 3:4 ratio. Replace each placeholder by adding <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>/public/images/team/[name].jpg</code> and uncommenting the <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>&lt;img&gt;</code> tag in <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>app/leadership/page.tsx</code>.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
