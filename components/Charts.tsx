"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { MonthlyData } from "@/types/valuation";

const REC_COLORS = { Buy: "#10B981", Sell: "#EF4444", Investment: "#F59E0B" };

const Tip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(15,23,42,0.1)", fontSize: 13 }}>
      <p style={{ fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#64748B" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#0F172A" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyTrendChart({ monthly }: { monthly: MonthlyData[] }) {
  const data = monthly.slice(-12).map(m => ({ name: m.month.slice(0, 3), count: m.count }));
  return (
    <div className="card" style={{ padding: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Monthly Valuation Trend</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>Assignments completed per month</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={22} margin={{ top: 0, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(15,23,42,0.03)" }} />
          <Bar dataKey="count" fill="#0F172A" radius={[5, 5, 0, 0]} name="Valuations" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RecommendationChart({ buy, sell, investment }: { buy: number; sell: number; investment: number }) {
  const total = buy + sell + investment;
  const data = [{ name: "Buy", value: buy }, { name: "Sell", value: sell }, { name: "Investment", value: investment }].filter(d => d.value > 0);
  return (
    <div className="card" style={{ padding: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Recommendation Distribution</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 20 }}>Buy · Sell · Investment split</p>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={66} dataKey="value" strokeWidth={0}>
              {data.map(e => <Cell key={e.name} fill={REC_COLORS[e.name as keyof typeof REC_COLORS]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map(d => (
            <div key={d.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: REC_COLORS[d.name as keyof typeof REC_COLORS] }} />
                  <span style={{ fontSize: 12, color: "#64748B" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{total > 0 ? Math.round(d.value / total * 100) : 0}%</span>
              </div>
              <div style={{ height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: REC_COLORS[d.name as keyof typeof REC_COLORS], width: `${total > 0 ? d.value / total * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PropertySplitChart({ residential, commercial }: { residential: number; commercial: number }) {
  const total = residential + commercial;
  return (
    <div className="card" style={{ padding: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Residential vs Commercial</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>Property type breakdown</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[{ label: "Residential", val: residential, color: "#0F172A" }, { label: "Commercial", val: commercial, color: "#C8102E" }].map(({ label, val, color }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{val}</span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{total > 0 ? Math.round(val / total * 100) : 0}%</span>
              </div>
            </div>
            <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", background: color, borderRadius: 3, width: `${total > 0 ? val / total * 100 : 0}%`, transition: "width 0.8s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
