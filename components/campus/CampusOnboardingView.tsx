"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { createInstitution } from "@/app/actions/campus/institution";
import { getCurrentAcademicYear, getAcademicYearOptions } from "@/lib/campus/academic-year";

export default function CampusOnboardingView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    institution_code: "",
    website: "",
    email_domain: "",
    address: "",
    current_academic_year: getCurrentAcademicYear(),
    require_event_approval: true,
  });

  const academicYearOptions = getAcademicYearOptions();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await createInstitution(formData);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to set up campus institution");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#13111c] via-[#1f1933] to-[#0e0c16] rounded-3xl p-8 md:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-bold mb-4 backdrop-blur-md border border-white/10">
            <GraduationCap className="w-3.5 h-3.5" />
            URPASS Campus Tier
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Centralized Event Management for Colleges & Universities
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
            Organize departments, manage student clubs, enforce event approvals, track multi-gate roll-number check-ins, and view real-time institutional attendance analytics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Departmental Hierarchy</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Event Approval Workflow</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Student Roll # Directories</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Setup Form ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Set Up Your Institution</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Provide your institution details to configure your academic organizational layer.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Institution Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ABC College of Engineering"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Institution Code * (Unique Abbreviation)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ABCEC"
                value={formData.institution_code}
                onChange={(e) =>
                  setFormData({ ...formData, institution_code: e.target.value.toUpperCase().trim() })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-mono text-neutral-900 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Email Domain (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. college.edu or abcec.ac.in"
                value={formData.email_domain}
                onChange={(e) => setFormData({ ...formData, email_domain: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Current Academic Year *
              </label>
              <select
                value={formData.current_academic_year}
                onChange={(e) => setFormData({ ...formData, current_academic_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm text-neutral-900"
              >
                {academicYearOptions.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Website URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://www.college.edu"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Campus Address (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Campus address, city, state, pin"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm text-neutral-900"
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <input
              type="checkbox"
              id="require_approval"
              checked={formData.require_event_approval}
              onChange={(e) => setFormData({ ...formData, require_event_approval: e.target.checked })}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
            <label htmlFor="require_approval" className="text-xs text-neutral-700 cursor-pointer">
              <span className="font-bold block">Require Event Approval Workflow</span>
              <span>Events created by club organizers must be approved by institution or department admins before publishing.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-2xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2"
          >
            {loading ? "Configuring Campus..." : "Activate URPASS Campus"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
