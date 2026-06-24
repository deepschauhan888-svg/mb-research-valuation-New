"use client";
import { TrendingUp, TrendingDown, BarChart3, Building2, IndianRupee } from "lucide-react";
import { KPIData } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

const CARDS = [
  { key: "total_valuations",  label: "Total Valuations",             icon: BarChart3,    color: "#0F172A", bg: "#F1F5F9", fmt: (v: number) => v.toString() },
  { key: "portfolio_value",   label: "Portfolio Value Assessed",      icon: IndianRupee,  color: "#059669", bg: "#ECFDF5", fmt: (v: number) => formatCrore(v) },
  { key: "buy_count",         label: "Buy Recommendations",           icon: TrendingUp,   color: "#059669", bg: "#ECFDF5", fmt: (v: number) => v.toString() },
  { key: "sell_count",        label: "Sell Recommendations",          icon: TrendingDown, color: "#DC2626", bg: "#FEF2F2", fmt: (v: number) => v.toString() },
  { key: "investment_count",  label: "Investment Recommendations",    icon: Building2,    color: "#D97706", bg: "#FFFBEB", fmt: (v: number) => v.toString() },
] as const;

export default function KPICards({ data }: { data: KPIData }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
      {CARDS.map(c => {
        const Icon = c.icon;
        const val = data[c.key as keyof KPIData] as number;
        return (
          <div key={c.key} className="card" style={{ padding: "28px 24px", cursor: "default" }}>
            <div style={{ width: 40, height: 40, background: c.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Icon size={18} style={{ color: c.color }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
              {c.fmt(val)}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, lineHeight: 1.4 }}>{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}
