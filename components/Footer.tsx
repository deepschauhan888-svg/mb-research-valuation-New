"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0F172A", color: "#fff", marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#C8102E", borderRadius: 6, padding: "5px 9px" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>mb</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>MB Research</span>
            </div>
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.75, maxWidth: 300 }}>
              Independent real estate valuation and research across India. Institutional-grade intelligence for banks, NBFCs, developers, and investors.
            </p>
            <p style={{ marginTop: 24, fontSize: 13, color: "#475569" }}>research@mbresearch.in</p>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Mumbai, Maharashtra</p>
          </div>

          {[
            { title: "Platform", links: [["Home","/"],["About","/about"],["Monthly Summary","/monthly-summary"],["Enquiry","/enquiry"]] },
            { title: "Services", links: [["Residential Valuation","/about"],["Commercial Valuation","/about"],["Investment Advice","/about"],["Portfolio Advisory","/about"]] },
            { title: "Company", links: [["About Us","/about"],["Methodology","/about"],["Analyst Login","/analyst-login"],["Contact","/enquiry"]] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569", marginBottom: 20 }}>{col.title}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize: 14, color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#475569" }}>© {new Date().getFullYear()} MB Research Valuation. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "#334155", letterSpacing: "0.08em" }}>ACTIONABLE INSIGHTS · INDEPENDENT RESEARCH</p>
        </div>
      </div>
    </footer>
  );
}
