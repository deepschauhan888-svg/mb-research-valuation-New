"use client";
import { useEffect, useRef, useState } from "react";
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    setOn(true);
    let mx=0,my=0,rx=0,ry=0;
    const move=(e:MouseEvent)=>{ mx=e.clientX;my=e.clientY; if(dot.current) dot.current.style.transform=`translate(${mx}px,${my}px)`; };
    const raf=()=>{ rx+=(mx-rx)*0.16;ry+=(my-ry)*0.16; if(ring.current) ring.current.style.transform=`translate(${rx}px,${ry}px)`; requestAnimationFrame(raf); };
    const over=(e:MouseEvent)=>{ if((e.target as HTMLElement).closest("a,button,[data-hover]")) setHov(true); };
    const out=(e:MouseEvent)=>{ if((e.target as HTMLElement).closest("a,button,[data-hover]")) setHov(false); };
    window.addEventListener("mousemove",move,{passive:true});
    window.addEventListener("mouseover",over,{passive:true});
    window.addEventListener("mouseout",out,{passive:true});
    requestAnimationFrame(raf);
    return ()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseover",over); window.removeEventListener("mouseout",out); };
  },[]);
  if(!on) return null;
  return(<>
    <div ref={dot} style={{position:"fixed",top:0,left:0,width:6,height:6,background:"var(--red)",borderRadius:"50%",pointerEvents:"none",zIndex:10000,marginLeft:-3,marginTop:-3}}/>
    <div ref={ring} style={{position:"fixed",top:0,left:0,width:hov?48:28,height:hov?48:28,border:`1px solid ${hov?"rgba(200,16,46,0.4)":"rgba(12,12,11,0.2)"}`,borderRadius:"50%",pointerEvents:"none",zIndex:9999,marginLeft:hov?-24:-14,marginTop:hov?-24:-14,background:hov?"rgba(200,16,46,0.05)":"transparent",transition:"all 0.25s cubic-bezier(0.76,0,0.24,1)"}}/>
    <style>{`@media(pointer:fine){a,button{cursor:none!important}}`}</style>
  </>);
}
