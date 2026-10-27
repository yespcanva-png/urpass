import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClaudeMcpCard } from "@/app/dashboard/settings/ClaudeMcpCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistants & Integrations — UrPass Dashboard",
};

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?returnTo=/dashboard/settings/integrations");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">AI Assistants &amp; Integrations</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Connect Anthropic Claude and AI agents to manage events, ticket tiers, and attendance directly from conversations.
        </p>
      </div>

      <div className="space-y-6">
        <ClaudeMcpCard />
      </div>
    </div>
  );
}
