"use client";
import { useRef } from "react";
interface Props { children: React.ReactNode; strength?: number; style?: React.CSSProperties; }
export default function Magnetic({ children, strength=0.35, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{ const el=ref.current; if(!el)return; const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*strength}px,${(e.clientY-r.top-r.height/2)*strength}px)`; };
  const onLeave=()=>{ if(ref.current) ref.current.style.transform="translate(0,0)"; };
  return(<div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{display:"inline-block",transition:"transform 0.3s cubic-bezier(0.76,0,0.24,1)",...style}}>{children}</div>);
}
