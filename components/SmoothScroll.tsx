"use client";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: import("lenis").default | null = null;

    const init = async () => {
      const { default: Lenis } = await import("lenis");
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
