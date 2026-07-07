"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { CityStats } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";
interface Props { cityStats: CityStats[]; }
const CITY_COORDS: Record<string,{x:number;y:number}> = {
  "Delhi NCR":{x:350,y:195},"Gurugram":{x:338,y:210},"Noida":{x:364,y:200},
  "Kolkata":{x:558,y:310},"Mumbai":{x:255,y:420},"Pune":{x:268,y:455},
  "Ahmedabad":{x:215,y:340},"Hyderabad":{x:368,y:470},"Chennai":{x:400,y:555},"Bengaluru":{x:360,y:540},
};
const INDIA_PATH=`M 310 45 L 340 40 L 380 55 L 420 50 L 460 70 L 490 60 L 530 80 L 560 100 L 580 130 L 590 160 L 575 190 L 590 220 L 600 260 L 585 295 L 570 320 L 555 350 L 540 370 L 510 390 L 490 420 L 470 450 L 450 475 L 430 500 L 415 530 L 400 560 L 385 590 L 370 615 L 355 600 L 340 575 L 320 555 L 300 530 L 285 500 L 270 470 L 260 440 L 245 410 L 235 375 L 230 345 L 220 315 L 215 285 L 210 255 L 215 225 L 220 195 L 230 165 L 245 140 L 255 115 L 265 90 L 275 70 L 295 55 Z`;
export default function IndiaMap({cityStats}:Props){
  const [selected,setSelected]=useState<CityStats|null>(null);
  const [hov,setHov]=useState<string|null>(null);
  const cm=new Map(cityStats.map(c=>[c.city,c]));
  const pick=(name:string)=>{ const s=cm.get(name); setSelected(s??{city:name,total:0,residential:0,commercial:0,portfolio_value:0,buy:0,sell:0,investment:0}); };
  return(
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex justify-center">
          <svg viewBox="100 30 520 620" width="100%" style={{maxHeight:"480px",maxWidth:"380px"}}>
            <path d={INDIA_PATH} fill="#F8F9FB" stroke="#E5E7EB" strokeWidth="1.5"/>
            {Object.entries(CITY_COORDS).map(([name,{x,y}])=>{ const stats=cm.get(name); const hd=stats&&stats.total>0; const ih=hov===name; const is=selected?.city===name;
              return(<g key={name} style={{cursor:"pointer"}} onClick={()=>pick(name)} onMouseEnter={()=>setHov(name)} onMouseLeave={()=>setHov(null)}>
                {(ih||is)&&<circle cx={x} cy={y} r={12} fill={is?"rgba(200,16,46,0.12)":"rgba(15,23,42,0.07)"}/>}
                <circle cx={x} cy={y} r={hd?7:5} fill={is?"#C8102E":hd?"#0C0C0B":"#9CA3AF"} stroke="white" strokeWidth={2}/>
                {hd&&<text x={x} y={y+3.5} textAnchor="middle" fontSize="7" fontFamily="Inter,sans-serif" fontWeight="700" fill="white">{stats!.total}</text>}
                <text x={x} y={y-14} textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fontWeight={is||ih?"700":"500"} fill={is?"#C8102E":ih?"#0C0C0B":"#6B7280"}>{name}</text>
              </g>);
            })}
          </svg>
        </div>
        <div className="lg:w-64">
          {selected?(
            <div className="bg-[#F8F9FB] rounded-xl border border-[#E5E7EB] p-5 relative">
              <button onClick={()=>setSelected(null)} className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#374151]"><X size={16}/></button>
              <h4 className="font-bold text-[#0C0C0B] text-base mb-4">{selected.city}</h4>
              {selected.total===0?<p className="text-sm text-[#9CA3AF]">No assignments yet.</p>:(
                <div className="space-y-2">
                  {[{l:"Total",v:String(selected.total)},{l:"Residential",v:String(selected.residential)},{l:"Commercial",v:String(selected.commercial)},{l:"Portfolio",v:formatCrore(selected.portfolio_value)},{l:"Buy",v:String(selected.buy)},{l:"Sell",v:String(selected.sell)},{l:"Investment",v:String(selected.investment)}].map(({l,v})=>(
                    <div key={l} className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-xs text-[#6B7280]">{l}</span><span className="text-sm font-semibold text-[#0C0C0B]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ):(
            <div className="h-full flex flex-col justify-center items-center py-12 text-center">
              <p className="text-sm font-medium text-[#374151] mb-1">Select a City</p>
              <p className="text-xs text-[#9CA3AF] mb-4">Click any dot on the map</p>
              {cityStats.filter(c=>c.total>0).slice(0,5).map(c=>(
                <button key={c.city} onClick={()=>setSelected(c)} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                  <div className="flex justify-between items-center"><span className="text-xs font-medium text-[#374151]">{c.city}</span><span className="text-xs text-[#9CA3AF]">{c.total}</span></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
