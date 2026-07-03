"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

/**
 * Monthly Summary is an analyst-only feature.
 * Public visitors are redirected to the analyst login.
 * Logged-in analysts are redirected to the dashboard (monthly tab).
 */
export default function MonthlySummaryRedirect() {
  const router    = useRouter();
  const isLoggedIn = useStore(s => s.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard?tab=monthly");
    } else {
      router.replace("/analyst-login?next=monthly");
    }
  }, [isLoggedIn, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", paddingTop: 68 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "2.5px solid #E5E7EB", borderTopColor: "#C8102E", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontSize: 14, color: "#9CA3AF", fontFamily: "Inter,sans-serif" }}>Redirecting…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
