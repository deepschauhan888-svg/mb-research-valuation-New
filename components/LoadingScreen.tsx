"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mb_loaded")) {
      setHide(true);
      return;
    }
    let raf: number;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        setTimeout(() => {
          setHide(true);
          sessionStorage.setItem("mb_loaded", "1");
        }, 550);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (hide) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#0A0A0A",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: done ? 0 : 1,
        transition: "opacity 0.55s cubic-bezier(0.23,1,0.32,1)",
        pointerEvents: done ? "none" : "all",
      }}
    >
      {/* Wireframe skyline */}
      <svg width="220" height="70" viewBox="0 0 220 70" style={{ marginBottom: 36, opacity: 0.35 }}>
        {[
          [10, 30, 18, 40], [34, 14, 18, 56], [58, 38, 18, 32], [82, 6, 18, 64],
          [106, 24, 18, 46], [130, 18, 18, 52], [154, 34, 18, 36], [178, 10, 18, 60],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="#C8102E" strokeWidth="0.7"
            style={{ animation: `skylineRise 1.4s cubic-bezier(0.23,1,0.32,1) ${i * 0.06}s both` }} />
        ))}
        <line x1="0" y1="70" x2="220" y2="70" stroke="#333" strokeWidth="0.5" />
      </svg>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ background: "#C8102E", borderRadius: 8, padding: "8px 14px" }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 18, letterSpacing: "0.05em", fontFamily: "Inter,sans-serif" }}>mb</span>
        </div>
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "Cormorant Garamond,serif", letterSpacing: "-0.01em" }}>
          Research
        </span>
      </div>

      {/* Progress line */}
      <div style={{ width: 200, height: 1, background: "rgba(255,255,255,0.1)", position: "relative", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: "#C8102E", transition: "width 0.1s linear" }} />
      </div>

      <span style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
        {progress}%
      </span>

      <style>{`
        @keyframes skylineRise {
          from { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
          to   { transform: scaleY(1); transform-origin: bottom; opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
