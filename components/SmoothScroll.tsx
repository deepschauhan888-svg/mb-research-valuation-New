"use client";
import { useEffect } from "react";
export default function SmoothScroll() {
  useEffect(() => {
    let lenis: import("lenis").default | null = null;
    (async () => {
      const { default: Lenis } = await import("lenis");
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis!.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    })();
    return () => { lenis?.destroy(); };
  }, []);
  return null;
}
