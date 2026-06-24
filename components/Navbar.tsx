"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/monthly-summary", label: "Monthly Summary" },
  { href: "/enquiry", label: "Enquiry" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#E2E8F0" : "#F1F5F9"}`,
          boxShadow: scrolled ? "0 1px 20px rgba(15,23,42,0.06)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ background: "#C8102E", borderRadius: 6, padding: "5px 9px", display: "flex", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: "0.05em" }}>mb</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.2 }}>MB Research</div>
              <div style={{ fontWeight: 500, fontSize: 10, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1 }}>Valuation</div>
            </div>
          </Link>

          {/* Desktop links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden lg:flex">
            {NAV.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none",
                  color: pathname === l.href ? "#0F172A" : "#64748B",
                  background: pathname === l.href ? "#F1F5F9" : "transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { if (pathname !== l.href) { e.currentTarget.style.color = "#0F172A"; e.currentTarget.style.background = "#F8FAFC"; }}}
                onMouseLeave={e => { if (pathname !== l.href) { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.background = "transparent"; }}}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden lg:flex">
            <Link href="/analyst-login" style={{ fontSize: 14, fontWeight: 500, color: "#64748B", textDecoration: "none", padding: "8px 16px", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#0F172A"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              Analyst Login
            </Link>
            <Link href="/enquiry" style={{
              background: "#0F172A", color: "#fff", padding: "10px 22px", borderRadius: 9,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "all 0.2s ease", display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0F172A"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Get in Touch
            </Link>
          </div>

          {/* Mobile burger */}
          <button className="lg:hidden" onClick={() => setOpen(!open)} style={{ padding: 8, color: "#64748B", background: "none", border: "none", cursor: "pointer" }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 99, background: "#fff",
        paddingTop: 68, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transform: open ? "translateY(0)" : "translateY(-8px)",
        transition: "all 0.25s ease",
      }} className="lg:hidden">
        <div style={{ padding: "24px 20px" }}>
          {NAV.map(l => (
            <Link key={l.href} href={l.href} style={{
              display: "block", padding: "16px 0", fontSize: 20, fontWeight: 600,
              color: pathname === l.href ? "#C8102E" : "#0F172A",
              borderBottom: "1px solid #F1F5F9", textDecoration: "none",
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/analyst-login" style={{ textAlign: "center", padding: 14, border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#0F172A", textDecoration: "none" }}>Analyst Login</Link>
            <Link href="/enquiry" style={{ textAlign: "center", padding: 14, background: "#0F172A", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Get in Touch</Link>
          </div>
        </div>
      </div>
    </>
  );
}
