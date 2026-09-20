import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventFeedbackForm } from "@/app/actions/event-feedback";
import AttendeeEventFeedbackForm from "@/components/feedback/AttendeeEventFeedbackForm";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const { event, form } = await getEventFeedbackForm(eventId);

  if (!event) {
    return {
      title: "Event Feedback — URPASS",
      description: "Share your attendee feedback for this event.",
    };
  }

  const title = `${form.title || "Share Feedback"} — ${event.name}`;
  const description = `Take 60 seconds to share your thoughts and rate your experience at ${event.name}. Your feedback shapes future editions.`;
  const canonicalUrl = `https://urpass.space/feedback/${event.apply_slug || event.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "URPASS",
      locale: "en_IN",
      images: [
        {
          url: event.logo_url || "https://urpass.space/og-image.png",
          width: 1200,
          height: 630,
          alt: `${event.name} Feedback Survey`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [event.logo_url || "https://urpass.space/og-image.png"],
    },
    other: {
      "geo.placename": event.venue || "India",
      "geo.region": "IN",
    },
  };
}

export default async function PublicEventFeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams?: Promise<{ email?: string; name?: string }>;
}) {
  const { eventId } = await params;
  const sParams = searchParams ? await searchParams : {};
  const { form, event, error } = await getEventFeedbackForm(eventId);

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Event Not Found</h1>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            The event feedback link you followed may be invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to URPASS Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-3 sm:px-6 selection:bg-brand selection:text-white">
      <AttendeeEventFeedbackForm
        formConfig={form}
        event={event}
        initialEmail={sParams.email || ""}
        initialName={sParams.name || ""}
      />
    </div>
  );
}
