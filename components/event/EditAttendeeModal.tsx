"use client";

import { useState } from "react";
import { X, Loader2, Save, User, Mail, Phone, AlertCircle, FileText } from "lucide-react";
import type { CustomFieldDefinition } from "@/types";
import { updateAttendeeDetails } from "@/app/actions/attendees";

interface EditAttendeeModalProps {
  eventId: string;
  attendee: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    custom_responses?: Record<string, unknown> | null;
    application_status?: string;
    pass_status?: string;
  };
  customFields?: CustomFieldDefinition[];
  onClose: () => void;
  onSuccess: (updated: {
    name: string;
    email: string;
    phone: string | null;
    custom_responses: Record<string, unknown>;
  }) => void;
}

export default function EditAttendeeModal({
  eventId,
  attendee,
  customFields = [],
  onClose,
  onSuccess,
}: EditAttendeeModalProps) {
  const [name, setName] = useState(attendee.name || "");
  const [email, setEmail] = useState(attendee.email || "");
  const [phone, setPhone] = useState(attendee.phone || "");
  const [customResponses, setCustomResponses] = useState<Record<string, any>>(
    (attendee.custom_responses as Record<string, any>) || {}
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Attendee name cannot be empty.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setSaving(true);
    const result = await updateAttendeeDetails(eventId, attendee.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      custom_responses: customResponses,
    });
    setSaving(false);

    if (result?.error) {
      setError(result.error);
    } else {
      onSuccess({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        custom_responses: customResponses,
      });
      onClose();
    }
  }

  // System keys that are not registration questions
  const IGNORED_KEYS = new Set([
    "is_single_group_qr",
    "credential_type",
    "credentialType",
    "scan_count",
    "scan_history",
    "group_members",
    "guest_count",
    "bulk_quantity",
    "custom_ticket_id",
    "parent_attendee_id",
    "primary_buyer_name",
    "primary_buyer_email",
    "guest_index",
  ]);

  const definedFieldIds = new Set(customFields.map((f) => f.id));
  const historicalKeys = Object.keys(customResponses).filter(
    (k) => !definedFieldIds.has(k) && !IGNORED_KEYS.has(k)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-neutral-50/50">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Edit Attendee Details</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Update guest contact info or fix registration mistakes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200/80">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full pl-10 pr-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full pl-10 pr-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600"
                />
              </div>
            </div>
          </div>

          {/* Active Custom Fields */}
          {customFields.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Custom Registration Responses
              </h4>

              {customFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <select
                      value={customResponses[field.id] || ""}
                      onChange={(e) =>
                        setCustomResponses({ ...customResponses, [field.id]: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600"
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 cursor-pointer py-1 text-xs text-neutral-700 font-medium">
                      <input
                        type="checkbox"
                        checked={Boolean(customResponses[field.id])}
                        onChange={(e) =>
                          setCustomResponses({ ...customResponses, [field.id]: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                      />
                      <span>Confirmed / Agreed</span>
                    </label>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={customResponses[field.id] || ""}
                      onChange={(e) =>
                        setCustomResponses({ ...customResponses, [field.id]: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600 resize-none"
                    />
                  ) : field.type === "file_upload" ? (
                    <div className="text-xs p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 flex items-center justify-between">
                      <span>
                        {typeof customResponses[field.id] === "object"
                          ? (customResponses[field.id] as any).fileName || "Document attached"
                          : "Document attached"}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Protected</span>
                    </div>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={customResponses[field.id] || ""}
                      onChange={(e) =>
                        setCustomResponses({ ...customResponses, [field.id]: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-violet-600"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Historical Custom Responses (Preservation) */}
          {historicalKeys.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Historical Form Responses
                </h4>
              </div>

              {historicalKeys.map((key) => (
                <div key={key} className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-600 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    value={
                      typeof customResponses[key] === "object"
                        ? JSON.stringify(customResponses[key])
                        : String(customResponses[key] ?? "")
                    }
                    onChange={(e) =>
                      setCustomResponses({ ...customResponses, [key]: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50/70 border border-neutral-200 rounded-lg outline-none focus:bg-white focus:border-violet-600 text-neutral-700"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Footer controls */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 disabled:opacity-50 transition-opacity"
              style={{ background: "#6D28D9" }}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
