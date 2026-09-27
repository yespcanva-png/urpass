"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building,
  Plus,
  Search,
  Sparkles,
  CalendarDays,
  Users,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Sliders,
  X,
} from "lucide-react";
import type { CampusDepartment, Institution } from "@/types/campus";
import { createCampusDepartment } from "@/app/actions/campus/departments";

interface Props {
  institution: Institution;
  departments: CampusDepartment[];
}

export default function DepartmentListView({ institution, departments }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    color: "#6D28D9",
  });

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await createCampusDepartment(institution.id, {
      name: formData.name,
      code: formData.code.toUpperCase().trim(),
      description: formData.description || undefined,
      color: formData.color,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }

    setShowModal(false);
    setFormData({ name: "", code: "", description: "", color: "#6D28D9" });
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 lg:p-8 border border-neutral-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Academic Departments
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-brand border border-purple-200">
              {institution.institution_code}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Manage academic faculties, departmental clubs, events, and student participation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow-md shadow-brand/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-neutral-200/80 shadow-sm">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by department name or code (e.g. CSE, Mechanical, AI)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none text-neutral-900 placeholder:text-neutral-400 bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-neutral-400 hover:text-neutral-600">
            Clear
          </button>
        )}
      </div>

      {/* ── Departments Grid ────────────────────────────────────────────────── */}
      {filteredDepts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200">
          <Building className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900">No departments found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {search
              ? "No departments match your search term. Try a different query."
              : "Get started by adding academic departments (e.g. Computer Science, Mechanical, ECE)."}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Department
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: dept.color || "#6D28D9" }}
                    >
                      {dept.code.slice(0, 3)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 group-hover:text-brand transition-colors leading-snug">
                        {dept.name}
                      </h2>
                      <span className="text-[11px] font-mono font-bold text-neutral-400">
                        {dept.code}
                      </span>
                    </div>
                  </div>
                </div>

                {dept.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                    {dept.description}
                  </p>
                )}

                {/* Micro KPIs */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 mb-5">
                  <div className="text-center">
                    <p className="text-base font-black text-neutral-900 tabular-nums">
                      {dept.events_count ?? 0}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-medium">Events</span>
                  </div>
                  <div className="text-center border-x border-neutral-100">
                    <p className="text-base font-black text-neutral-900 tabular-nums">
                      {dept.clubs_count ?? 0}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-medium">Clubs</span>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-neutral-900 tabular-nums">
                      {dept.students_count ?? 0}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-medium">Students</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/campus/departments/${dept.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-50 hover:bg-brand hover:text-white text-neutral-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:bg-purple-50 group-hover:text-brand"
              >
                <span>Department Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Department Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-brand flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Add Academic Department</h3>
                <p className="text-xs text-neutral-400">
                  Register a department under {institution.name}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science and Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().trim() })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono uppercase focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono uppercase text-neutral-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Department focus, specialization, or symposium theme..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
                >
                  {loading ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
