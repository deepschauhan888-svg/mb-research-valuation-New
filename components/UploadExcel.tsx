"use client";
import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react";
import { parseExcel } from "@/lib/excelParser";
import { Valuation } from "@/types/valuation";
interface Props { onUploaded: (data: Valuation[]) => void; }
export default function UploadExcel({ onUploaded }: Props) {
  const [status, setStatus] = useState<"idle"|"parsing"|"success"|"error">("idle");
  const [message, setMessage] = useState(""); const [count, setCount] = useState(0); const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) { setStatus("error"); setMessage("Please upload a valid .xlsx or .xls file."); return; }
    setStatus("parsing"); setMessage("Parsing your file...");
    try { const buf = await file.arrayBuffer(); const rows = parseExcel(buf);
      if (rows.length === 0) { setStatus("error"); setMessage("No valid records found. Check column headers."); return; }
      setCount(rows.length); setStatus("success"); setMessage(`Successfully parsed ${rows.length} record${rows.length!==1?"s":""}.`); onUploaded(rows);
    } catch (e) { setStatus("error"); setMessage("Failed to parse file. Check format and try again."); console.error(e); }
  };
  const handleFile = (files: FileList | null) => { if (files?.[0]) processFile(files[0]); };
  const reset = () => { setStatus("idle"); setMessage(""); setCount(0); if (inputRef.current) inputRef.current.value = ""; };
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="flex items-center gap-2 mb-1"><FileSpreadsheet size={16} className="text-[#0F172A]"/><h3 className="text-sm font-semibold text-[#0F172A]">Upload Valuation Data</h3></div>
      <p className="text-xs text-[#9CA3AF] mb-5">Upload an Excel file (.xlsx / .xls) with valuation assignments</p>
      {status!=="idle"&&status!=="parsing"?(
        <div className={`rounded-xl border p-5 flex items-start gap-3 ${status==="success"?"border-emerald-200 bg-emerald-50":"border-red-200 bg-red-50"}`}>
          {status==="success"?<CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5"/>:<AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5"/>}
          <div className="flex-1"><p className={`text-sm font-semibold ${status==="success"?"text-emerald-800":"text-red-800"}`}>{status==="success"?"Upload Successful":"Upload Failed"}</p><p className={`text-xs mt-0.5 ${status==="success"?"text-emerald-600":"text-red-600"}`}>{message}</p>{status==="success"&&count>0&&<p className="text-xs text-emerald-600 mt-1">Charts and KPIs updated.</p>}</div>
          <button onClick={reset} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
        </div>
      ):(
        <div className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${dragging?"border-[#0F172A] bg-[#F8F9FB]":"border-[#E5E7EB] hover:border-[#9CA3AF]"} ${status==="parsing"?"opacity-60 pointer-events-none":"cursor-pointer"}`}
          onClick={()=>inputRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files);}}>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e=>handleFile(e.target.files)}/>
          <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center mx-auto mb-4">{status==="parsing"?<div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"/>:<Upload size={20} className="text-[#6B7280]"/>}</div>
          <p className="text-sm font-semibold text-[#0F172A] mb-1">{status==="parsing"?"Processing...":"Drop your Excel file here"}</p>
          <p className="text-xs text-[#9CA3AF]">{status==="parsing"?"Please wait...":"or click to browse · .xlsx and .xls supported"}</p>
        </div>
      )}
      <div className="mt-5 p-4 bg-[#F8F9FB] rounded-lg border border-[#F3F4F6]">
        <p className="text-xs font-semibold text-[#374151] mb-2">Expected Column Headers</p>
        <div className="flex flex-wrap gap-1.5">{["Property Name","Developer Name","City","Property Type","Unit Type","SBUA","Carpet Area","Received Date","Sent Date","Recommendation Type","MB Research Value","Month","Year","Quarter"].map(col=><span key={col} className="text-xs bg-white border border-[#E5E7EB] text-[#6B7280] px-2 py-0.5 rounded">{col}</span>)}</div>
      </div>
    </div>
  );
}
