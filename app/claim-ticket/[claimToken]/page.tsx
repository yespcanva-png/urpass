"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import {
  getClaimTicketDetailsAction,
  claimTicketAction,
} from "@/app/actions/ticket-distribution";

export default function ClaimTicketPage() {
  const params = useParams<{ claimToken: string }>();
  const claimToken = params.claimToken;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketDetails, setTicketDetails] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customResponses, setCustomResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [claimResult, setClaimResult] = useState<any>(null);

  useEffect(() => {
    async function loadDetails() {
      if (!claimToken) return;
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await getClaimTicketDetailsAction(claimToken);
        if (!res.success || !res.details) {
          setErrorMsg(res.message || "Invalid or expired ticket invitation.");
        } else {
          setTicketDetails(res.details);
          if (res.details.recipientName) setName(res.details.recipientName);
          if (res.details.recipientEmail) setEmail(res.details.recipientEmail);
          if (res.details.recipientPhone) setPhone(res.details.recipientPhone);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load invitation.");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [claimToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimToken) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await claimTicketAction({
        claimToken,
        recipientName: name.trim(),
        recipientEmail: email.trim(),
        recipientPhone: phone.trim() || undefined,
        customResponses,
      });

      if (!res.success) {
        setErrorMsg(res.message || res.error || "Failed to claim ticket.");
      } else {
        setClaimResult(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-10 flex flex-col items-center gap-3 max-w-sm w-full text-center shadow-sm">
          <Loader2 className="w-7 h-7 animate-spin text-violet-600" />
          <p className="text-sm font-semibold text-neutral-800">Verifying ticket invitation…</p>
        </div>
      </div>
    );
  }

  // ── Success View ──
  if (claimResult && claimResult.success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-md w-full p-8 shadow-xl text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Ticket Claimed Successfully!</h1>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Your pass for <strong>{ticketDetails?.eventName}</strong> has been issued and sent to <strong>{email}</strong>.
          </p>

          <div className="w-full bg-violet-50/60 rounded-2xl p-4 border border-violet-100 mt-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-2">
              <QrCode className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-violet-900">{name}</p>
            <p className="text-[11px] text-violet-700 font-medium">{ticketDetails?.ticketTypeName}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 w-full">
            {claimResult.passId && (
              <a
                href={`/pass/${claimResult.passId}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"
              >
                <span>View Digital Pass & QR</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Error View ──
  if (errorMsg || !ticketDetails) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-md w-full p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Invitation Unavailable</h2>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{errorMsg || "This invitation link is invalid or has expired."}</p>
          <a
            href="/"
            className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Back to UrPass
          </a>
        </div>
      </div>
    );
  }

  // ── Expired State ──
  if (ticketDetails.isExpired) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-md w-full p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Invitation Expired</h2>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            This ticket claim invitation has expired. Please reach out to{" "}
            <strong>{ticketDetails.purchaserName}</strong> to re-send your invitation link.
          </p>
        </div>
      </div>
    );
  }

  // ── Normal Claim Form View ──
  return (
    <div className="min-h-screen bg-neutral-50/70 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden">
        {/* ── Event Banner ── */}
        <div className="bg-linear-to-br from-violet-600 to-indigo-700 p-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold backdrop-blur-xs mb-3">
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticket Invitation</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight">{ticketDetails.eventName}</h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-violet-100">
            {ticketDetails.eventDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(ticketDetails.eventDate).toLocaleDateString()}
              </span>
            )}
            {ticketDetails.eventVenue && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {ticketDetails.eventVenue}
              </span>
            )}
          </div>
        </div>

        {/* ── Inviter Note ── */}
        <div className="bg-violet-50/70 border-b border-violet-100/60 px-6 py-3 text-center">
          <p className="text-xs text-violet-900">
            <strong>{ticketDetails.purchaserName}</strong> allocated a{" "}
            <span className="font-semibold text-violet-800 underline">{ticketDetails.ticketTypeName}</span> for you.
          </p>
        </div>

        {/* ── Claim Form ── */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-neutral-900">Confirm Your Attendee Details</h2>

          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Full Name</label>
            <div className="relative mt-1">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Your digital QR pass will be delivered to this email.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Mobile Number <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <div className="relative mt-1">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
              />
            </div>
          </div>

          {/* Custom Fields if defined */}
          {ticketDetails.customFields && ticketDetails.customFields.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-800">Additional Information</span>
              {ticketDetails.customFields.map((cf: any) => (
                <div key={cf.id}>
                  <label className="text-xs font-semibold text-neutral-600">
                    {cf.label} {cf.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={Boolean(cf.required)}
                    value={customResponses[cf.id] || ""}
                    onChange={(e) =>
                      setCustomResponses((prev) => ({ ...prev, [cf.id]: e.target.value }))
                    }
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Issuing Pass…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Claim Ticket & Get Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
