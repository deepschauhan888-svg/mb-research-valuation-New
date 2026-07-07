"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
export default function MonthlySummaryRedirect() {
  const router = useRouter();
  const isLoggedIn = useStore(s => s.isLoggedIn);
  useEffect(() => {
    router.replace(isLoggedIn ? "/dashboard?tab=monthly" : "/analyst-login");
  }, [isLoggedIn, router]);
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--cream)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:28, height:28, border:"2px solid var(--border)", borderTopColor:"var(--red)", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }}/>
        <p style={{ fontSize:13, color:"var(--faint)", fontFamily:"Inter,sans-serif" }}>Redirecting…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}