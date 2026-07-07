"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, ArrowRight } from "lucide-react";
import { EnquiryForm } from "@/types/valuation";

export default function Enquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EnquiryForm>();

  const onSubmit = async (data: EnquiryForm) => {
    setLoading(true);
    await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setLoading(false);
    setSubmitted(true);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "var(--white)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "13px 16px", fontSize: 14, color: "var(--ink)",
    outline: "none", fontFamily: "Inter,sans-serif", transition: "border-color 0.2s",
  };
  const label: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "var(--faint)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, display: "block", fontFamily: "Inter,sans-serif" };

  if (submitted) return (
    <div style={{ paddingTop: 64, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, background: "rgba(200,16,46,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <CheckCircle size={28} style={{ color: "var(--red)" }} />
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Enquiry received.</h2>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, fontFamily: "Inter,sans-serif" }}>We will review your request and respond within 24 hours. Mon–Sat · 9 AM – 7 PM IST.</p>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64 }}>
      <section className="section">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(40px,6vw,88px)", alignItems: "start" }}>
            {/* Left */}
            <div style={{ position: "sticky", top: 96 }}>
              <p className="t-label" style={{ marginBottom: 20 }}>Get in Touch</p>
              <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.06, marginBottom: 24 }}>
                Commission a<br /><em style={{ fontStyle: "italic", color: "var(--faint)" }}>valuation.</em>
              </h1>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, marginBottom: 36, fontFamily: "Inter,sans-serif" }}>
                Tell us about the asset, city, purpose, and timeline. We confirm scope and turnaround within 24 hours.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[["Email","research@mbresearch.in"],["Phone","+91 (00) 0000 0000"],["Hours","Mon–Sat · 9 AM – 7 PM IST"]].map(([l,v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)", fontSize: 13, fontFamily: "Inter,sans-serif" }}>
                    <span style={{ color: "var(--faint)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>{l}</span>
                    <span style={{ color: "var(--muted)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { name: "name" as const, label: "Full Name", placeholder: "Your full name", required: true },
                  { name: "company" as const, label: "Company / Institution", placeholder: "Bank, NBFC, Fund…", required: true },
                ].map(f => (
                  <div key={f.name}>
                    <span style={label}>{f.label}</span>
                    <input {...register(f.name, { required: f.required })} placeholder={f.placeholder} style={{ ...inp, borderColor: errors[f.name] ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                      onBlur={e => e.currentTarget.style.borderColor = errors[f.name] ? "var(--red)" : "var(--border)"} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { name: "email" as const, label: "Email Address", placeholder: "you@company.com", type: "email" },
                  { name: "phone" as const, label: "Phone Number", placeholder: "+91 98765 43210" },
                ].map(f => (
                  <div key={f.name}>
                    <span style={label}>{f.label}</span>
                    <input {...register(f.name, { required: true })} placeholder={f.placeholder} type={f.type} style={{ ...inp, borderColor: errors[f.name] ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                      onBlur={e => e.currentTarget.style.borderColor = errors[f.name] ? "var(--red)" : "var(--border)"} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <span style={label}>City</span>
                  <select {...register("city", { required: true })} style={{ ...inp, borderColor: errors.city ? "var(--red)" : "var(--border)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.city ? "var(--red)" : "var(--border)"}>
                    <option value="">Select city</option>
                    {["Mumbai","Delhi NCR","Bengaluru","Gurugram","Pune","Hyderabad","Chennai","Noida","Kolkata","Ahmedabad","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <span style={label}>Property Type</span>
                  <select {...register("property_type", { required: true })} style={{ ...inp, borderColor: errors.property_type ? "var(--red)" : "var(--border)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.property_type ? "var(--red)" : "var(--border)"}>
                    <option value="">Select type</option>
                    {["Residential – Apartment","Residential – Villa/Bungalow","Residential – Plot","Commercial – Office","Commercial – Retail","Commercial – Warehouse","Land","Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <span style={label}>Approximate Property Value</span>
                <select {...register("property_value")} style={inp}>
                  <option value="">Select range (optional)</option>
                  {["Below ₹50 Lakh","₹50 L – ₹1 Cr","₹1 Cr – ₹5 Cr","₹5 Cr – ₹25 Cr","₹25 Cr – ₹100 Cr","Above ₹100 Cr"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <span style={label}>Purpose of Valuation</span>
                <select {...register("requirement", { required: true })} style={{ ...inp, borderColor: errors.requirement ? "var(--red)" : "var(--border)" }}>
                  <option value="">Select purpose</option>
                  {["Home Loan / Mortgage","Loan Against Property","Investment Decision","Portfolio Assessment","Legal / Dispute","NPA / Stressed Asset","Acquisition Due Diligence","REIT / InvIT Compliance","Other"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <span style={label}>Additional Notes</span>
                <textarea {...register("message")} rows={4} placeholder="Any specific requirements, timelines, or additional details…"
                  style={{ ...inp, resize: "vertical", lineHeight: 1.65 }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
              <button type="submit" disabled={loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "var(--faint)" : "var(--red)", color: "#fff", padding: "15px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif", transition: "background 0.2s" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--red-dark)"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--red)"; }}>
                {loading ? "Sending…" : <><span>Submit Enquiry</span><ArrowRight size={15}/></>}
              </button>
              <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", fontFamily: "Inter,sans-serif" }}>We respond within 24 hours · All information is confidential</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}