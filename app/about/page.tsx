"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Eye, Award, FileText } from "lucide-react";
import LeadershipTeam from "@/components/LeadershipTeam";
import WhoWeServe from "@/components/WhoWeServe";

const WHY = [
  { icon: ShieldCheck, title: "Independent Research",      desc: "No brokerage relationships. No conflicts of interest. Every recommendation is purely research-driven." },
  { icon: BarChart3,   title: "Market Intelligence",       desc: "Proprietary transaction data covering 10 Indian cities with micro-market and RERA integration." },
  { icon: Eye,         title: "Data-Driven Decisions",     desc: "Every recommendation traces to verifiable comparables and documented valuation assumptions." },
  { icon: Award,       title: "Institutional Standards",   desc: "Methodology trusted by banks, NBFCs, private equity, and institutional investors across India." },
  { icon: FileText,    title: "Transparent Methodology",   desc: "All assumptions visible. All comparables justified. No black boxes. No surprises." },
];

const STATS = [
  { num: "248+",        label: "Valuations Completed" },
  { num: "₹4,820 Cr",  label: "Portfolio Assessed" },
  { num: "10",          label: "Cities Covered" },
  { num: "15+ yrs",     label: "Combined Experience" },
];

const METHOD = [
  { n: "01", title: "Intake & Scoping",         body: "Define purpose, applicable standard, and value premise. Confirm scope, timeline, and deliverable format upfront." },
  { n: "02", title: "Site Visit & Data",         body: "Visit every asset. Collect primary data from site, RERA filings, sub-registrar records, and developer offices." },
  { n: "03", title: "Comparable Analysis",       body: "Identify 3–5 recent comparable transactions in the same micro-market, adjusted for floor, view, age, and amenities." },
  { n: "04", title: "Valuation Calculation",     body: "Apply Sales Comparison (residential), Income Capitalisation or DCF (commercial), or Residual Method (land)." },
  { n: "05", title: "Senior Review & Sign-off",  body: "Every report reviewed by a senior analyst before dispatch. Mathematical accuracy and assumptions fully verified." },
  { n: "06", title: "Delivery & Archiving",      body: "Report delivered in agreed format. All assignments archived in the MB Research intelligence database." },
];

const CITIES = ["Mumbai","Delhi NCR","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Gurugram","Noida","Ahmedabad"];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 68 }}>

      {/* HERO */}
      <section style={{ background: "#FFFFFF", padding: "80px 0 64px", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>About MB Research</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: 20 }}>
                Research-first.<br /><span style={{ color: "#94A3B8" }}>Always independent.</span>
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#475569" }}>
                MB Research was founded on one conviction: that property valuation must be driven by rigorous, independent analysis — not relationships, convenience, or outcomes a client already expects.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: "22px 20px" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 6 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORY + VALUES */}
      <section style={{ background: "#F8FAFC", padding: "72px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Our Story</p>
              <h2 style={{ fontSize: "clamp(24px, 2.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", marginBottom: 20, lineHeight: 1.2 }}>Trusted by institutions across India.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#475569", marginBottom: 16 }}>Today we are trusted by lenders, developers, family offices, and institutional investors across India&apos;s most competitive markets. Our track record is built on transparency, precision, and a refusal to compromise.</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#64748B" }}>Every assignment we complete enters our proprietary intelligence database — compounding in value over time and allowing us to surface insights no single valuation firm has been able to offer previously.</p>

              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Banks & NBFCs","Real Estate Developers","Private Equity Firms","Family Offices","Institutional Investors"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14, color: "#374151" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Why MB Research</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {WHY.map(w => {
                  const Icon = w.icon;
                  return (
                    <div key={w.title} style={{ display: "flex", gap: 16, padding: "18px 20px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(15,23,42,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}>
                      <div style={{ width: 36, height: 36, background: "#F1F5F9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} style={{ color: "#0F172A" }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{w.title}</h3>
                        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{w.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUATION EXPERTISE */}
      <section style={{ background: "#FFFFFF", padding: "72px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Expertise</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1.2, marginBottom: 28 }}>Valuation Expertise.</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
                {[
                  { type: "Residential", items: ["Apartments & Condominiums","Villas & Row Houses","Plotted Developments","Under-construction Inventory"] },
                  { type: "Commercial",  items: ["Grade A & B Office Spaces","Retail & High Street","Warehouses & Logistics","Mixed-use Developments"] },
                  { type: "Land",        items: ["Agricultural & NA Plots","Industrial Land","Greenfield Parcels","MIDC & SEZ Properties"] },
                ].map((cat, i) => (
                  <div key={cat.type} style={{ padding: "20px 24px", background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#C8102E", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{cat.type}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.items.map(item => (
                        <span key={item} style={{ fontSize: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#374151", padding: "3px 10px", borderRadius: 6 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Coverage */}
            <div>
              <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1.2, marginBottom: 28 }}>Market Coverage.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {CITIES.map((city, i) => (
                  <div key={city} style={{ padding: "14px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < 3 ? "#C8102E" : "#94A3B8", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{city}</span>
                    {i < 3 && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#C8102E", textTransform: "uppercase", letterSpacing: "0.06em" }}>Primary</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section style={{ background: "#F8FAFC", padding: "72px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Research Methodology</p>
          <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1.2, marginBottom: 40 }}>How we arrive at a number.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
            {METHOD.map((m, i) => (
              <div key={m.n} style={{ padding: "28px 28px", background: "#fff", borderRight: i % 2 === 0 ? "1px solid #E2E8F0" : "none", borderBottom: i < METHOD.length - 2 ? "1px solid #E2E8F0" : "none" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 10, fontFamily: "monospace", letterSpacing: "0.05em" }}>{m.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section style={{ background: "#FFFFFF", padding: "72px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Clientele</p>
          <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1.2, marginBottom: 40 }}>Who We Serve.</h2>
          <WhoWeServe />
        </div>
      </section>

      {/* LEADERSHIP */}
      <section style={{ background: "#F8FAFC", padding: "72px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Leadership</p>
          <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1.2, marginBottom: 40 }}>Meet the Team.</h2>
          <LeadershipTeam />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F172A", padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.025em", marginBottom: 14 }}>Work with MB Research.</h2>
          <p style={{ fontSize: 15, color: "#64748B", marginBottom: 32 }}>Trusted by lenders, developers, and institutions across India.</p>
          <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#A50D26"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
