import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveSetupReminderPreference } from "@/app/actions/email-preferences";

export default async function EmailPreferencesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/settings/email");
  const { data: preference } = await supabase.from("email_preferences")
    .select("lifecycle_reminders").eq("user_id", user.id).maybeSingle();
  const enabled = preference ? preference.lifecycle_reminders : user.user_metadata?.lifecycle_reminders_opt_in === true;
  return <main className="mx-auto max-w-xl px-4 py-12"><Link href="/dashboard/settings" className="text-sm text-violet-700">← Settings</Link><h1 className="mt-5 text-2xl font-bold">Email preferences</h1><p className="mt-2 text-sm text-neutral-600">Choose whether UrPass may email you about finishing your first event. Account and event service notices are separate.</p><form action={saveSetupReminderPreference} className="mt-6 rounded-xl border bg-white p-5"><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="lifecycle_reminders" defaultChecked={enabled} className="mt-1" /><span>Send me first-event setup reminders when my event is unfinished.</span></label><button className="mt-5 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Save preferences</button></form></main>;
}
