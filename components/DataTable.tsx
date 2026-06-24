"use client";
import { Valuation } from "@/types/valuation";
import { formatCrore } from "@/lib/analytics";

const RECO: Record<string, { bg: string; color: string; border: string }> = {
  Buy:        { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  Sell:       { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  Investment: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
};
const TYPE: Record<string, { bg: string; color: string }> = {
  Residential: { bg: "#EFF6FF", color: "#1D4ED8" },
  Commercial:  { bg: "#F5F3FF", color: "#7C3AED" },
};

export default function DataTable({ valuations, limit = 10 }: { valuations: Valuation[]; limit?: number }) {
  const rows = valuations.slice(0, limit);
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>Recent Valuations</h3>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Latest assignments in the database</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Property", "City", "Type", "Recommendation", "Value"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F8FAFC", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{v.property_name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{v.developer_name}</div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#374151" }}>{v.city}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: TYPE[v.property_type]?.bg, color: TYPE[v.property_type]?.color }}>
                    {v.property_type}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: RECO[v.recommendation_type]?.bg, color: RECO[v.recommendation_type]?.color, border: `1px solid ${RECO[v.recommendation_type]?.border}` }}>
                    {v.recommendation_type}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 14, color: "#0F172A", whiteSpace: "nowrap" }}>
                  {formatCrore(v.mb_research_value)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "#94A3B8", fontSize: 14 }}>No valuations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
