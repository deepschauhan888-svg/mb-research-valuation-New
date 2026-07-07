"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
const NAV=[{href:"/about",label:"About"},{href:"/services",label:"Services"},{href:"/coverage",label:"Coverage"},{href:"/research",label:"Research"},{href:"/leadership",label:"Leadership"},{href:"/enquiry",label:"Enquiry"}];
export default function Navbar() {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  const isDark=pathname==="/";
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn); },[]);
  useEffect(()=>setOpen(false),[pathname]);
  if(pathname?.startsWith("/dashboard")) return null;
  const solid=scrolled||!isDark;
  const textCol=solid?"var(--ink)":"#fff";
  const mutedCol=solid?"var(--muted)":"rgba(255,255,255,0.55)";
  return(<>
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:solid?"rgba(247,245,240,0.94)":"transparent",backdropFilter:solid?"blur(16px)":"none",borderBottom:solid?"1px solid var(--border)":"1px solid transparent",transition:"all 0.4s cubic-bezier(0.76,0,0.24,1)"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(24px,4vw,48px)",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"var(--red)",borderRadius:5,padding:"4px 8px"}}><span style={{color:"#fff",fontWeight:900,fontSize:11,fontFamily:"Inter,sans-serif",letterSpacing:"0.05em"}}>mb</span></div>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:500,color:textCol,letterSpacing:"-0.01em",transition:"color 0.4s"}}>Research</span>
        </Link>
        <nav style={{display:"flex",alignItems:"center",gap:2}} className="hidden lg:flex">
          {NAV.map(l=>{const active=pathname===l.href; return(<Link key={l.href} href={l.href} style={{padding:"8px 14px",fontSize:13,fontWeight:500,color:active?textCol:mutedCol,borderRadius:6,transition:"color 0.2s",fontFamily:"Inter,sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=textCol} onMouseLeave={e=>{if(!active)e.currentTarget.style.color=mutedCol;}}>{l.label}</Link>);})}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:12}} className="hidden lg:flex">
          <Link href="/analyst-login" style={{fontSize:12,fontWeight:500,color:mutedCol,fontFamily:"Inter,sans-serif",padding:"8px 12px",transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=textCol} onMouseLeave={e=>e.currentTarget.style.color=mutedCol}>Analyst Login</Link>
          <Link href="/enquiry" style={{background:"var(--red)",color:"#fff",padding:"9px 20px",borderRadius:7,fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif",transition:"background 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--red-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--red)"}>Get in Touch</Link>
        </div>
        <button className="lg:hidden" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",padding:8,color:textCol,display:"flex"}}>{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
    </header>
    <div style={{position:"fixed",inset:0,zIndex:99,background:"var(--cream)",paddingTop:64,transform:open?"translateX(0)":"translateX(100%)",transition:"transform 0.4s cubic-bezier(0.76,0,0.24,1)",overflowY:"auto"}} className="lg:hidden">
      <div style={{padding:"32px clamp(24px,4vw,48px)"}}>
        {[{href:"/",label:"Home"},...NAV].map(l=><Link key={l.href} href={l.href} style={{display:"block",padding:"16px 0",fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:400,color:pathname===l.href?"var(--red)":"var(--ink)",borderBottom:"1px solid var(--border)",letterSpacing:"-0.01em"}}>{l.label}</Link>)}
        <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:12}}>
          <Link href="/analyst-login" style={{textAlign:"center",padding:"13px",border:"1px solid var(--border)",borderRadius:8,fontSize:14,fontWeight:500,color:"var(--ink)",fontFamily:"Inter,sans-serif"}}>Analyst Login</Link>
          <Link href="/enquiry" style={{textAlign:"center",padding:"13px",background:"var(--red)",borderRadius:8,fontSize:14,fontWeight:600,color:"#fff",fontFamily:"Inter,sans-serif"}}>Get in Touch</Link>
        </div>
      </div>
    </div>
  </>);
}
