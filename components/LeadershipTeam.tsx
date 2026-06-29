"use client";

const TEAM = [
  {
    name: "Prasun Kumar",
    designation: "Chief Marketing Officer",
    desc: "A visionary business and marketing leader with a passion for growth, innovation, and value creation.",
    initials: "PK",
    color: "#1E3A5F",
    accent: "#3B82F6",
  },
  {
    name: "Abhishek Bhadra",
    designation: "Head of Research",
    desc: "A real estate research leader with over 15 years of experience in market analysis, investment advisory, and strategic planning.",
    initials: "AB",
    color: "#1F2937",
    accent: "#10B981",
  },
  {
    name: "Deepak Chauhan",
    designation: "Research Analyst",
    desc: "Supports valuation analysis, comparable benchmarking and investment recommendations.",
    initials: "DC",
    color: "#4C1D95",
    accent: "#8B5CF6",
  },
];

export default function LeadershipTeam() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {TEAM.map((member, i) => (
        <div
          key={member.name}
          className="card"
          style={{ padding: 36, cursor: "default", animationDelay: `${i * 100}ms` }}
        >
          {/* Avatar */}
          <div style={{ marginBottom: 24, position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${member.color} 0%, ${member.accent} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 20px ${member.accent}30`,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                {member.initials}
              </span>
            </div>
            {/* Replace hint dot */}
            <div
              title="Photo placeholder — replace with real image"
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#10B981",
                border: "2px solid #fff",
              }}
            />
          </div>

          {/* Info */}
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.015em" }}>
            {member.name}
          </h3>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: member.accent,
              marginBottom: 16,
            }}
          >
            {member.designation}
          </p>

          <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }} />

          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{member.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Usage note for future photo replacement ────────────────────────────────
   To replace placeholders with real photos, update the component above:

   Replace the avatar div with:
   <img
     src="/images/team/prasun-kumar.jpg"
     alt="Prasun Kumar"
     style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
   />
────────────────────────────────────────────────────────────────────────────── */
