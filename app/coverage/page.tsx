"use client";
import { useEffect, useRef } from "react";
import IndiaMap from "@/components/IndiaMap";
import { CityStats } from "@/types/valuation";
function useReveal(sel:string,stagger=0.1){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{let ctx:{revert():void}|undefined;(async()=>{const gsap=(await import("gsap")).default;const{ScrollTrigger}=await import("gsap/ScrollTrigger");gsap.registerPlugin(ScrollTrigger);if(!ref.current)return;ctx=gsap.context(()=>{gsap.fromTo(sel,{opacity:0,y:32},{opacity:1,y:0,duration:0.85,stagger,ease:"power3.out",scrollTrigger:{trigger:ref.current!,start:"top 84%",once:true}});},ref.current!);})();return()=>ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);return ref;
}
const CITIES=[
  {city:"Mumbai",region:"Mumbai Metropolitan Region",primary:true,micro:"BKC · Lower Parel · Worli · Andheri · Powai · Thane"},
  {city:"Delhi NCR",region:"National Capital Region",primary:true,micro:"South Delhi · Dwarka · Vasant Kunj · Saket"},
  {city:"Bengaluru",region:"Bengaluru Urban",primary:true,micro:"Whitefield · Koramangala · Sarjapur · Hebbal"},
  {city:"Gurugram",region:"NCR — Haryana",primary:true,micro:"Golf Course Road · Sohna Road · Dwarka Expressway"},
  {city:"Pune",region:"Pune Metropolitan Region",primary:false,micro:"Hinjewadi · Baner · Kharadi · Kalyani Nagar"},
  {city:"Hyderabad",region:"Hyderabad Metro",primary:false,micro:"Gachibowli · HITEC City · Banjara Hills"},
  {city:"Chennai",region:"Chennai Metropolitan Area",primary:false,micro:"OMR · ECR · Anna Nagar · Velachery"},
  {city:"Noida",region:"NCR — Uttar Pradesh",primary:false,micro:"Sector 150 · Noida Extension · Greater Noida West"},
  {city:"Kolkata",region:"Kolkata Metropolitan Area",primary:false,micro:"New Town · Salt Lake · EM Bypass · Alipore"},
  {city:"Ahmedabad",region:"Ahmedabad Metro",primary:false,micro:"SG Highway · Bopal · Prahlad Nagar · GIFT City"},
];
const EMPTY_STATS: CityStats[] = CITIES.map(c=>({city:c.city,total:0,residential:0,commercial:0,portfolio_value:0,buy:0,sell:0,investment:0}));
export default function Coverage(){
  const r1=useReveal(".c1",0.12) as React.RefObject<HTMLElement>;
  const r2=useReveal(".c2",0.06) as React.RefObject<HTMLElement>;
  return(
    <div style={{paddingTop:64}}>
      <section className="section" style={{borderBottom:"1px solid var(--border)"}} ref={r1}>
        <div className="wrap">
          <p className="t-label c1" style={{marginBottom:20}}>Coverage</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(32px,5vw,72px)",alignItems:"end"}}>
            <h1 className="c1" style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5.5vw,72px)",fontWeight:400,letterSpacing:"-0.025em",color:"var(--ink)",lineHeight:1.06}}>
              Active across<br/><em style={{fontStyle:"italic",color:"var(--red)"}}>10 Indian cities.</em>
            </h1>
            <div>
              <p className="t-body c1" style={{marginBottom:16}}>MB Research maintains active micro-market intelligence across 10 cities in India — from primary metros to emerging corridors.</p>
              <p className="c1" style={{fontSize:14,color:"var(--faint)",fontFamily:"Inter,sans-serif",lineHeight:1.7}}>Our coverage tracks individual sub-localities, new supply pipelines, pricing corridors, and RERA filings at the project level.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-sm" style={{background:"var(--cream-2)",borderBottom:"1px solid var(--border)"}}>
        <div className="wrap"><IndiaMap cityStats={EMPTY_STATS}/></div>
      </section>
      <section className="section" ref={r2}>
        <div className="wrap">
          <p className="t-label" style={{marginBottom:14}}>Market Directory</p>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:400,letterSpacing:"-0.02em",color:"var(--ink)",marginBottom:40}}>City-by-city coverage.</h2>
          <div style={{border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",background:"var(--white)"}}>
            {CITIES.map((c,i)=>(
              <div key={c.city} className="c2" style={{opacity:0,display:"grid",gridTemplateColumns:"180px 1fr 1.5fr",gap:24,alignItems:"center",padding:"20px 28px",borderBottom:i<CITIES.length-1?"1px solid var(--border)":"none",transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c.primary?"var(--red)":"var(--border-2)",flexShrink:0}}/>
                  <span style={{fontSize:16,fontWeight:500,color:"var(--ink)",fontFamily:"Cormorant Garamond,serif"}}>{c.city}</span>
                </div>
                <span style={{fontSize:13,color:"var(--muted)",fontFamily:"Inter,sans-serif"}}>{c.region}</span>
                <span style={{fontSize:12,color:"var(--faint)",fontFamily:"Inter,sans-serif"}}>{c.micro}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}