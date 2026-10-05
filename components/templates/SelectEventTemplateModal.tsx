"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";
import {
  Calendar,
  MapPin,
  Search,
  X,
  ArrowRight,
  Plus,
  Loader2,
  Sparkles,
  Ticket,
  CheckCircle2,
  Building2,
  LogIn,
} from "lucide-react";

interface EventSummary {
  id: string;
  name: string;
  event_date: string;
  start_time?: string | null;
  venue?: string | null;
  status?: string | null;
  custom_pass_design?: unknown;
}

interface SelectEventTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: StudioTemplateDefinition | null;
}

export default function SelectEventTemplateModal({
  isOpen,
  onClose,
  template,
}: SelectEventTemplateModalProps) {
  const router = useRouter();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectingEventId, setSelectingEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function loadUserEvents() {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsAuthenticated(true);
        }

        const { data: userEvents, error } = await supabase
          .from("events")
          .select("id, name, event_date, start_time, venue, status, custom_pass_design")
          .eq("organizer_id", user.id)
          .order("event_date", { ascending: false });

        if (error) {
          console.error("Failed to load user events:", error.message);
        }

        if (isMounted) {
          setEvents(userEvents || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching events for template selection:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadUserEvents();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function handleSelectEvent(eventId: string) {
    setSelectingEventId(eventId);
    setTimeout(() => {
      router.push(`/studio/${eventId}?template=${encodeURIComponent(template!.id)}`);
      onClose();
    }, 200);
  }

  function handleCreateNewEvent() {
    router.push(`/studio?template=${encodeURIComponent(template!.id)}`);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select Event for Template"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-gradient-to-br from-neutral-50 via-white to-neutral-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Ticket className="w-5 h-5 text-brand-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-neutral-900 leading-tight">
                  Choose Event for Template
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-neutral-500">
                    Applying: <span className="font-medium text-neutral-800">{template.name}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand">
                    {template.category || "Pass"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          {isAuthenticated && events.length > 0 && (
            <div className="relative mt-4">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search your events by name or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 divide-y divide-neutral-100">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">Loading your events...</p>
            </div>
          ) : isAuthenticated === false ? (
            /* Unauthenticated state */
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 mx-auto flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Sign in to select an event</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                  Log in to apply this template directly to your event pass designs.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href={`/login?returnTo=${encodeURIComponent(`/studio?template=${template.id}`)}`}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors text-center"
                >
                  Log In to Continue
                </Link>
                <button
                  type="button"
                  onClick={handleCreateNewEvent}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-colors"
                >
                  Try Template in Studio
                </button>
              </div>
            </div>
          ) : events.length === 0 ? (
            /* No events created yet */
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">No events found</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                  You haven&apos;t created any events yet. Start by customizing this template in Ticket Studio!
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateNewEvent}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Open Template in Studio</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Filter produced 0 matches */
            <div className="py-8 text-center text-xs text-neutral-500">
              No events match &quot;{searchQuery}&quot;.
            </div>
          ) : (
            /* List of existing user events */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 px-1">
                <span>Select an existing event:</span>
                <span>{filteredEvents.length} available</span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {filteredEvents.map((evt) => {
                  const isSelected = selectingEventId === evt.id;
                  const formattedDate = evt.event_date
                    ? new Date(evt.event_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date TBD";

                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => handleSelectEvent(evt.id)}
                      disabled={isSelected}
                      className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50/70 active:scale-[0.99] transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-950">
                            {evt.name}
                          </h4>
                          {evt.status && (
                            <span
                              className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                evt.status === "active" || evt.status === "published"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {evt.status}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500 truncate">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                            {formattedDate}
                          </span>
                          {evt.venue && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="truncate">{evt.venue}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-neutral-700 group-hover:text-neutral-900 bg-white group-hover:bg-neutral-900 group-hover:text-white px-3 py-1.5 rounded-lg border border-neutral-200 group-hover:border-neutral-900 transition-all shadow-2xs">
                        {isSelected ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <span>Open Studio</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleCreateNewEvent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-neutral-600 hover:text-neutral-900 font-medium py-1.5 px-2 rounded-lg hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-500" />
            <span>Customize as default brand pass</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-100 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
