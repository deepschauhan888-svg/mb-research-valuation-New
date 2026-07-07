"use client";
import { TrendingUp, TrendingDown, BarChart3, Building2, IndianRupee } from "lucide-react";
import { KPIData } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";
interface Props { data: KPIData; }
const cards = [
  { key:"total_valuations",label:"Total Valuations",icon:BarChart3,color:"#0F172A",bg:"#F1F5F9",fmt:(v:number)=>v.toString()},
  { key:"portfolio_value",label:"Portfolio Value",icon:IndianRupee,color:"#059669",bg:"#ECFDF5",fmt:(v:number)=>formatCrore(v)},
  { key:"buy_count",label:"Buy Recommendations",icon:TrendingUp,color:"#059669",bg:"#ECFDF5",fmt:(v:number)=>v.toString()},
  { key:"sell_count",label:"Sell Recommendations",icon:TrendingDown,color:"#DC2626",bg:"#FEF2F2",fmt:(v:number)=>v.toString()},
  { key:"investment_count",label:"Investment Recommendations",icon:Building2,color:"#D97706",bg:"#FFFBEB",fmt:(v:number)=>v.toString()},
] as const;
export default function KPICards({data}:Props){
  return(<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{cards.map(c=>{const Icon=c.icon;const val=data[c.key as keyof KPIData];return(<div key={c.key} className="bg-white rounded-xl border border-[#E5E7EB] p-5"><div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:c.bg}}><Icon size={16} style={{color:c.color}}/></div><div className="text-2xl font-bold text-[#0F172A] mb-1 tracking-tight">{c.fmt(val as number)}</div><div className="text-xs text-[#6B7280] font-medium">{c.label}</div></div>)})}</div>);
}
