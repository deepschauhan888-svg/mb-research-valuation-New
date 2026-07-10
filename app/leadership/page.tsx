"use client";
import { useEffect, useRef, useState } from "react";
const LI = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/>
  </svg>
);

function Portrait({ name, photo }: { name: string; photo: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", aspectRatio: "3/4", borderRadius: 14,
        overflow: "hidden", position: "relative",
        transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)",
        transform: hov ? "scale(1.02)" : "scale(1)",
        background: "var(--cream-2)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt={name}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
          transform: hov ? "scale(1.04)" : "scale(1)",
        }}
      />
      {/* Subtle vignette at the bottom for smooth card integration */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "18%",
        background: "linear-gradient(to top, rgba(247,245,240,0.25) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
const TEAM=[
  { name:"Prasun Kumar",    role:"Chief Marketing Officer", bio:"A visionary business and marketing leader with a passion for growth, innovation, and value creation. Drives MB Research's brand strategy and institutional partnerships.", accent:"#3B82F6", photo:"/images/team/prasun-kumar.jpg",  linkedin:"https://www.linkedin.com/in/mrprasunkumar/" },
  { name:"Abhishek Bhadra", role:"Head of Research",        bio:"A real estate research leader with deep experience in market analysis, investment advisory, and strategic planning. Oversees methodology and quality across every assignment.", accent:"#10B981", photo:"/images/team/abhishek-bhadra.jpg", linkedin:"https://www.linkedin.com/in/abhishek-bhadra-68682b7" },
  { name:"Deepak Chauhan",  role:"Research Analyst",        bio:"Supports valuation analysis, comparable benchmarking, and investment recommendations. Specialises in residential micro-market data and RERA transaction research.", accent:"#8B5CF6", photo:"/images/team/deepak-chauhan.jpg",  linkedin:"https://www.linkedin.com/in/chauhan09deepak" },
];
function useReveal(sel:string,stagger=0.1){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{let ctx:{revert():void}|undefined;(async()=>{const gsap=(await import("gsap")).default;const{ScrollTrigger}=await import("gsap/ScrollTrigger");gsap.registerPlugin(ScrollTrigger);if(!ref.current)return;ctx=gsap.context(()=>{gsap.fromTo(sel,{opacity:0,y:32},{opacity:1,y:0,duration:0.85,stagger,ease:"power3.out",scrollTrigger:{trigger:ref.current!,start:"top 84%",once:true}});},ref.current!);})();return()=>ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);return ref;
}
export default function Leadership(){
  const r1=useReveal(".l1",0.15) as React.RefObject<HTMLElement>;
  return(
    <div style={{paddingTop:64}}>
      <section className="section" style={{borderBottom:"1px solid var(--border)"}}>
        <div className="wrap">
          <p className="t-label" style={{marginBottom:20}}>Leadership</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(32px,5vw,72px)",alignItems:"center"}}>
            <div>
              <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5.5vw,72px)",fontWeight:400,letterSpacing:"-0.025em",color:"var(--ink)",lineHeight:1.06,marginBottom:20}}>
                The people<br/><em style={{fontStyle:"italic",color:"var(--faint)"}}>behind every valuation.</em>
              </h1>
              <p className="t-body">Senior involvement on every assignment. No junior-only outputs. Every report reflects the analyst who signed it.</p>
            </div>
            {/* Architectural geometric visual — subtle, premium */}
            <div style={{position:"relative",height:"clamp(280px,35vw,400px)",borderRadius:16,overflow:"hidden",background:"var(--cream-2)",border:"1px solid var(--border)"}}>
              {/* Layered geometric lines suggesting a building facade */}
              <svg width="100%" height="100%" viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0}}>
                <defs>
                  <linearGradient id="lh-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cream-2)" stopOpacity="0"/>
                    <stop offset="100%" stopColor="var(--cream-2)" stopOpacity="1"/>
                  </linearGradient>
                  <linearGradient id="lh-horiz" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--cream-2)" stopOpacity="1"/>
                    <stop offset="30%" stopColor="var(--cream-2)" stopOpacity="0"/>
                    <stop offset="100%" stopColor="var(--cream-2)" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Building structure — vertical columns */}
                {[80,140,200,260,320,380].map((x,i)=>(
                  <rect key={i} x={x} y={20} width={44} height={340} fill="none" stroke="rgba(12,12,11,0.06)" strokeWidth="0.8"/>
                ))}
                {/* Horizontal floors */}
                {[60,100,140,180,220,260,300,340].map((y,i)=>(
                  <line key={i} x1={80} y1={y} x2={424} y2={y} stroke="rgba(12,12,11,0.05)" strokeWidth="0.8"/>
                ))}
                {/* Window grid */}
                {[80,140,200,260,320,380].flatMap((x,ci)=>
                  [60,100,140,180,220,260,300].map((y,ri)=>(
                    <rect key={`${ci}-${ri}`} x={x+8} y={y+8} width={28} height={24}
                      fill={`rgba(12,12,11,${0.02 + ((ci+ri)%3)*0.015})`}
                      stroke="rgba(12,12,11,0.04)" strokeWidth="0.5"/>
                  ))
                )}
                {/* Red accent — one highlighted column */}
                <rect x={200} y={20} width={44} height={340} fill="rgba(200,16,46,0.03)" stroke="rgba(200,16,46,0.15)" strokeWidth="0.8"/>
                {[60,100,140,180,220,260,300].map((y,i)=>(
                  <rect key={i} x={208} y={y+8} width={28} height={24} fill={`rgba(200,16,46,${0.04 + (i%2)*0.03})`} stroke="rgba(200,16,46,0.08)" strokeWidth="0.5"/>
                ))}
                {/* Fade overlays */}
                <rect x="0" y="0" width="480" height="380" fill="url(#lh-fade)"/>
                <rect x="0" y="0" width="480" height="380" fill="url(#lh-horiz)"/>
              </svg>
              {/* Overlay text */}
              <div style={{position:"absolute",bottom:24,right:24,textAlign:"right"}}>
                <p style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"var(--faint)",letterSpacing:"0.1em",lineHeight:1.8}}>
                  Research · Valuation<br/>Analysis · Intelligence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" ref={r1}>
        <div className="wrap">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(24px,3vw,40px)"}}>
            {TEAM.map(m=>(
              <div key={m.name} className="l1" style={{opacity:0,display:"flex",flexDirection:"column"}}>
                <Portrait name={m.name} photo={m.photo}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",paddingTop:22}}>
                  <h2 style={{fontSize:24,fontWeight:400,color:"var(--ink)",marginBottom:6,fontFamily:"Cormorant Garamond,serif",letterSpacing:"-0.01em"}}>{m.name}</h2>
                  <p style={{fontSize:10,fontWeight:700,color:m.accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:16,fontFamily:"Inter,sans-serif"}}>{m.role}</p>
                  <div style={{height:1,background:"var(--border)",marginBottom:16}}/>
                  <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.75,fontFamily:"Inter,sans-serif",flex:1}}>{m.bio}</p>
                  <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid var(--cream-2)"}}>
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",background:"var(--cream-2)",border:"1px solid var(--border)",borderRadius:7,fontSize:12,fontWeight:500,color:"var(--muted)",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all 0.2s",textDecoration:"none"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=m.accent;e.currentTarget.style.color=m.accent;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
                      <LI/> LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}