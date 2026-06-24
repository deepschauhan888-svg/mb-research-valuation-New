"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Eye, Award, FileText } from "lucide-react";

const WHY = [
  { icon: ShieldCheck, title: "Independent Research",       desc: "No brokerage relationships. No conflicts of interest. Every recommendation is purely research-driven." },
  { icon: BarChart3,   title: "Market Intelligence",        desc: "Proprietary transaction data covering 10 Indian cities with micro-market depth and RERA integration." },
  { icon: Eye,         title: "Data-Driven Decisions",      desc: "Every recommendation traces back to verifiable comparables and documented valuation assumptions." },
  { icon: Award,       title: "Institutional Standards",    desc: "RICS-aligned methodology trusted by banks, NBFCs, private equity, and institutional investors." },
  { icon: FileText,    title: "Transparent Methodology",   desc: "All assumptions are visible, all comparables are justified. No black boxes. No surprises." },
];

const SERVICES = [
  { icon: "🏠", title: "Residential Valuation", desc: "Apartments, villas, and plotted developments. Comparable analysis, RERA data, and micro-market benchmarking.", color: "#EFF6FF" },
  { icon: "🏢", title: "Commercial Valuation",  desc: "Office spaces, retail units, and warehouses. Income capitalisation and DCF methodologies applied.", color: "#F0FDF4" },
  { icon: "📊", title: "Investment Recommendations", desc: "Buy, Sell, or Hold guidance backed by independent data and fully transparent methodology.",  color: "#FFFBEB" },
];

const STATS = [
  { num: "248+",       label: "Assignments Completed" },
  { num: "₹4,820 Cr", label: "Portfolio Assessed" },
  { num: "10",         label: "Cities Covered" },
  { num: "3.2d",       label: "Average Turnaround" },
];

const METHOD = [
  { n: "01", title: "Intake & Scoping",          body: "Define purpose, applicable standard, and value premise. Confirm scope, timeline, and deliverable format." },
  { n: "02", title: "Site Visit & Data",          body: "Visit every asset. Collect primary data from site, RERA filings, sub-registrar records, and developer offices." },
  { n: "03", title: "Comparable Analysis",        body: "Identify 3–5 recent transactions in the same micro-market, adjusted for floor, view, age, and amenities." },
  { n: "04", title: "Valuation Calculation",      body: "Apply Sales Comparison (residential), Income Capitalisation or DCF (commercial), Residual Method (land)." },
  { n: "05", title: "Senior Review & Sign-off",   body: "Every report reviewed by a senior analyst before dispatch. Mathematical accuracy and assumptions verified." },
  { n: "06", title: "Delivery & Archiving",       body: "Report delivered in agreed format. All assignments archived in the MB Research intelligence database." },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section style={{ background: "#FFFFFF", padding: "100px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 20 }}>About MB Research</p>
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.08, marginBottom: 28, maxWidth: 700 }}>
            A research-first valuation firm.<br />
            <span style={{ color: "#94A3B8" }}>The distinction matters.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: "#475569", maxWidth: 600 }}>
            MB Research was founded on one conviction: that property valuation must be driven by rigorous, independent analysis — not relationships, convenience, or outcomes a client already expects.
          </p>
        </div>
      </section>

      {/* STATS ROW */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "48px 32px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid #E2E8F0" : "none",
              }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.035em", marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 20 }}>Who We Are</p>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.2, marginBottom: 28 }}>Trusted by institutions across India.</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#475569", marginBottom: 20 }}>Today we are trusted by lenders, developers, family offices, and institutional investors across India&apos;s most competitive markets. Our track record is built on transparency, precision, and a refusal to compromise.</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#475569" }}>Every assignment we complete enters our proprietary intelligence database — compounding in value over time and allowing us to surface insights no single valuation firm has previously been able to offer.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Who commissions us", items: ["Banks & NBFCs","Real Estate Developers","Private Equity Firms","Family Offices","Institutional Investors"] },
                { label: "Cities we cover", items: ["Mumbai · Delhi NCR · Bengaluru","Pune · Hyderabad · Chennai","Gurugram · Noida · Kolkata · Ahmedabad"] },
              ].map(g => (
                <div key={g.label} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 14 }}>{g.label}</p>
                  {g.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14, color: "#374151" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>What We Do</p>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.2, marginBottom: 48 }}>Three services. One standard.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SERVICES.map(s => (
              <div key={s.title} className="card" style={{ padding: 36 }}>
                <div style={{ fontSize: 36, marginBottom: 20, width: 60, height: 60, background: s.color, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.015em" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ background: "#FFFFFF", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Why MB Research</p>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.2, marginBottom: 48 }}>What sets us apart.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {WHY.map(w => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="card" style={{ padding: 32 }}>
                  <div style={{ width: 44, height: 44, background: "#F1F5F9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon size={20} style={{ color: "#0F172A" }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.01em" }}>{w.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section style={{ background: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Methodology</p>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.2, marginBottom: 56 }}>How we arrive at a number.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
            {METHOD.map((m, i) => (
              <div key={m.n} style={{
                padding: "36px 32px", background: "#fff",
                borderRight: i % 2 === 0 ? "1px solid #E2E8F0" : "none",
                borderBottom: i < METHOD.length - 2 ? "1px solid #E2E8F0" : "none",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 12, fontFamily: "monospace" }}>{m.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F172A", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.025em", marginBottom: 16 }}>Work with MB Research.</h2>
          <p style={{ fontSize: 16, color: "#64748B", marginBottom: 36 }}>Trusted by lenders, developers, and institutions across India.</p>
          <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "#A50D26"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
