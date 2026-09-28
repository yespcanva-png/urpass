"use client";

import { useState } from "react";
import {
  ListPlus,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import type { CustomFieldDefinition, CustomFieldType } from "@/types";
import { updateEventCustomFields } from "@/app/actions/events";

interface CustomFieldsBuilderProps {
  eventId: string;
  initialFields?: CustomFieldDefinition[];
  maxFields?: number;
  isUnlimited?: boolean;
}

const FIELD_TYPES: { type: CustomFieldType; label: string; desc: string }[] = [
  { type: "text", label: "Text", desc: "Short answer (e.g., College, Company, GitHub URL)" },
  { type: "number", label: "Number", desc: "Numeric value (e.g., Year of Study, Age)" },
  { type: "select", label: "Dropdown", desc: "Single choice from options (e.g., T-Shirt Size)" },
  { type: "checkbox", label: "Checkbox", desc: "Yes / No confirmation (e.g., Agree to Rules)" },
];

export default function CustomFieldsBuilder({
  eventId,
  initialFields = [],
  maxFields = 3,
  isUnlimited = false,
}: CustomFieldsBuilderProps) {
  const [fields, setFields] = useState<CustomFieldDefinition[]>(initialFields);
  const [initialJson, setInitialJson] = useState(JSON.stringify(initialFields));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isDirty = JSON.stringify(fields) !== initialJson;
  const canAddMore = isUnlimited || fields.length < maxFields;

  function handleAddField() {
    if (!canAddMore) return;
    const newField: CustomFieldDefinition = {
      id: `field_${Date.now()}_${fields.length + 1}`,
      label: "",
      type: "text",
      placeholder: "",
      required: false,
      options: [],
    };
    setFields([...fields, newField]);
    setError("");
  }

  function handleRemoveField(index: number) {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
  }

  function handleUpdateField(index: number, updates: Partial<CustomFieldDefinition>) {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  }

  async function handleSave() {
    setError("");

    // Validate
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label.trim()) {
        setError(`Question #${i + 1} must have a title or question label.`);
        return;
      }
      if (f.type === "select" && (!f.options || f.options.length === 0)) {
        setError(`Dropdown question "${f.label}" must have at least one option.`);
        return;
      }
    }

    setSaving(true);
    const result = await updateEventCustomFields(eventId, fields);
    setSaving(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setInitialJson(JSON.stringify(fields));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <ListPlus className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-900 leading-none">
                Custom Registration Questions
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {isUnlimited ? "Unlimited fields" : `${fields.length}/${maxFields} used`}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ask attendees custom questions when they apply (T-shirt size, organization, diet, etc.)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddField}
          disabled={!canAddMore}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand bg-brand-50 hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Question
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
            <p className="text-sm font-medium text-neutral-600">No custom questions added yet</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Only standard fields (Name, Email, Phone) will be collected during registration.
            </p>
            <button
              type="button"
              onClick={handleAddField}
              disabled={!canAddMore}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
              style={{ background: "#6D28D9" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id || idx}
                className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/30 space-y-3 transition-all focus-within:border-brand/50 focus-within:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(idx)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Label */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">
                      Question Label / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(idx, { label: e.target.value })}
                      placeholder="e.g. T-Shirt Size, College Name, LinkedIn URL"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-brand"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">Field Type</label>
                    <div className="relative">
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(idx, {
                            type: e.target.value as CustomFieldType,
                            options:
                              e.target.value === "select" && (!field.options || field.options.length === 0)
                                ? ["Option 1", "Option 2"]
                                : field.options,
                          })
                        }
                        className="w-full appearance-none text-sm bg-white border border-neutral-200 rounded-xl px-3 py-2 pr-8 outline-none focus:border-brand"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.type} value={t.type}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Dropdown Options Editor */}
                {field.type === "select" && (
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-neutral-100">
                    <label className="text-[11px] font-medium text-neutral-500 flex items-center justify-between">
                      <span>Dropdown Options (comma separated)</span>
                      <span className="text-[10px] text-neutral-400">e.g. Small, Medium, Large, XL</span>
                    </label>
                    <input
                      type="text"
                      value={(field.options ?? []).join(", ")}
                      onChange={(e) =>
                        handleUpdateField(idx, {
                          options: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Small, Medium, Large, Extra Large"
                      className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-brand focus:bg-white"
                    />
                  </div>
                )}

                {/* Placeholder & Required Toggle */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  {field.type !== "checkbox" && field.type !== "select" ? (
                    <div className="flex-1 max-w-sm">
                      <input
                        type="text"
                        value={field.placeholder ?? ""}
                        onChange={(e) => handleUpdateField(idx, { placeholder: e.target.value })}
                        placeholder="Optional placeholder hint"
                        className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand"
                      />
                    </div>
                  ) : <div />}

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleUpdateField(idx, { required: e.target.checked })}
                      className="w-4 h-4 rounded text-brand border-neutral-300 focus:ring-brand"
                    />
                    <span className="text-xs font-medium text-neutral-700">Required answer</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200/80 rounded-xl px-4 py-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Registration questions saved successfully.</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            {isDirty ? (
              <span className="text-amber-600 font-medium">Unsaved changes in registration questions</span>
            ) : (
              <span>All questions up to date</span>
            )}
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
            style={{ background: "#6D28D9" }}
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Registration Fields"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
