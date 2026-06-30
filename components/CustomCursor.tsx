"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only enable on fine-pointer (desktop) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let mx = 0, my = 0, rx = 0, ry = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
    };

    const raf = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      requestAnimationFrame(raf);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) setHovering(true);
    };
    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) setHovering(false);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });
    const id = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      cancelAnimationFrame(id);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 6, height: 6,
          background: "#C8102E", borderRadius: "50%",
          pointerEvents: "none", zIndex: 10000,
          marginLeft: -3, marginTop: -3,
          transition: "opacity 0.2s",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: hovering ? 52 : 30, height: hovering ? 52 : 30,
          border: `1px solid ${hovering ? "rgba(200,16,46,0.5)" : "rgba(10,10,10,0.25)"}`,
          background: hovering ? "rgba(200,16,46,0.06)" : "transparent",
          borderRadius: "50%",
          pointerEvents: "none", zIndex: 9999,
          marginLeft: hovering ? -26 : -15,
          marginTop: hovering ? -26 : -15,
          transition: "width 0.25s cubic-bezier(0.23,1,0.32,1), height 0.25s cubic-bezier(0.23,1,0.32,1), margin 0.25s cubic-bezier(0.23,1,0.32,1), border-color 0.25s, background 0.25s",
        }}
      />
      <style>{`
        @media (pointer: fine) {
          a, button { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
