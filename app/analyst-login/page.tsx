"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Eye, EyeOff, Lock } from "lucide-react";

const DEMO = [
  { email: "analyst@mbresearch.in", password: "mbresearch2025" },
  { email: "admin@mbresearch.in",   password: "admin2025" },
  { email: "deep@mbresearch.in",    password: "deep2025" },
];

export default function AnalystLoginPage() {
  const router = useRouter();
  const login  = useStore(s => s.login);
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = DEMO.find(u => u.email === email && u.password === pw);
    if (ok) { login(email); router.push("/dashboard"); }
    else    { setError("Invalid email or password."); setLoading(false); }
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "#F8FAFC",
    border: "1.5px solid #E2E8F0", borderRadius: 10,
    padding: "14px 16px", fontSize: 15, color: "#0F172A",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ background: "#C8102E", borderRadius: 8, padding: "6px 11px" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: "0.05em" }}>mb</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: "-0.02em" }}>MB Research</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: 8 }}>
            Analyst Login
          </h1>
          <p style={{ fontSize: 15, color: "#64748B" }}>Sign in to access the valuation platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: 40, boxShadow: "0 4px 32px rgba(15,23,42,0.06)" }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151", marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@mbresearch.in"
                style={inp}
                onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151" }}>
                  Password
                </label>
                <button type="button" style={{ fontSize: 13, color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#0F172A"}
                  onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="••••••••••"
                  style={{ ...inp, paddingRight: 48 }}
                  onFocus={e => e.currentTarget.style.borderColor = "#0F172A"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#64748B"}
                  onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626", marginBottom: 20 }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "#0F172A", color: "#fff", padding: "15px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1E293B"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#0F172A"}>
              {loading
                ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in...</>
                : <><Lock size={15} /> Sign In</>}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: 16, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "18px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Demo Credentials</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: "#78350F" }}>Email:</span>
            <code style={{ fontSize: 13, background: "#FEF3C7", padding: "1px 8px", borderRadius: 5, color: "#92400E", fontFamily: "monospace" }}>analyst@mbresearch.in</code>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#78350F" }}>Password:</span>
            <code style={{ fontSize: 13, background: "#FEF3C7", padding: "1px 8px", borderRadius: 5, color: "#92400E", fontFamily: "monospace" }}>mbresearch2025</code>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 20 }}>
          Authorised personnel only · All access is logged
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
