"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EnquiryForm } from "@/types/valuation";
import { ArrowRight, CheckCircle, Mail, MapPin, Clock, Phone } from "lucide-react";

const CITIES = ["Mumbai","Delhi NCR","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Gurugram","Noida","Ahmedabad","Other"];
const TYPES  = ["Residential — Apartment","Residential — Villa","Residential — Plot","Commercial — Office","Commercial — Retail","Commercial — Warehouse","Land","Portfolio Assessment"];

export default function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EnquiryForm>();

  const onSubmit = async (data: EnquiryForm) => {
    try { await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch {}
    setSubmitted(true);
  };

  const inp = (err?: boolean) => ({
    width: "100%", background: "#fff",
    border: `1.5px solid ${err ? "#FCA5A5" : "#E2E8F0"}`,
    borderRadius: 10, padding: "13px 16px",
    fontSize: 15, color: "#0F172A", outline: "none",
    transition: "border-color 0.2s",
  });

  if (submitted) return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "68px 20px 80px" }}>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 24, padding: 64, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 48px rgba(15,23,42,0.06)" }}>
        <div style={{ width: 72, height: 72, background: "#ECFDF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <CheckCircle size={36} color="#059669" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: 12 }}>Enquiry Received</h2>
        <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, marginBottom: 32 }}>
          Thank you for contacting MB Research. Our team will get in touch with you shortly.
        </p>
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#64748B" }}>
          We respond to all enquiries within <strong style={{ color: "#0F172A" }}>24 hours</strong>, Mon–Sat.
        </div>
        <button onClick={() => setSubmitted(false)} style={{ marginTop: 24, fontSize: 14, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Submit another enquiry
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 68 }}>

      {/* Header */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "72px 0 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8102E", marginBottom: 16 }}>Contact Us</p>
          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: 20 }}>
            Start a conversation<br />with our team.
          </h1>
          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.7 }}>
            Tell us about your requirement. We respond to all enquiries within 24 hours.
          </p>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 64, alignItems: "start" }}>

          {/* Form */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 36, letterSpacing: "-0.015em" }}>Your Details</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Full Name *</label>
                  <input {...register("name", { required: true })} placeholder="Your name" style={inp(!!errors.name)}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.name ? "#FCA5A5" : "#E2E8F0"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Company *</label>
                  <input {...register("company", { required: true })} placeholder="Bank, NBFC, Developer..." style={inp(!!errors.company)}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.company ? "#FCA5A5" : "#E2E8F0"} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Email *</label>
                  <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} type="email" placeholder="you@company.com" style={inp(!!errors.email)}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.email ? "#FCA5A5" : "#E2E8F0"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Phone *</label>
                  <input {...register("phone", { required: true })} type="tel" placeholder="+91 98XXX XXXXX" style={inp(!!errors.phone)}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.phone ? "#FCA5A5" : "#E2E8F0"} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>City *</label>
                  <select {...register("city", { required: true })} style={{ ...inp(!!errors.city), cursor: "pointer" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.city ? "#FCA5A5" : "#E2E8F0"}>
                    <option value="">Select city...</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Property Type *</label>
                  <select {...register("property_type", { required: true })} style={{ ...inp(!!errors.property_type), cursor: "pointer" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.property_type ? "#FCA5A5" : "#E2E8F0"}>
                    <option value="">Select type...</option>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Approximate Property Value</label>
                <input {...register("property_value")} placeholder="e.g. ₹2 Cr, ₹500 Cr portfolio..." style={inp()}
                  onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Requirement *</label>
                <select {...register("requirement", { required: true })} style={{ ...inp(!!errors.requirement), cursor: "pointer" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                  onBlur={e => e.currentTarget.style.borderColor = errors.requirement ? "#FCA5A5" : "#E2E8F0"}>
                  <option value="">Select requirement...</option>
                  {["Home Loan Valuation","Investment Decision","Legal / Court Order","Portfolio Assessment","Market Research Report","NPA / Stressed Asset","Other"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>Message</label>
                <textarea {...register("message")} rows={4} placeholder="Property location, specific requirements, any additional context..." style={{ ...inp(), resize: "vertical" } as React.CSSProperties}
                  onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />
              </div>
              <button type="submit" disabled={isSubmitting} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#0F172A", color: "#fff", padding: "15px 28px",
                borderRadius: 10, fontSize: 15, fontWeight: 700, border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = "#1E293B"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#0F172A"}>
                {isSubmitting ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Submitting...</> : <>Submit Enquiry <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Contact */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 20, letterSpacing: "-0.01em" }}>Contact Information</p>
              {[
                { icon: Mail, label: "Email", val: "research@mbresearch.in" },
                { icon: MapPin, label: "Office", val: "Mumbai, Maharashtra — 400 001" },
                { icon: Phone, label: "Hours", val: "Mon–Sat · 9 AM – 7 PM IST" },
                { icon: Clock, label: "Response", val: "Within 24 business hours" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ width: 36, height: 36, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color="#64748B" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 14, color: "#374151" }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who works with us */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Who Works With Us</p>
              {["Banks & NBFCs","Real Estate Developers","Institutional Investors","Family Offices","Private Equity Firms","Home Buyers"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #E2E8F0", fontSize: 14, color: "#374151" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>

            {/* TAT guarantee */}
            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle size={20} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>Quick TAT Guarantee</p>
                  <p style={{ fontSize: 13, color: "#047857", lineHeight: 1.6 }}>Standard residential assignments in Mumbai, Delhi NCR, and Bengaluru delivered within 4 working days of site visit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
