"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Star, Sparkles, AlertCircle } from "lucide-react";
import { compressImage } from "@/lib/images/compress";

interface EventImageUploaderProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  maxImages?: number;
}

export default function EventImageUploader({
  images,
  onChange,
  maxImages = 4,
}: EventImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setUploadError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setUploading(true);
    setUploadError("");

    const uploadedUrls: string[] = [];

    try {
      for (const rawFile of files) {
        // Automatic client-side compression (resizes to max 1600px, WebP, ~150KB)
        const compressed = await compressImage(rawFile, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.82,
          maxSizeMB: 10,
        });

        const formData = new FormData();
        formData.append("file", compressed);

        const res = await fetch("/api/studio/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error(data.error || "Failed to upload image.");
        }
        uploadedUrls.push(data.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Error uploading image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            multiple={maxImages - images.length > 1}
            onChange={handleFileSelect}
            className="hidden"
            id="event-image-upload-input"
            disabled={uploading}
          />
          <label
            htmlFor="event-image-upload-input"
            className={`border-2 border-dashed border-neutral-200 hover:border-brand/40 hover:bg-purple-50/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizing & uploading image…</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-800">
                    Click to upload event photos / banner
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    PNG, JPG, WebP up to 10MB · Automatically compressed for sub-second page loads
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-brand bg-purple-50 px-2 py-0.5 rounded-md">
                  {images.length}/{maxImages} uploaded
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="relative group aspect-[16/10] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-2xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Event image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 z-10">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  Cover
                </span>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="p-1.5 rounded-lg bg-white text-neutral-800 hover:bg-neutral-100 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Set as cover image"
                  >
                    <Star className="w-3 h-3 text-amber-500" />
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
