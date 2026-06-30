"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
);
const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.04C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
);

const COLS = [
  { title: "Company", links: [["About", "/about"], ["Leadership", "/leadership"], ["Coverage", "/coverage"], ["Enquiry", "/enquiry"]] },
  { title: "Services", links: [["Residential Valuation", "/services#residential"], ["Commercial Valuation", "/services#commercial"], ["Investment Advisory", "/services#advisory"], ["All Services", "/services"]] },
  { title: "Research", links: [["PropIndex", "/research"], ["Rental Yield Index", "/research"], ["Housing Sentiment", "/research"], ["Micro-Market Reports", "/research"]] },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer style={{ background: "#0A0A0A", color: "#fff" }}>
      <div className="container" style={{ paddingTop: 96, paddingBottom: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 56, marginBottom: 80 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ background: "#C8102E", borderRadius: 6, padding: "5px 9px" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>mb</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", fontFamily: "Inter,sans-serif" }}>MB Research</span>
            </div>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.5)", lineHeight: 1.4, maxWidth: 320, marginBottom: 32 }}>
              Intelligence Behind Every Square Foot.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif" }}>
                <Mail size={14} /> research@mbresearch.in
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif" }}>
                <Phone size={14} /> +91 (00) 0000 0000
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif" }}>
                <MapPin size={14} /> Mumbai, Maharashtra
              </div>
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 22, fontFamily: "Inter,sans-serif" }}>{col.title}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 13 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", transition: "color 0.15s", fontFamily: "Inter,sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>© {new Date().getFullYear()} MB Research Valuation. All rights reserved.</p>

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/analyst-login" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>Privacy Policy</Link>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>Terms of Service</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[LinkedinIcon, TwitterIcon].map((Icon, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(200,16,46,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                  <Icon />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
