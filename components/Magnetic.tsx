"use client";
import { useRef, MouseEvent as ReactMouseEvent } from "react";

interface Props {
  children: React.ReactNode;
  strength?: number;
  style?: React.CSSProperties;
  className?: string;
}

/** Wraps any element and gives it a subtle magnetic pull toward the cursor on hover. */
export default function Magnetic({ children, strength = 0.35, style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      style={{ display: "inline-block", transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", ...style }}
      className={className}
    >
      {children}
    </div>
  );
}
