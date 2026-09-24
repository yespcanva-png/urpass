"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  onAddImage: (url: string, type: "image" | "background") => void;
}

export default function AssetUploader({ onAddImage }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [insertTarget, setInsertTarget] = useState<"image" | "background">("image");

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image");
      }

      setUploadSuccess(true);
      onAddImage(data.url, insertTarget);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
      setUploadError("Please provide a valid https:// URL");
      return;
    }
    setUploadError(null);
    onAddImage(urlInput.trim(), insertTarget);
    setUrlInput("");
  }

  return (
    <div className="space-y-4">
      {/* Target Selector: Canvas Element or Pass Background */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
        <button
          type="button"
          onClick={() => setInsertTarget("image")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            insertTarget === "image"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Add as Logo / Artwork
        </button>
        <button
          type="button"
          onClick={() => setInsertTarget("background")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            insertTarget === "background"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Set as Background
        </button>
      </div>

      {/* Supabase Storage Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isUploading
            ? "border-brand bg-brand/5 pointer-events-none opacity-80"
            : "border-neutral-200 hover:border-brand hover:bg-neutral-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileSelected}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            ) : uploadSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-neutral-900">
              {isUploading ? "Uploading to Storage..." : "Click or drag image to upload"}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              PNG, JPG, WebP, SVG (Max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Status Alerts */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Image uploaded and added to ticket design.</span>
        </div>
      )}

      {/* Or Paste Direct Image URL */}
      <div className="pt-2 border-t border-neutral-100">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
          Or Enter Public Image CDN URL
        </span>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shrink-0"
          >
            Insert
          </button>
        </form>
      </div>
    </div>
  );
}
