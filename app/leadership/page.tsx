"use client";
import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";

const LinkedinIcon = ({ size = 15, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
);

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

const TEAM = [
  { initials: "PK", name: "Prasun Kumar", role: "Chief Marketing Officer", exp: "12+ years",
    bio: "A visionary business and marketing leader with a passion for growth, innovation, and value creation. Drives MB Research's brand strategy and institutional partnerships.",
    color: "#1E3A5F", accent: "#3B82F6" },
  { initials: "AB", name: "Abhishek Bhadra", role: "Head of Research", exp: "15+ years",
    bio: "A real estate research leader with over 15 years of experience in market analysis, investment advisory, and strategic planning. Oversees methodology and quality across every assignment.",
    color: "#1F2937", accent: "#10B981" },
  { initials: "DC", name: "Deepak Chauhan", role: "Research Analyst", exp: "4+ years",
    bio: "Supports valuation analysis, comparable benchmarking and investment recommendations. Specialises in residential micro-market data and RERA filings.",
    color: "#4C1D95", accent: "#8B5CF6" },
];

export default function LeadershipPage() {
  const heroRef = useReveal(".hero-el", 0.12);
  const teamRef = useReveal(".team-card", 0.12);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section className="section" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="hero-el t-label" style={{ opacity: 0, marginBottom: 20 }}>Leadership</p>
          <h1 className="hero-el" style={{ opacity: 0, fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(44px,6vw,84px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.05, marginBottom: 28, maxWidth: 720 }}>
            The team behind<br /><em style={{ fontStyle: "italic", color: "#6B7280" }}>every valuation.</em>
          </h1>
          <p className="hero-el t-body-lg" style={{ opacity: 0, maxWidth: 560 }}>
            Senior involvement on every assignment. No junior-only outputs. No template research. Every report reflects the analyst who signed it.
          </p>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="section" style={{ paddingTop: 20 }} ref={teamRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {TEAM.map(m => (
              <div key={m.name} className="team-card" style={{ opacity: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: 44, transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 64px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.borderColor = m.accent + "40"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}>

                {/* Avatar — sized to fit a real headshot later */}
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}, ${m.accent})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: `0 8px 28px ${m.accent}30`, position: "relative" }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "Inter,sans-serif" }}>{m.initials}</span>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.01em" }}>{m.name}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "Inter,sans-serif" }}>{m.role}</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20, fontFamily: "Inter,sans-serif" }}>{m.exp} experience</p>

                <div style={{ height: 1, background: "#F3F4F6", marginBottom: 20 }} />

                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75, marginBottom: 28, fontFamily: "Inter,sans-serif" }}>{m.bio}</p>

                {/* Social placeholders */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.borderColor = m.accent; const svg = e.currentTarget.querySelector("svg"); if (svg) svg.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#E5E7EB"; const svg = e.currentTarget.querySelector("svg"); if (svg) svg.style.color = "#9CA3AF"; }}>
                    <LinkedinIcon size={15} style={{ color: "#9CA3AF", transition: "color 0.2s" }} />
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.borderColor = m.accent; const svg = e.currentTarget.querySelector("svg"); if (svg) svg.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#E5E7EB"; const svg = e.currentTarget.querySelector("svg"); if (svg) svg.style.color = "#9CA3AF"; }}>
                    <FileText size={15} style={{ color: "#9CA3AF", transition: "color 0.2s" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Photo replacement note (subtle, for internal team reference) */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#D1D5DB", marginTop: 48, fontFamily: "Inter,sans-serif" }}>
            Profile photographs to be added. Avatar containers are sized at 96×96px for direct replacement.
          </p>
        </div>
      </section>
    </div>
  );
}
