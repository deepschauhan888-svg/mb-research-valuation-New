"use client";
import { Building2, TrendingUp, Home, Users, Briefcase } from "lucide-react";

const CLIENTS = [
  {
    icon: Building2,
    title: "Banks",
    desc: "Leading public and private sector banks rely on MB Research for independent mortgage and project valuations.",
    tags: ["Home Loans", "Project Finance", "NPA Valuation"],
    color: "#1D4ED8",
    bg: "#EFF6FF",
  },
  {
    icon: TrendingUp,
    title: "NBFCs",
    desc: "Non-banking financial companies engage MB Research for pre-disbursement and portfolio-level property assessments.",
    tags: ["Loan Collateral", "Portfolio Review", "Stressed Assets"],
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Home,
    title: "Real Estate Developers",
    desc: "Developers commission independent valuations for pricing benchmarking, launches, and investor presentations.",
    tags: ["Launch Pricing", "Benchmark Studies", "Investor Reports"],
    color: "#C8102E",
    bg: "#FEF2F2",
  },
  {
    icon: Users,
    title: "Institutional Investors",
    desc: "Private equity funds, REITs, and sovereign wealth arms trust MB Research for acquisition and exit valuations.",
    tags: ["Acquisition Due Diligence", "REIT Compliance", "Exit Pricing"],
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: Briefcase,
    title: "Family Offices",
    desc: "Ultra-high-net-worth family offices require confidential, independent assessments for portfolio management and succession.",
    tags: ["Portfolio Assessment", "Succession Planning", "Discretionary Advice"],
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

export default function WhoWeServe() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {CLIENTS.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="card"
            style={{ padding: 32, cursor: "default", gridColumn: i >= 3 ? undefined : undefined }}
          >
            {/* Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                background: c.bg,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                border: `1px solid ${c.color}20`,
              }}
            >
              <Icon size={22} style={{ color: c.color }} />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.015em" }}>
              {c.title}
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 20 }}>{c.desc}</p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.tags.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.color,
                    background: c.bg,
                    padding: "3px 10px",
                    borderRadius: 20,
                    border: `1px solid ${c.color}25`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
