"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Search,
  Building,
  CalendarDays,
  Users,
  ChevronRight,
  Filter,
  X,
  Layers,
} from "lucide-react";
import type { CampusClub, CampusClubCategory, CampusDepartment, Institution } from "@/types/campus";
import { createCampusClub } from "@/app/actions/campus/clubs";

interface Props {
  institution: Institution;
  clubs: CampusClub[];
  departments: CampusDepartment[];
}

const CATEGORY_LABELS: Record<CampusClubCategory, string> = {
  department_club: "Department Club",
  student_chapter: "Student Chapter",
  cell: "Campus Cell",
  committee: "Committee",
  society: "Society",
};

export default function ClubListView({ institution, clubs, departments }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    category: "department_club" as CampusClubCategory,
    description: "",
    color: "#8B5CF6",
  });

  const filteredClubs = clubs.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchesDept =
      selectedDept === "all"
        ? true
        : selectedDept === "institution"
        ? !c.department_id
        : c.department_id === selectedDept;

    return matchesSearch && matchesCategory && matchesDept;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await createCampusClub(institution.id, {
      name: formData.name,
      department_id: formData.department_id ? formData.department_id : null,
      category: formData.category,
      description: formData.description || undefined,
      color: formData.color,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }

    setShowModal(false);
    setFormData({
      name: "",
      department_id: "",
      category: "department_club",
      description: "",
      color: "#8B5CF6",
    });
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 lg:p-8 border border-neutral-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Clubs, Cells & Committees
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-brand border border-purple-200">
              {institution.institution_code}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Student societies, departmental chapters, placement cells, and activity committees.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow-md shadow-brand/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Club / Cell
        </button>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/80 shadow-sm">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search clubs, cells, IEEE chapters..."
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

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-neutral-200/80 shadow-sm">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-xs font-bold text-neutral-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-bold text-neutral-900 bg-transparent outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="department_club">Department Clubs</option>
            <option value="student_chapter">Student Chapters</option>
            <option value="cell">Cells (Placement, etc.)</option>
            <option value="committee">Committees</option>
            <option value="society">Societies</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-neutral-200/80 shadow-sm">
          <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-xs font-bold text-neutral-500">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold text-neutral-900 bg-transparent outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">All Units</option>
            <option value="institution">Institution-Level (Campus Wide)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Clubs Grid ──────────────────────────────────────────────────────── */}
      {filteredClubs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200">
          <Sparkles className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900">No clubs or cells found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {search || selectedCategory !== "all" || selectedDept !== "all"
              ? "No clubs match the selected filters. Try changing or clearing your filters."
              : "Register student clubs, symposium committees, placement cells, or IEEE chapters."}
          </p>
          {!search && selectedCategory === "all" && selectedDept === "all" && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Club
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: club.color || "#8B5CF6" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 group-hover:text-brand transition-colors leading-snug">
                        {club.name}
                      </h2>
                      <span className="text-[11px] font-bold text-purple-600">
                        {CATEGORY_LABELS[club.category]}
                      </span>
                    </div>
                  </div>
                </div>

                {club.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                    {club.description}
                  </p>
                )}

                {/* Association info */}
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 mb-5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600 truncate">
                    <Building className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                    <span className="font-semibold truncate">
                      {club.department ? club.department.name : "Institution-Level Unit"}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 shrink-0 ml-2">
                    {club.events_count ?? 0} events
                  </span>
                </div>
              </div>

              <Link
                href={`/dashboard/campus/clubs/${club.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-50 hover:bg-brand hover:text-white text-neutral-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:bg-purple-50 group-hover:text-brand"
              >
                <span>Club Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Club Modal ───────────────────────────────────────────────── */}
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
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Add Club or Campus Unit</h3>
                <p className="text-xs text-neutral-400">
                  Register a club, chapter or cell under {institution.name}
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
                  Club / Unit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Robotics Club, Placement Cell"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as CampusClubCategory })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                  >
                    <option value="department_club">Department Club</option>
                    <option value="student_chapter">Student Chapter (IEEE, ACM)</option>
                    <option value="cell">Cell (Placement / Alumni)</option>
                    <option value="committee">Committee (Sports / Cultural)</option>
                    <option value="society">Society</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                  >
                    <option value="">Institution-Level Unit</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Purpose, target student community, and regular activities..."
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
                  {loading ? "Adding..." : "Add Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
