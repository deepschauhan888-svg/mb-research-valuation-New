"use client";
import { useEffect, useState } from "react";
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mb_loaded")) { setHide(true); return; }
    let raf: number;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else { setDone(true); setTimeout(() => { setHide(true); sessionStorage.setItem("mb_loaded","1"); }, 500); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (hide) return null;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"var(--black)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:done?0:1,transition:"opacity 0.5s ease",pointerEvents:done?"none":"all" }}>
      <svg width="200" height="60" viewBox="0 0 200 60" style={{ marginBottom:28,opacity:0.3 }}>
        {[[8,10,16,50],[30,4,16,56],[52,18,16,42],[74,2,16,58],[96,12,16,48],[118,8,16,52],[140,22,16,38],[162,6,16,54],[184,14,16,46]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="var(--red)" strokeWidth="0.7" style={{animation:`buildingRise 1.2s cubic-bezier(0.76,0,0.24,1) ${i*0.06}s both`}}/>
        ))}
        <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      </svg>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:24 }}>
        <div style={{ background:"var(--red)",borderRadius:5,padding:"4px 8px" }}><span style={{ color:"#fff",fontWeight:900,fontSize:11,fontFamily:"Inter,sans-serif" }}>mb</span></div>
        <span style={{ fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:500,color:"#fff",letterSpacing:"-0.01em" }}>Research</span>
      </div>
      <div style={{ width:180,height:1,background:"rgba(255,255,255,0.1)",position:"relative",overflow:"hidden",marginBottom:12 }}>
        <div style={{ position:"absolute",left:0,top:0,bottom:0,width:`${progress}%`,background:"var(--red)",transition:"width 0.1s linear" }}/>
      </div>
      <span style={{ fontFamily:"DM Mono,monospace",fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em" }}>{progress}%</span>
    </div>
  );
}
