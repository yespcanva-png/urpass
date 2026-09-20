"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Users,
  CreditCard,
  CheckCircle2,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  getOrganizerNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type InAppNotification,
} from "@/app/actions/in-app-notifications";

function getRelativeTime(dateString: string) {
  const diffSec = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function NotificationIcon({ type }: { type: InAppNotification["type"] }) {
  switch (type) {
    case "registration":
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
          <Users className="w-3.5 h-3.5" />
        </div>
      );
    case "milestone":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      );
    case "checkin":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      );
    case "payment":
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
          <CreditCard className="w-3.5 h-3.5" />
        </div>
      );
    case "feedback":
      return (
        <div className="w-7 h-7 rounded-lg bg-yellow-500/15 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/20">
          <Star className="w-3.5 h-3.5" />
        </div>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-lg bg-neutral-500/15 text-neutral-400 flex items-center justify-center shrink-0 border border-neutral-500/20">
          <Bell className="w-3.5 h-3.5" />
        </div>
      );
  }
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await getOrganizerNotifications(15);
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchNotifications();
    }, 0);
    const interval = setInterval(() => {
      void fetchNotifications();
    }, 45000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));
    }
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    });
  };

  const handleItemClick = (n: InAppNotification) => {
    if (!n.is_read) {
      startTransition(async () => {
        await markNotificationAsRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-violet-600 text-[10px] font-extrabold text-white ring-2 ring-neutral-900 shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-[11px] font-medium text-neutral-400 hover:text-violet-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/60 scrollbar-thin">
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center text-neutral-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-2 text-neutral-500">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-neutral-300 mb-0.5">All caught up</p>
                <p className="text-[11px] text-neutral-500">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Content = (
                  <div
                    onClick={() => handleItemClick(n)}
                    className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left ${
                      !n.is_read
                        ? "bg-neutral-800/40 hover:bg-neutral-800/70"
                        : "hover:bg-neutral-800/25"
                    }`}
                  >
                    <NotificationIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-semibold text-neutral-200 truncate">{n.title}</p>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {getRelativeTime(n.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-snug line-clamp-2">
                        {n.message}
                      </p>
                      {n.link && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400 hover:underline mt-1.5">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                );

                return n.link ? (
                  <Link key={n.id} href={n.link} className="block">
                    {Content}
                  </Link>
                ) : (
                  <div key={n.id}>{Content}</div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-neutral-800 bg-neutral-950/80 text-center">
            <Link
              href="/dashboard/events"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-neutral-400 hover:text-white transition-colors"
            >
              View all events &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
