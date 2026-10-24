"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { withdrawRegistrationAction } from "@/app/actions/attendees";

function CancelRegistrationContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const attendeeId = searchParams.get("attendeeId");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!eventId || !attendeeId) {
    return (
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/90 p-8 text-center shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Invalid Withdrawal Link</h1>
        <p className="text-xs text-neutral-500 leading-relaxed mb-6">
          A secure verification token or registration identifier is required to cancel or withdraw an UrPass booking.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  async function handleWithdraw() {
    setLoading(true);
    setError("");

    const res = await withdrawRegistrationAction(eventId!, attendeeId!, {
      cancellationToken: token || undefined,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/90 p-8 text-center shadow-lg">
      {success ? (
        <>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2.5">
            Registration Cancelled
          </span>
          <h1 className="text-xl font-extrabold text-neutral-900 mb-2">Booking Withdrawn</h1>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6">
            Your registration has been successfully cancelled and any entry passes have been voided. Your place has been released back to the event capacity or waitlist queue.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            Done
          </Link>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-2.5">
            Self-Service Withdrawal
          </span>
          <h1 className="text-xl font-extrabold text-neutral-900 mb-2">Withdraw Registration?</h1>
          <p className="text-xs text-neutral-600 leading-relaxed mb-5">
            Are you sure you want to withdraw your registration for this event? Your digital QR pass will be immediately invalidated and cannot be restored.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-left font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleWithdraw}
              className="w-full py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Withdrawal"}
            </button>
            <Link
              href="/"
              className="w-full py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Nevermind, Keep My Registration
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function CancelRegistrationPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-[family-name:var(--font-geist)]"
      style={{
        background: "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)",
      }}
    >
      <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin text-neutral-400" />}>
        <CancelRegistrationContent />
      </Suspense>
    </div>
  );
}
