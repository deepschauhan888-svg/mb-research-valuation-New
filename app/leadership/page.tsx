"use client";
import { useEffect, useRef, useState } from "react";
const LI = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/>
  </svg>
);
function Portrait({name,color,accent}:{name:string;color:string;accent:string}){
  const [hov,setHov]=useState(false);
  const initials=name.split(" ").map(w=>w[0]).join("");
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{width:"100%",aspectRatio:"3/4",borderRadius:14,overflow:"hidden",position:"relative",background:`linear-gradient(160deg,${color} 0%,${accent} 100%)`,transition:"transform 0.4s cubic-bezier(0.76,0,0.24,1)",transform:hov?"scale(1.02)":"scale(1)"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:52,fontWeight:400,color:"rgba(255,255,255,0.9)",fontFamily:"Cormorant Garamond,serif",letterSpacing:"-0.02em",fontStyle:"italic"}}>{initials}</span>
        <span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.4)",letterSpacing:"0.2em",textTransform:"uppercase",marginTop:8,fontFamily:"Inter,sans-serif"}}>Photo Placeholder</span>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)"}}/>
    </div>
  );
}
const TEAM=[
  {name:"Prasun Kumar",role:"Chief Marketing Officer",bio:"A visionary business and marketing leader with a passion for growth, innovation, and value creation. Drives MB Research's brand strategy and institutional partnerships.",color:"#1E3A5F",accent:"#3B82F6"},
  {name:"Abhishek Bhadra",role:"Head of Research",bio:"A real estate research leader with deep experience in market analysis, investment advisory, and strategic planning. Oversees methodology and quality across every assignment.",color:"#1F2937",accent:"#10B981"},
  {name:"Deepak Chauhan",role:"Research Analyst",bio:"Supports valuation analysis, comparable benchmarking, and investment recommendations. Specialises in residential micro-market data and RERA transaction research.",color:"#4C1D95",accent:"#8B5CF6"},
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(32px,5vw,72px)",alignItems:"end"}}>
            <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5.5vw,72px)",fontWeight:400,letterSpacing:"-0.025em",color:"var(--ink)",lineHeight:1.06}}>
              The people<br/><em style={{fontStyle:"italic",color:"var(--faint)"}}>behind every valuation.</em>
            </h1>
            <p className="t-body">Senior involvement on every assignment. No junior-only outputs. Every report reflects the analyst who signed it.</p>
          </div>
        </div>
      </section>
      <section className="section" ref={r1}>
        <div className="wrap">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(32px,4vw,56px)"}}>
            {TEAM.map(m=>(
              <div key={m.name} className="l1" style={{opacity:0}}>
                <Portrait name={m.name} color={m.color} accent={m.accent}/>
                <h2 style={{fontSize:24,fontWeight:400,color:"var(--ink)",marginBottom:4,fontFamily:"Cormorant Garamond,serif",letterSpacing:"-0.01em",marginTop:20}}>{m.name}</h2>
                <p style={{fontSize:10,fontWeight:700,color:m.accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:16,fontFamily:"Inter,sans-serif"}}>{m.role}</p>
                <div style={{height:1,background:"var(--border)",marginBottom:16}}/>
                <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.75,marginBottom:20,fontFamily:"Inter,sans-serif"}}>{m.bio}</p>
                <button style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",background:"var(--cream-2)",border:"1px solid var(--border)",borderRadius:7,fontSize:12,fontWeight:500,color:"var(--muted)",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=m.accent;e.currentTarget.style.color=m.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
                  <LI/> LinkedIn Profile
                </button>
              </div>
            ))}
          </div>
          <div style={{marginTop:56,padding:"18px 22px",background:"var(--cream-2)",border:"1px dashed var(--border-2)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--faint)",flexShrink:0}}/>
            <p style={{fontSize:12,color:"var(--faint)",fontFamily:"Inter,sans-serif"}}>Portrait placeholders are 3:4 ratio. Replace by adding <code style={{background:"var(--border)",padding:"1px 5px",borderRadius:3,fontSize:11}}>/public/images/team/[name].jpg</code> and uncommenting the img tag in <code style={{background:"var(--border)",padding:"1px 5px",borderRadius:3,fontSize:11}}>app/leadership/page.tsx</code>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}