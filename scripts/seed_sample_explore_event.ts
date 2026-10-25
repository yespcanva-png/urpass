import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const url = env["NEXT_PUBLIC_SUPABASE_URL"] || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = env["SUPABASE_SERVICE_ROLE_KEY"] || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

async function main() {
  console.log("=== Setting up YESP Corp Event and Banner on UrPass Explore ===");

  // 1. Remove mock banners from explore_ad_campaigns
  console.log("Removing mock banners from explore_ad_campaigns...");
  const mockTitles = [
    "FinTech Founders Masterclass",
    "Sunburn Soundwave Arena Tour",
    "Bangalore Tech & AI Summit 2026",
    "Organize with UrPass — Zero Platform Fee",
    "Koramangala Artisan Coffee & Street Food Fest",
  ];
  const { error: delAdsErr } = await supabase
    .from("explore_ad_campaigns")
    .delete()
    .in("title", mockTitles);
  if (delAdsErr) {
    console.warn("Notice deleting mock ads by title:", delAdsErr.message);
  }

  // Also remove any mock banners with non-YESP advertisers if needed
  await supabase
    .from("explore_ad_campaigns")
    .delete()
    .neq("advertiser_name", "YESP Corp")
    .neq("advertiser_name", "Yesp Corporation");

  // 2. Remove old sample explore event listings
  console.log("Removing old sample explore marketplace listings...");
  const oldSlugs = ["bengaluru-tech-ai-founders-mixer", "mldl-rbjj"];
  const { data: oldEvents } = await supabase
    .from("events")
    .select("id, apply_slug")
    .in("apply_slug", oldSlugs);

  if (oldEvents && oldEvents.length > 0) {
    const oldEventIds = oldEvents.map((e) => e.id);
    await supabase
      .from("explore_marketplace_listings")
      .delete()
      .in("event_id", oldEventIds);

    // Also remove the old temporary mixer event if it was just seeded
    await supabase.from("events").delete().eq("apply_slug", "bengaluru-tech-ai-founders-mixer");
  }

  // Also clean up any lingering listings that are not YESP Corp
  const { data: lingeringListings } = await supabase
    .from("explore_marketplace_listings")
    .select("id, event_id, event:events(apply_slug)");
  for (const item of lingeringListings || []) {
    const slug = (item.event as any)?.apply_slug;
    if (slug && slug !== "yesp-corp-keynote-2026") {
      console.log(`Removing non-YESP listing: ${item.id} (${slug})`);
      await supabase.from("explore_marketplace_listings").delete().eq("id", item.id);
    }
  }

  // 3. Get existing organizer user
  const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !usersData?.users?.length) {
    throw new Error(`Failed to list users: ${userError?.message}`);
  }
  const organizer = usersData.users[0];
  console.log(`Using organizer: ${organizer.email} (${organizer.id})`);

  // 4. Update organizer profile to Yesp Corporation
  await supabase.from("profiles").upsert({
    id: organizer.id,
    user_id: organizer.id,
    email: organizer.email,
    full_name: "YESP Corp Executive Operations",
    company_name: "YESP Corporation",
    org_name: "YESP Corp",
    brand_color: "#6D28D9",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // 5. Create YESP Corp Event
  const slug = "yesp-corp-keynote-2026";
  const eventName = "YESP Corp Annual Keynote & Tech Summit 2026";

  const { data: existingEvent } = await supabase
    .from("events")
    .select("id")
    .eq("apply_slug", slug)
    .maybeSingle();

  let eventId = existingEvent?.id;

  const eventPayload = {
    organizer_id: organizer.id,
    name: eventName,
    description:
      "The flagship annual keynote and developer conference by Yesp Corporation. Experience live product announcements, 0.28-second optical QR verification demos, next-gen digital pass design systems, and native Model Context Protocol (MCP) tooling. Connect with industry founders, engineering leaders, and event producers.",
    event_date: "2026-11-28",
    start_time: "09:30:00",
    end_time: "18:00:00",
    venue: "YESP Tech Campus, Indiranagar, Bengaluru",
    attendee_limit: 1200,
    status: "active",
    is_paid_event: false,
    ticket_price: 0,
    application_enabled: true,
    apply_slug: slug,
    auto_approve: true,
    whatsapp_enabled: true,
    email_enabled: true,
    banner_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80",
    logo_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    custom_pass_design: {
      primaryColor: "#6D28D9",
      accentColor: "#8B5CF6",
      template: "corporate",
      shape: "rounded",
      brand_color: "#6D28D9",
      showAttendeeName: true,
      showTicketType: true,
      showEventDate: true,
      showVenue: true,
      showTicketId: true,
      showOrganization: true,
      event_images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80",
      ],
    },
    updated_at: new Date().toISOString(),
  };

  if (eventId) {
    console.log(`Updating existing YESP Corp event: ${eventId}`);
    const { error: updateErr } = await supabase
      .from("events")
      .update(eventPayload)
      .eq("id", eventId);
    if (updateErr) throw updateErr;
  } else {
    console.log("Inserting new YESP Corp event...");
    const { data: newEvt, error: insertErr } = await supabase
      .from("events")
      .insert({
        ...eventPayload,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (insertErr) throw insertErr;
    eventId = newEvt.id;
  }

  console.log(`YESP Corp Event ID: ${eventId}`);

  // 6. Ensure Ticket Types
  await supabase.from("ticket_types").delete().eq("event_id", eventId);

  console.log("Creating YESP Corp Ticket Types...");
  const { error: ttErr } = await supabase.from("ticket_types").insert([
    {
      event_id: eventId,
      name: "General Delegate Pass",
      description: "Complimentary access to the Main Keynote Stage, Product Expo & Interactive Demos",
      category: "general",
      price: 0,
      capacity: 900,
      max_per_person: 2,
      status: "on_sale",
      position: 0,
    },
    {
      event_id: eventId,
      name: "VIP Executive & Developer Pass",
      description: "Front-row keynote seating, engineering deep-dive workshops, and executive networking lunch",
      category: "vip",
      price: 1499,
      capacity: 300,
      max_per_person: 2,
      status: "on_sale",
      position: 1,
    },
  ]);
  if (ttErr) console.warn("Ticket types insertion warning:", ttErr.message);

  // 7. Ensure Event Sessions
  await supabase.from("event_sessions").delete().eq("event_id", eventId);

  console.log("Creating YESP Corp Event Sessions...");
  await supabase.from("event_sessions").insert([
    {
      event_id: eventId,
      title: "Opening Keynote: Autonomous Event Infrastructure & Next-Gen Identity",
      session_date: "2026-11-28",
      start_time: "10:00:00",
      end_time: "11:30:00",
      status: "published",
      visibility: "public",
    },
    {
      event_id: eventId,
      title: "Engineering Deep-Dive: 0.28s Sub-Second Optical QR Scanning & Edge Validation",
      session_date: "2026-11-28",
      start_time: "12:00:00",
      end_time: "13:30:00",
      status: "published",
      visibility: "public",
    },
    {
      event_id: eventId,
      title: "Model Context Protocol (MCP) in Production: Claude Desktop & Cursor Live Tooling",
      session_date: "2026-11-28",
      start_time: "14:30:00",
      end_time: "16:00:00",
      status: "published",
      visibility: "public",
    },
    {
      event_id: eventId,
      title: "Executive Networking Luncheon & Developer Partner Expo",
      session_date: "2026-11-28",
      start_time: "16:30:00",
      end_time: "18:00:00",
      status: "published",
      visibility: "public",
    },
  ]);

  // 8. Upsert into explore_marketplace_listings
  console.log("Publishing YESP Corp event to Explore Marketplace...");
  const listingPayload = {
    event_id: eventId,
    status: "approved",
    featured: true,
    category: "business",
    city: "Bengaluru",
    venue_address: "YESP Tech Campus, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    editorial_summary:
      "Join Yesp Corporation for its premier annual keynote, product innovations showcase, and developer conference in Bengaluru.",
    min_price_paise: 0,
    currency: "INR",
    is_free: true,
    published_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: existingListing } = await supabase
    .from("explore_marketplace_listings")
    .select("id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existingListing) {
    await supabase
      .from("explore_marketplace_listings")
      .update(listingPayload)
      .eq("id", existingListing.id);
  } else {
    await supabase
      .from("explore_marketplace_listings")
      .insert({
        ...listingPayload,
        created_at: new Date().toISOString(),
      });
  }

  // 9. Upsert Banner on YESP Corp in explore_ad_campaigns
  console.log("Creating YESP Corp Hero & In-Content Promotional Banners...");
  
  // Hero Banner
  const heroCampaign = {
    title: "YESP Corp Keynote 2026 — The Future of Autonomous Event Tech",
    description:
      "Unveiling next-gen digital pass design, 0.28s optical QR verification, and native Model Context Protocol tooling. Join 1,200+ engineers, founders, and event leaders.",
    placement: "hero",
    campaign_type: "brand_sponsor",
    advertiser_name: "YESP Corp",
    event_id: eventId,
    desktop_image_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80",
    mobile_image_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    badge_label: "YESP Official",
    cta_text: "Reserve Keynote Pass",
    destination_url: `/events/${slug}?ref=explore`,
    city_targeting: ["All Cities", "Bengaluru"],
    starts_at: new Date(Date.now() - 60000).toISOString(),
    ends_at: null,
    priority: 100,
    status: "active",
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // In-Content Banner
  const inContentCampaign = {
    title: "Build on the YESP Developer Platform",
    description:
      "Integrate real-time QR ticketing, webhook telemetry, and Model Context Protocol into your stack. Experience sub-second gate check-in.",
    placement: "in_content",
    campaign_type: "brand_sponsor",
    advertiser_name: "YESP Corp",
    event_id: eventId,
    desktop_image_url:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    mobile_image_url:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    badge_label: "Developer Platform",
    cta_text: "Explore Keynote Details",
    destination_url: `/events/${slug}?ref=explore`,
    city_targeting: ["All Cities", "Bengaluru"],
    starts_at: new Date(Date.now() - 60000).toISOString(),
    ends_at: null,
    priority: 90,
    status: "active",
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await supabase.from("explore_ad_campaigns").insert([heroCampaign, inContentCampaign]);

  console.log("\n✅ Setup complete!");
  console.log(`Explore Page: http://localhost:3000/explore`);
  console.log(`Direct Event URL: http://localhost:3000/events/${slug}`);
  console.log(`Marketplace Event Detail URL: http://localhost:3000/explore/event/${slug}`);
}

main().catch((err) => {
  console.error("Error setting up YESP Corp Explore:", err);
  process.exit(1);
});
