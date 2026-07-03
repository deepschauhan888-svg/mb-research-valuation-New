"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        gsap.fromTo(sel, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.85, stagger, ease: "power3.out",
          scrollTrigger: { trigger: ref.current!, start: "top 85%", once: true } });
      }, ref);
    })();
    return () => ctx?.revert();
  }, [sel, stagger]);
  return ref;
}

const METHOD = [
  { n: "01", title: "Intake & Scoping",        body: "Define purpose, applicable standard, and value premise. Confirm scope, timeline, and deliverable format." },
  { n: "02", title: "Site Inspection",          body: "Physical inspection of every asset. Photography, measurement verification, condition assessment." },
  { n: "03", title: "Market Research",          body: "RERA data, sub-registrar transactions, developer pricing — all sourced and independently verified." },
  { n: "04", title: "Comparable Analysis",      body: "3–5 verified transactions adjusted for floor, age, view, amenities, and time elapsed." },
  { n: "05", title: "Valuation Modelling",      body: "Sales Comparison, Income Capitalisation, or DCF applied and reconciled based on asset type." },
  { n: "06", title: "Senior Review & Sign-off", body: "Independent review of all assumptions, comparables, and the final value conclusion." },
  { n: "07", title: "Report Delivery",          body: "Delivered in the agreed format. All assignments archived in the MB Research intelligence database." },
];

const CLIENTS = ["Banks & NBFCs", "Real Estate Developers", "Private Equity Firms", "Family Offices", "Institutional Investors", "Housing Finance Companies"];

