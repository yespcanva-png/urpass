import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getShareInvitationData } from "@/lib/communications/invitation-share";
import ShareClient from "./ShareClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const data = await getShareInvitationData(token);

  if (data.status !== "active") {
    return {
      title: "Event Invitation — UrPass",
      description: "UrPass Event Invitation Sharing",
      robots: { index: false, follow: false },
    };
  }

  const title = `Invitation: ${data.eventName} — UrPass`;
  const description = `Official WhatsApp invitation for ${data.eventName}. View digital pass and share with friends.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "UrPass",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;
  const data = await getShareInvitationData(token);

  return <ShareClient data={data} />;
}

