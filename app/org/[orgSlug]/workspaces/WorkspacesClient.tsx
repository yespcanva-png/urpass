"use client";

import { useState } from "react";
import { Plus, Briefcase, Trash2, CheckCircle2, Loader2, X } from "lucide-react";
import { createWorkspace, deleteWorkspace } from "@/app/actions/workspaces";
import type { Workspace, OrgRole } from "@/types";

interface Props {
  orgId: string;
  orgSlug: string;
  workspaces: Workspace[];
  userRole: OrgRole;
}

export default function WorkspacesClient({ orgId, orgSlug, workspaces: initialWorkspaces, userRole }: Props) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6D28D9");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManage = userRole === "owner" || userRole === "admin";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await createWorkspace(orgId, {
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      is_default: false,
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.workspace) {
      setWorkspaces((prev) => [...prev, res.workspace!]);
    }
    setSuccess("Workspace created successfully.");
    setName("");
    setDescription("");
    setColor("#6D28D9");
    setModalOpen(false);
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  }

  async function handleDelete(wsId: string) {
    if (!confirm("Are you sure you want to delete this workspace?")) return;
    setDeletingId(wsId);
    setError("");
    const res = await deleteWorkspace(wsId, orgId);
    if (res.error) {
      setError(res.error);
      setDeletingId(null);
      return;
    }
    setWorkspaces((prev) => prev.filter((w) => w.id !== wsId));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Workspaces &amp; Departments</h2>
          <p className="text-xs text-neutral-500">
            Organize events, permissions, and staff across distinct campus teams or business divisions.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => { setModalOpen(true); setError(""); }}
            className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto shadow-sm"
            style={{ background: "#6D28D9" }}
          >
            <Plus className="w-4 h-4" />
            Create Workspace
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {success}
        </div>
      )}

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: ws.color || "#6D28D9" }}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{ws.name}</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">/{ws.slug}</p>
                  </div>
                </div>

                {ws.is_default ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand border border-brand-100">
                    <CheckCircle2 className="w-3 h-3" />
                    Default
                  </span>
                ) : (
                  canManage && (
                    <button
                      onClick={() => handleDelete(ws.id)}
                      disabled={deletingId === ws.id}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                      title="Delete Workspace"
                    >
                      {deletingId === ws.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )
                )}
              </div>

              <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                {ws.description || "General department events and team collaboration workspace."}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>Department Workspace</span>
              <span className="text-[11px] font-medium text-neutral-600">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">New Workspace / Department</h3>
                <p className="text-xs text-neutral-500">Group events and entry gates by division.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cultural Committee, CSE Dept, Marketing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Purpose of this workspace..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-neutral-200 outline-none focus:border-brand resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  style={{ background: "#6D28D9" }}
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
