"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
function useReveal(sel:string,stagger=0.1){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{let ctx:{revert():void}|undefined;(async()=>{const gsap=(await import("gsap")).default;const{ScrollTrigger}=await import("gsap/ScrollTrigger");gsap.registerPlugin(ScrollTrigger);if(!ref.current)return;ctx=gsap.context(()=>{gsap.fromTo(sel,{opacity:0,y:32},{opacity:1,y:0,duration:0.85,stagger,ease:"power3.out",scrollTrigger:{trigger:ref.current!,start:"top 84%",once:true}});},ref.current!);})();return()=>ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);return ref;
}
const SVCS=[
  {id:"residential",title:"Residential Valuation",tag:"Core Service",
   scope:["Apartments & Condominiums","Villas & Row Houses","Plotted Developments","Under-construction Units"],
   method:["Sales Comparison Approach","RERA Transaction Database","Floor & View Adjustments","Age & Amenity Benchmarking"],
   deliverables:["Detailed Valuation Report","Comparable Transaction Analysis","Market Commentary","Lender-Grade Documentation"],
   tat:"2–4 working days",
   desc:"Comprehensive valuation for apartments, villas, and plotted developments across all ticket sizes — from affordable housing to ultra-luxury."},
  {id:"commercial",title:"Commercial Valuation",tag:"Institutional",
   scope:["Grade A & B Office Spaces","Retail & High-Street Units","Warehouses & Logistics Parks","Mixed-Use Developments"],
   method:["Income Capitalisation Approach","Discounted Cash Flow (DCF)","Lease & Yield Analysis","Macro & Micro Market Context"],
   deliverables:["Income Approach Workings","DCF Model (where applicable)","Lease Abstract Summary","REIT-Compliant Reports"],
   tat:"3–5 working days",
   desc:"Grade A and Grade B office spaces, retail, and industrial assets. Income capitalisation, DCF, and direct comparable approaches."},
  {id:"advisory",title:"Investment Advisory",tag:"Advisory",
   scope:["Buy / Sell / Hold Recommendations","Portfolio Assessment Programs","NPA & Stressed Asset Valuation","Pre-Acquisition Due Diligence"],
   method:["Comparable Market Analysis","Risk-Adjusted Return Modelling","Highest & Best Use Analysis","Scenario Sensitivity Testing"],
   deliverables:["Investment Recommendation Memo","Portfolio-Level Summary","Risk Assessment Note","Management Presentation"],
   tat:"Scoped per assignment",
   desc:"Independent Buy, Sell, or Hold recommendations derived purely from research data — supporting portfolio decisions for institutional investors."},
];
export default function Services(){
  const r1=useReveal(".s1",0.12) as React.RefObject<HTMLElement>;
  const r2=useReveal(".s2",0.1) as React.RefObject<HTMLElement>;
  return(
    <div style={{paddingTop:64}}>
      <section className="section" style={{borderBottom:"1px solid var(--border)"}} ref={r1}>
        <div className="wrap">
          <p className="t-label s1" style={{marginBottom:20}}>What We Offer</p>
          <h1 className="s1" style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5.5vw,72px)",fontWeight:400,letterSpacing:"-0.025em",color:"var(--ink)",lineHeight:1.06,marginBottom:24,maxWidth:700}}>
            Three services.<br/><em style={{fontStyle:"italic",color:"var(--faint)"}}>One standard of excellence.</em>
          </h1>
          <p className="t-body s1" style={{maxWidth:520}}>Every service is built on the same foundation: independent research, defensible methodology, and a commitment to accuracy over convenience.</p>
        </div>
      </section>
      <section ref={r2}>
        {SVCS.map((s,i)=>(
          <div key={s.id} id={s.id} className="s2" style={{opacity:0,background:i%2===0?"var(--cream)":"var(--cream-2)",borderBottom:"1px solid var(--border)",padding:"clamp(56px,6vw,88px) 0",scrollMarginTop:80}}>
            <div className="wrap">
              <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:"clamp(32px,5vw,64px)"}}>
                <div>
                  <span style={{fontSize:10,fontWeight:700,color:"var(--red)",letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:"Inter,sans-serif"}}>{s.tag}</span>
                  <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(24px,2.8vw,38px)",fontWeight:400,color:"var(--ink)",margin:"10px 0 16px",letterSpacing:"-0.015em",lineHeight:1.15}}>{s.title}</h2>
                  <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.75,marginBottom:22,fontFamily:"Inter,sans-serif"}}>{s.desc}</p>
                  <p style={{fontSize:10,fontWeight:700,color:"var(--faint)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6,fontFamily:"Inter,sans-serif"}}>Typical Turnaround</p>
                  <p style={{fontFamily:"DM Mono,monospace",fontSize:13,color:"var(--red)",fontWeight:600}}>{s.tat}</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(20px,3vw,40px)"}}>
                  {[{label:"Scope",items:s.scope},{label:"Methodology",items:s.method},{label:"Deliverables",items:s.deliverables}].map(col=>(
                    <div key={col.label}>
                      <p style={{fontSize:10,fontWeight:700,color:"var(--faint)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14,fontFamily:"Inter,sans-serif"}}>{col.label}</p>
                      <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                        {col.items.map(item=>(
                          <li key={item} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:13,color:"var(--muted)",lineHeight:1.5,fontFamily:"Inter,sans-serif"}}>
                            <CheckCircle2 size={13} style={{color:"var(--red)",flexShrink:0,marginTop:2}}/>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section style={{background:"var(--black)",padding:"clamp(64px,7vw,100px) 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.07) 0%, transparent 70%)"}}/>
        <div className="wrap" style={{textAlign:"center",position:"relative"}}>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(28px,4vw,52px)",fontWeight:400,color:"#fff",letterSpacing:"-0.02em",marginBottom:18}}>Commission an assignment.</h2>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.35)",marginBottom:32,fontFamily:"Inter,sans-serif"}}>Tell us about your asset, city, and timeline. We confirm scope within 24 hours.</p>
          <Link href="/enquiry" style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--red)",color:"#fff",padding:"13px 28px",borderRadius:7,fontSize:14,fontWeight:600,fontFamily:"Inter,sans-serif",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--red-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--red)"}>
            Request a Valuation <ArrowRight size={15}/>
          </Link>
        </div>
      </section>
    </div>
  );
}