export default function AboutPage() {
  const storyRef  = useReveal(".story-el",  0.1);
  const methodRef = useReveal(".method-el", 0.07);
  const expRef    = useReveal(".exp-el",    0.06);

  return (
    <div className="bg-site" style={{ paddingTop: 68 }}>

      {/* HERO — unique to About, company story focus */}
      <section className="section" style={{ borderBottom: "1px solid #E5E7EB" }}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 20 }}>Our Story</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", lineHeight: 1.08 }}>
              Founded to end<br />
              <em style={{ fontStyle: "italic", color: "#6B7280" }}>conflicts of interest.</em>
            </h1>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#6B7280", marginBottom: 20, fontFamily: "Inter,sans-serif" }}>
                MB Research was founded on a single conviction: that real estate valuation must be driven by rigorous, independent analysis — not by brokerage relationships, client expectations, or commercial convenience.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>
                Every assignment we complete enters our proprietary intelligence database — building a compound research advantage that allows us to surface insights no firm that juggles brokerage and advisory can match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section" ref={storyRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }}>
            <div className="story-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>What Makes Us Different</p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6B7280", marginBottom: 20, fontFamily: "Inter,sans-serif" }}>
                The Indian real estate industry is characterised by structural conflicts. Most valuation firms simultaneously operate as brokers, advisors, and developers — making true independence impossible.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#9CA3AF", marginBottom: 32, fontFamily: "Inter,sans-serif" }}>
                MB Research carries none of those relationships. We have no brokerage desk. We earn no commissions. We carry no referral incentives. Our only product is research — and our only obligation is to the data.
              </p>
              <p className="t-label" style={{ marginBottom: 14 }}>Who Trusts Us</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {CLIENTS.map((c, i) => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < CLIENTS.length - 1 ? "1px solid #F3F4F6" : "none", fontSize: 14, color: "#374151", fontFamily: "Inter,sans-serif" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />{c}
                  </div>
                ))}
              </div>
            </div>

            <div className="story-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Our Principles</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { title: "Independence above all", desc: "A valuation that confirms what the client wants to hear is not a valuation — it is a liability. We do not produce those." },
                  { title: "Every assumption is visible", desc: "Our reports show every comparable, every adjustment, and every assumption. Clients and credit committees can verify our work." },
                  { title: "Data before opinion", desc: "Market views and intuitions are checked against the transaction record. When data conflicts with opinion, data wins." },
                  { title: "Senior sign-off on everything", desc: "No report leaves without review at a senior level. There are no junior-only assignments at MB Research." },
                ].map(p => (
                  <div key={p.title} style={{ padding: "20px 22px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginBottom: 6, fontFamily: "Inter,sans-serif" }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, fontFamily: "Inter,sans-serif" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUATION EXPERTISE */}
      <section className="section" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }} ref={expRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
            <div className="exp-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Asset Coverage</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(24px,2.6vw,36px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 28 }}>What we value.</h2>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                {[
                  { type: "Residential", items: ["Apartments & Condominiums", "Villas & Row Houses", "Plotted Developments", "Under-construction Units"] },
                  { type: "Commercial",  items: ["Grade A & B Office Spaces", "Retail & High Street", "Warehouses & Logistics", "Mixed-use Developments"] },
                  { type: "Land",        items: ["Agricultural & NA Plots", "Industrial Land", "Greenfield Parcels", "MIDC & SEZ Properties"] },
                ].map((cat, i) => (
                  <div key={cat.type} style={{ padding: "22px 26px", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#C8102E", marginBottom: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>{cat.type}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {cat.items.map(item => (
                        <span key={item} style={{ fontSize: 12, background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151", padding: "4px 11px", borderRadius: 6, fontFamily: "Inter,sans-serif" }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="exp-el" style={{ opacity: 0 }}>
              <p className="t-label" style={{ marginBottom: 18 }}>Geographic Presence</p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(24px,2.6vw,36px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: 28 }}>Where we operate.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { city: "Mumbai", primary: true }, { city: "Delhi NCR", primary: true },
                  { city: "Bengaluru", primary: true }, { city: "Gurugram", primary: true },
                  { city: "Pune" }, { city: "Hyderabad" },
                  { city: "Chennai" }, { city: "Noida" },
                  { city: "Kolkata" }, { city: "Ahmedabad" },
                ].map(c => (
                  <div key={c.city} style={{ padding: "14px 18px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.primary ? "#C8102E" : "#D1D5DB", flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "#374151", flex: 1, fontFamily: "Inter,sans-serif" }}>{c.city}</span>
                    {c.primary && <span style={{ fontSize: 9, fontWeight: 700, color: "#C8102E", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Inter,sans-serif" }}>Primary</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/coverage" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#C8102E", fontFamily: "Inter,sans-serif" }}>
                  View interactive coverage map <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="section" ref={methodRef as React.RefObject<HTMLDivElement>}>
        <div className="container">
          <p className="t-label" style={{ marginBottom: 18 }}>Methodology</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1.15, marginBottom: 24 }}>
                How we arrive<br />at a number.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#6B7280", marginBottom: 32, fontFamily: "Inter,sans-serif" }}>
                Every assignment follows a rigorous, documented process designed to meet institutional lending, investment, and compliance standards. Nothing is estimated. Everything is verified.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Standards Applied", val: "RICS · IVS · RBI Guidelines" },
                  { label: "Data Sources", val: "RERA · Sub-Registrar · Proprietary DB" },
                  { label: "Comparables", val: "Minimum 3–5 verified transactions" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13, fontFamily: "Inter,sans-serif" }}>
                    <span style={{ color: "#9CA3AF" }}>{s.label}</span>
                    <span style={{ color: "#374151", fontWeight: 500 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
              {METHOD.map((m, i) => (
                <div key={m.n} className="method-el" style={{ opacity: 0, padding: "24px 22px", background: "#fff", borderRight: i % 2 === 0 ? "1px solid #E5E7EB" : "none", borderBottom: i < METHOD.length - 2 ? "1px solid #E5E7EB" : "none" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#C8102E", marginBottom: 10, fontFamily: "DM Mono,monospace" }}>{m.n}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", marginBottom: 6, fontFamily: "Inter,sans-serif" }}>{m.title}</h3>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, fontFamily: "Inter,sans-serif" }}>{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)" }} />
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Commission a valuation today.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 32, fontFamily: "Inter,sans-serif" }}>Independent. Institutional. Reliable.</p>
          <Link href="/enquiry" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C8102E", color: "#fff", padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "Inter,sans-serif", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#9B0B22"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}>
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
