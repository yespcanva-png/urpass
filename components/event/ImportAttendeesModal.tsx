"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

type ImportColumn = "ignore" | "name" | "email" | "phone" | "pass_type" | "ticket_type" | "payment_status";
type Mapping = Record<string, ImportColumn>;

interface PreviewRow {
  rowNumber: number;
  name: string;
  email: string;
  phone: string | null;
  passType: string;
  ticketTypeName: string | null;
  errors: string[];
}

interface PreviewResponse {
  headers: string[];
  mapping: Mapping;
  rows: PreviewRow[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    potentiallyBillable: number;
  };
}

interface ImportReport {
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    imported: number;
    failed: number;
  };
  failed: Array<{ rowNumber: number; email: string; errors: string[] }>;
  errorCsv: string;
}

interface Props {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const columnOptions: Array<{ value: ImportColumn; label: string }> = [
  { value: "ignore", label: "Ignore / custom field" },
  { value: "name", label: "Attendee name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "pass_type", label: "Pass type" },
  { value: "ticket_type", label: "Ticket type" },
  { value: "payment_status", label: "Payment status" },
];

const inputCls =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-colors focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

export default function ImportAttendeesModal({ eventId, onClose, onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [mapping, setMapping] = useState<Mapping>({});
  const [report, setReport] = useState<ImportReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `import_${Date.now()}`
  );

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canPreview = csvText.trim().length > 0;
  const validCount = preview?.summary.valid ?? 0;
  const hasBlockingErrors = validCount === 0;
  const previewRows = useMemo(() => preview?.rows.slice(0, 12) ?? [], [preview]);

  function handleFile(file: File) {
    setError("");
    setReport(null);
    setPreview(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(String(ev.target?.result || ""));
    reader.onerror = () => setError("Could not read the CSV file.");
    reader.readAsText(file);
  }

  async function runPreview(nextMapping?: Mapping) {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch(`/api/events/${eventId}/attendee-import/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, mapping: nextMapping || mapping }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Preview failed.");
      setPreview(json);
      setMapping(json.mapping || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmImport() {
    if (!preview || hasBlockingErrors) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${eventId}/attendee-import/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, mapping, idempotencyKey }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed.");
      setReport(json);
      if (json.summary?.imported > 0) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  function downloadErrors() {
    if (!report?.errorCsv) return;
    const blob = new Blob([report.errorCsv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urpass-import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              <FileSpreadsheet className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Import attendees from CSV</h2>
              <p className="text-xs text-slate-500">Preview, validate, import, and generate QR passes.</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[320px_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-r">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-white px-4 py-8 text-center hover:border-slate-300 hover:bg-slate-50"
            >
              <UploadCloud className="h-6 w-6 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">{fileName || "Choose CSV file"}</span>
              <span className="text-[11px] text-slate-400">Headers required in first row</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-[11px] leading-5 text-slate-500">
              <p className="font-bold uppercase tracking-wide text-slate-600">Recommended columns</p>
              <code className="mt-2 block rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono">
                name, email, phone, pass_type, ticket_type
              </code>
            </div>

            <button
              onClick={() => runPreview()}
              disabled={!canPreview || loading}
              className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-900 bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Preview CSV
            </button>
          </aside>

          <main className="min-w-0 p-4">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {report ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">Import complete</h3>
                      <p className="mt-1 text-xs text-emerald-800">
                        Imported {report.summary.imported} attendee{report.summary.imported === 1 ? "" : "s"} and generated scanner-compatible QR passes.
                      </p>
                    </div>
                  </div>
                </div>
                <SummaryGrid summary={report.summary} />
                {report.failed.length > 0 && (
                  <button onClick={downloadErrors} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    Download error report
                  </button>
                )}
              </div>
            ) : preview ? (
              <div className="space-y-4">
                <SummaryGrid summary={{ ...preview.summary, imported: 0, failed: preview.summary.invalid }} />

                <div className="rounded-lg border border-slate-200">
                  <div className="border-b border-slate-200 px-3 py-2">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Column mapping</h3>
                  </div>
                  <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                    {preview.headers.map((header) => (
                      <label key={header} className="space-y-1">
                        <span className="block truncate text-[11px] font-semibold text-slate-600">{header}</span>
                        <select
                          className={inputCls}
                          value={mapping[header] || "ignore"}
                          onChange={(e) => setMapping((prev) => ({ ...prev, [header]: e.target.value as ImportColumn }))}
                        >
                          {columnOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 px-3 py-2">
                    <button onClick={() => runPreview(mapping)} disabled={loading} className="text-xs font-semibold text-slate-700 hover:text-slate-950">
                      Revalidate mapping
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="border-b border-slate-200 px-3 py-2">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Preview</h3>
                  </div>
                  <div className="max-h-72 overflow-auto">
                    <table className="w-full min-w-[760px] text-left text-xs">
                      <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2">Row</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Pass</th>
                          <th className="px-3 py-2">Ticket</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.map((row) => (
                          <tr key={`${row.rowNumber}-${row.email}`} className={row.errors.length ? "bg-rose-50/50" : "bg-white"}>
                            <td className="px-3 py-2 text-slate-500">{row.rowNumber}</td>
                            <td className="px-3 py-2 font-semibold text-slate-800">{row.name || "-"}</td>
                            <td className="px-3 py-2 text-slate-600">{row.email || "-"}</td>
                            <td className="px-3 py-2 text-slate-600">{row.passType}</td>
                            <td className="px-3 py-2 text-slate-600">{row.ticketTypeName || "Default"}</td>
                            <td className="px-3 py-2">
                              {row.errors.length ? (
                                <span className="text-rose-700">{row.errors.join("; ")}</span>
                              ) : (
                                <span className="font-semibold text-emerald-700">Ready</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Invalid and duplicate rows will not be imported. Paid ticket types are blocked so CSV cannot bypass payment verification.
                  </p>
                  <button
                    onClick={confirmImport}
                    disabled={loading || hasBlockingErrors}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-900 bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                  >
                    {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Import {validCount} attendee{validCount === 1 ? "" : "s"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                <FileSpreadsheet className="h-9 w-9 text-slate-400" />
                <h3 className="mt-3 text-sm font-bold text-slate-900">Upload a CSV to preview attendees</h3>
                <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                  UrPass validates missing fields, duplicates, ticket types and paid-ticket restrictions before importing. QR passes are generated after confirmation.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
}

function SummaryGrid({ summary }: { summary: Record<string, number> }) {
  const items = [
    ["Total", summary.total],
    ["Valid", summary.valid],
    ["Invalid", summary.invalid],
    ["Duplicates", summary.duplicates],
    ["Imported", summary.imported],
    ["Failed", summary.failed],
  ].filter(([, value]) => typeof value === "number");

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([label, value]) => (
        <div key={String(label)} className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}
