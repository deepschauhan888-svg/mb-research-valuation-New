"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AnalystLogin() {
  const router = useRouter();
  const login = useStore(s => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    setLoading(false);
    if (data.success) { login(email); router.push("/dashboard"); }
    else setError("Invalid credentials. Please try again.");
  };

  const inp: React.CSSProperties = { width: "100%", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 8, padding: "13px 16px", fontSize: 14, color: "var(--ink)", outline: "none", fontFamily: "Inter,sans-serif" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px var(--gutter, 24px)" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ background: "var(--red)", borderRadius: 5, padding: "4px 8px" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 11, fontFamily: "Inter,sans-serif" }}>mb</span></div>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 500, color: "var(--ink)" }}>Research</span>
          </div>
          <div style={{ width: 44, height: 44, background: "rgba(200,16,46,0.06)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock size={18} style={{ color: "var(--red)" }} />
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Analyst Portal</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter,sans-serif" }}>Restricted access · Authorised analysts only</p>
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--faint)", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "Inter,sans-serif" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="analyst@mbresearch.in" style={inp}
                onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--faint)", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "Inter,sans-serif" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ ...inp, paddingRight: 44 }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--ink)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--faint)", display: "flex" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p style={{ fontSize: 13, color: "var(--red)", fontFamily: "Inter,sans-serif", textAlign: "center" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: loading ? "var(--faint)" : "var(--red)", color: "#fff", padding: "13px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif", marginTop: 4, transition: "background 0.2s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--red-dark)"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--red)"; }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", marginTop: 20, fontFamily: "Inter,sans-serif" }}>Demo: analyst@mbresearch.in / mbresearch2025</p>
        </div>
      </div>
    </div>
  );
}