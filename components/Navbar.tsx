"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    label: "Services", href: "/services",
    sub: [
      { href: "/services", label: "All Services" },
      { href: "/services#residential", label: "Residential Valuation" },
      { href: "/services#commercial", label: "Commercial Valuation" },
      { href: "/services#advisory", label: "Investment Advisory" },
    ],
  },
  { href: "/coverage", label: "Coverage" },
  { href: "/research", label: "Research" },
  { href: "/leadership", label: "Leadership" },
  { href: "/enquiry", label: "Enquiry" },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [open, setOpen]               = useState(false);
  const [dropdown, setDropdown]       = useState<string | null>(null);
  const pathname = usePathname();
  const dropRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); setDropdown(null); }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropdown(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
    background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.98)",
    backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
    borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.08)" : "transparent"}`,
    boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.06)" : "none",
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ background: "#C8102E", borderRadius: 6, padding: "5px 9px", display: "flex", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: "0.05em", fontFamily: "Inter, sans-serif" }}>mb</span>
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0A0A0A", letterSpacing: "-0.02em", fontFamily: "Inter, sans-serif" }}>MB Research</div>
              <div style={{ fontWeight: 500, fontSize: 9, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Valuation</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div ref={dropRef} style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden lg:flex">
            {PRIMARY.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              const hasSub   = !!item.sub;
              const isOpen   = dropdown === item.label;

              return (
                <div key={item.label} style={{ position: "relative" }}>
                  {hasSub ? (
                    <button
                      onClick={() => setDropdown(isOpen ? null : item.label)}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: isActive ? "#0A0A0A" : "#6B7280", borderRadius: 8, transition: "all 0.15s", fontFamily: "Inter, sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#0A0A0A"}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#6B7280"; }}
                    >
                      {item.label}
                      <ChevronDown size={13} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                  ) : (
                    <Link href={item.href} style={{ display: "block", padding: "8px 14px", fontSize: 13, fontWeight: 500, color: isActive ? "#0A0A0A" : "#6B7280", borderRadius: 8, transition: "color 0.15s", position: "relative", fontFamily: "Inter, sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#0A0A0A"}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#6B7280"; }}>
                      {item.label}
                      {/* Active underline */}
                      {isActive && (
                        <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 16, height: 2, background: "#C8102E", borderRadius: 2, display: "block" }} />
                      )}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {hasSub && isOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "8px", minWidth: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", zIndex: 50 }}>
                      {item.sub!.map(s => (
                        <Link key={s.href} href={s.href} style={{ display: "block", padding: "9px 14px", fontSize: 13, color: "#374151", borderRadius: 8, transition: "all 0.12s", fontFamily: "Inter, sans-serif" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#0A0A0A"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#374151"; }}>
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden lg:flex">
            <Link href="/analyst-login" style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", padding: "8px 14px", borderRadius: 8, transition: "color 0.15s", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.color = "#0A0A0A"}
              onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}>
              Analyst Login
            </Link>
            <Link href="/enquiry" style={{ background: "#0A0A0A", color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "all 0.2s", display: "inline-block", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C8102E"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0A0A0A"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Get in Touch
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden" onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#374151", display: "flex" }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="lg:hidden" style={{
        position: "fixed", inset: 0, zIndex: 99, background: "#fff",
        paddingTop: 68,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
        overflowY: "auto",
      }}>
        <div style={{ padding: "24px 20px" }}>
          {PRIMARY.map((item) => (
            <div key={item.label}>
              <Link href={item.href} style={{ display: "block", padding: "14px 0", fontSize: 18, fontWeight: 600, color: pathname === item.href ? "#C8102E" : "#0A0A0A", borderBottom: "1px solid #F3F4F6", fontFamily: "Cormorant Garamond, serif", letterSpacing: "-0.01em" }}>
                {item.label}
              </Link>
              {item.sub?.map(s => (
                <Link key={s.href} href={s.href} style={{ display: "block", padding: "10px 16px", fontSize: 14, color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                  {s.label}
                </Link>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/analyst-login" style={{ textAlign: "center", padding: 14, border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>Analyst Login</Link>
            <Link href="/enquiry" style={{ textAlign: "center", padding: 14, background: "#0A0A0A", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "Inter, sans-serif" }}>Get in Touch</Link>
          </div>
        </div>
      </div>
    </>
  );
}
