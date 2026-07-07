"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
const COLS = [
  { title: "Company", links: [["About","/about"],["Leadership","/leadership"],["Coverage","/coverage"],["Enquiry","/enquiry"]] },
  { title: "Services", links: [["Residential Valuation","/services#residential"],["Commercial Valuation","/services#commercial"],["Investment Advisory","/services#advisory"],["All Services","/services"]] },
  { title: "Research", links: [["PropIndex","/research"],["Rental Yield Index","/research"],["Housing Sentiment","/research"],["Micro-Market Reports","/research"]] },
];
export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return (
    <footer style={{ background: "var(--black)", color: "#fff" }}>
      <div className="wrap" style={{ paddingTop: "clamp(72px,8vw,112px)", paddingBottom: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "clamp(32px,5vw,64px)", marginBottom: 72 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ background: "var(--red)", borderRadius: 5, padding: "4px 8px" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 11, fontFamily: "Inter,sans-serif" }}>mb</span></div>
              <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 500, color: "#fff" }}>Research</span>
            </div>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, maxWidth: 280, marginBottom: 32 }}>
              Intelligence Behind Every Square Foot.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[[Mail,"research@mbresearch.in"],[Phone,"+91 (00) 0000 0000"],[MapPin,"Mumbai, Maharashtra"]].map(([Icon, text], i) => {
                const I = Icon as React.ElementType;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif" }}>
                    <I size={14} style={{ flexShrink: 0 }} />{text as string}
                  </div>
                );
              })}
            </div>
          </div>
          {COLS.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20, fontFamily: "Inter,sans-serif" }}>{col.title}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif" }}>© {new Date().getFullYear()} MB Research Valuation. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Privacy Policy","/analyst-login"],["Terms of Service","/analyst-login"],["Analyst Login","/analyst-login"]].map(([l,h]) => (
              <Link key={l} href={h} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
