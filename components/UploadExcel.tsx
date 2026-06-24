"use client";
import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react";
import { parseExcel } from "@/lib/excelParser";
import { Valuation } from "@/types/valuation";

interface Props { onUploaded: (data: Valuation[]) => void; }

export default function UploadExcel({ onUploaded }: Props) {
  const [status, setStatus]   = useState<"idle"|"parsing"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const process = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setStatus("error"); setMessage("Please upload a valid .xlsx or .xls file."); return;
    }
    setStatus("parsing"); setMessage("");
    try {
      const rows = parseExcel(await file.arrayBuffer());
      if (!rows.length) { setStatus("error"); setMessage("No valid records found. Check column headers."); return; }
      setCount(rows.length);
      setStatus("success");
      setMessage(`${rows.length} record${rows.length !== 1 ? "s" : ""} imported successfully.`);
      onUploaded(rows);
    } catch { setStatus("error"); setMessage("Failed to parse file. Check the format and try again."); }
  };

  const reset = () => { setStatus("idle"); setMessage(""); setCount(0); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 36, height: 36, background: "#F1F5F9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileSpreadsheet size={18} color="#0F172A" />
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Upload Valuation Data</h3>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>Import assignments from Excel (.xlsx / .xls)</p>
        </div>
      </div>

      <div style={{ height: 1, background: "#F1F5F9", margin: "20px 0" }} />

      {status === "success" || status === "error" ? (
        <div style={{
          borderRadius: 14, padding: 20,
          background: status === "success" ? "#ECFDF5" : "#FEF2F2",
          border: `1px solid ${status === "success" ? "#A7F3D0" : "#FECACA"}`,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          {status === "success"
            ? <CheckCircle size={20} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
            : <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: status === "success" ? "#065F46" : "#991B1B", marginBottom: 4 }}>
              {status === "success" ? "Import Successful" : "Import Failed"}
            </p>
            <p style={{ fontSize: 13, color: status === "success" ? "#047857" : "#B91C1C" }}>{message}</p>
            {status === "success" && <p style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>Dashboard KPIs and charts have been updated.</p>}
          </div>
          <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.color = "#64748B"}
            onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => status !== "parsing" && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) process(e.dataTransfer.files[0]); }}
          style={{
            borderRadius: 14, padding: "48px 32px", textAlign: "center",
            border: `2px dashed ${dragging ? "#0F172A" : "#E2E8F0"}`,
            background: dragging ? "#F8FAFC" : "#FAFAFA",
            cursor: status === "parsing" ? "default" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (status !== "parsing") { (e.currentTarget as HTMLElement).style.borderColor = "#94A3B8"; (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLElement).style.background = "#FAFAFA"; }}
        >
          <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => e.target.files?.[0] && process(e.target.files[0])} />
          <div style={{ width: 56, height: 56, background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            {status === "parsing"
              ? <div style={{ width: 22, height: 22, border: "2.5px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : <Upload size={22} color="#64748B" />}
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
            {status === "parsing" ? "Processing your file..." : "Drop your Excel file here"}
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8" }}>
            {status === "parsing" ? "Please wait while we parse the data" : "or click to browse · .xlsx and .xls supported"}
          </p>
        </div>
      )}

      {/* Expected format */}
      <div style={{ marginTop: 24, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Expected Column Headers</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Property Name","Developer Name","City","Property Type","Unit Type","SBUA","Carpet Area","Received Date","Sent Date","Recommendation Type","MB Research Value","Month","Year","Quarter"].map(col => (
            <span key={col} style={{ fontSize: 11, background: "#fff", border: "1px solid #E2E8F0", color: "#64748B", padding: "3px 10px", borderRadius: 6, fontFamily: "monospace" }}>{col}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
