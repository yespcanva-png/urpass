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
  console.log("=== Seeding Curated, High-Quality Real Events for UrPass Explore ===");

  // 1. Get existing organizer
  const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !usersData?.users?.length) {
    throw new Error(`Failed to list users: ${userError?.message}`);
  }
  const organizer = usersData.users[0];
  console.log(`Using organizer: ${organizer.email} (${organizer.id})`);

  // 2. Curated seed events list
  const seedEvents = [
    {
      slug: "yesp-corp-keynote-2026",
      name: "YESP Corp Annual Keynote & Tech Summit 2026",
      description:
        "The flagship annual keynote and developer conference by Yesp Corporation. Experience live product announcements, sub-second (<0.3s) optical QR verification demos, next-gen digital pass design systems, and native Model Context Protocol (MCP) tooling.",
      event_date: "2026-11-28",
      start_time: "09:30:00",
      end_time: "18:00:00",
      venue: "YESP Tech Campus, Indiranagar, Bengaluru",
      city: "Bengaluru",
      category: "business",
      attendee_limit: 1200,
      is_paid_event: false,
      ticket_price: 0,
      featured: true,
      organizer_name: "YESP Corp",
      banner_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "General Delegate Pass", price: 0, capacity: 900, category: "general" },
        { name: "VIP Executive & Developer Pass", price: 1499, capacity: 300, category: "vip" },
      ],
    },
    {
      slug: "navraas-20-slot-1",
      name: "NAVRAAS 2.0 (Slot 1) — Inter-College Cultural Fest",
      description:
        "Mumbai's grand inter-college cultural festival featuring live music performances, dance competitions, fashion showcases, and traditional celebrations organized by the student council.",
      event_date: "2026-11-04",
      start_time: "17:00:00",
      end_time: "22:00:00",
      venue: "K.P.B. Hinduja College, Worli Campus, Mumbai",
      city: "Mumbai",
      category: "festivals",
      attendee_limit: 1500,
      is_paid_event: true,
      ticket_price: 299,
      featured: true,
      organizer_name: "Hinduja College Cultural Council",
      banner_url:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Student Entry Pass", price: 299, capacity: 1200, category: "general" },
        { name: "VIP Guest & Alumni Pass", price: 699, capacity: 300, category: "vip" },
      ],
    },
    {
      slug: "national-inter-college-tech-symposium-2026",
      name: "National Inter-College Tech Symposium 2026",
      description:
        "Annual inter-college technology symposium bringing together over 2,400 students across engineering colleges for coding battles, paper presentations, AI hackathons, and hardware robotics showcases.",
      event_date: "2026-11-20",
      start_time: "09:30:00",
      end_time: "17:30:00",
      venue: "SRM Tech Auditorium, Kattankulathur, Chennai",
      city: "Chennai",
      category: "workshops",
      attendee_limit: 2500,
      is_paid_event: false,
      ticket_price: 0,
      featured: false,
      organizer_name: "Faculty Convenor & Tech Council",
      banner_url:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Student Participant Pass", price: 0, capacity: 2000, category: "general" },
        { name: "Faculty & Mentor Pass", price: 0, capacity: 500, category: "vip" },
      ],
    },
    {
      slug: "developer-ai-builders-summit-2026",
      name: "Developer & AI Builders Summit 2026",
      description:
        "Hands-on technical conference featuring 6 multi-track breakout sessions on LLMs, agentic workflows, autonomous code generation, and production ML architecture.",
      event_date: "2026-12-12",
      start_time: "10:00:00",
      end_time: "18:30:00",
      venue: "NIMHANS Convention Centre, Hosur Road, Bengaluru",
      city: "Bengaluru",
      category: "business",
      attendee_limit: 850,
      is_paid_event: true,
      ticket_price: 499,
      featured: false,
      organizer_name: "Lead Operations & AI Guild",
      banner_url:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Developer Conference Pass", price: 499, capacity: 600, category: "general" },
        { name: "All-Access Workshop Pass", price: 1299, capacity: 250, category: "vip" },
      ],
    },
    {
      slug: "hackmatrix-national-36h-hackathon-2026",
      name: "HackMatrix National 36h Hackathon",
      description:
        "Non-stop 36-hour buildathon for university and early-stage engineers. Build AI prototypes, compete for ₹2,50,000 in prizes, and check in with seamless QR passes.",
      event_date: "2026-12-19",
      start_time: "09:00:00",
      end_time: "21:00:00",
      venue: "Innovation Campus Hub, T. Nagar, Chennai",
      city: "Chennai",
      category: "workshops",
      attendee_limit: 600,
      is_paid_event: false,
      ticket_price: 0,
      featured: false,
      organizer_name: "HackMatrix Organizing Committee",
      banner_url:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Hacker Team Pass (Per Member)", price: 0, capacity: 500, category: "general" },
        { name: "Mentor & Judge Pass", price: 0, capacity: 100, category: "vip" },
      ],
    },
    {
      slug: "fintech-executive-forum-2026",
      name: "FinTech Executive Forum 2026",
      description:
        "Exclusive gathering of banking executives, payment infrastructure leaders, and founders discussing UPI cross-border rails, tokenization, and digital finance regulations.",
      event_date: "2026-12-05",
      start_time: "14:00:00",
      end_time: "19:30:00",
      venue: "The St. Regis, Lower Parel, Mumbai",
      city: "Mumbai",
      category: "business",
      attendee_limit: 400,
      is_paid_event: true,
      ticket_price: 1999,
      featured: false,
      organizer_name: "FinTech Executive Network",
      banner_url:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Executive Delegate Pass", price: 1999, capacity: 350, category: "general" },
        { name: "Boardroom & Speaker Pass", price: 4999, capacity: 50, category: "vip" },
      ],
    },
    {
      slug: "company-5th-anniversary-0o0xk",
      name: "Festivals for Joy — 5th Anniversary Celebration",
      description:
        "A festive evening of live acoustics, community awards, curated artisan food tastings, and celebrations celebrating 5 years of community and digital innovation.",
      event_date: "2026-11-24",
      start_time: "18:00:00",
      end_time: "22:00:00",
      venue: "Grand Ballroom, The Leela Palace, Bengaluru",
      city: "Bengaluru",
      category: "community",
      attendee_limit: 500,
      is_paid_event: false,
      ticket_price: 0,
      featured: false,
      organizer_name: "Yesp Community Foundation",
      banner_url:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&auto=format&fit=crop&q=80",
      logo_url:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=80",
      tickets: [
        { name: "Community Invitation Pass", price: 0, capacity: 500, category: "general" },
      ],
    },
  ];

  for (const item of seedEvents) {
    console.log(`Processing event: ${item.name} (${item.slug})...`);

    // 1. Check or upsert event
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id")
      .eq("apply_slug", item.slug)
      .maybeSingle();

    let eventId = existingEvent?.id;

    const eventPayload = {
      organizer_id: organizer.id,
      name: item.name,
      description: item.description,
      event_date: item.event_date,
      start_time: item.start_time,
      end_time: item.end_time,
      venue: item.venue,
      attendee_limit: item.attendee_limit,
      status: "active",
      is_paid_event: item.is_paid_event,
      ticket_price: item.ticket_price,
      application_enabled: true,
      apply_slug: item.slug,
      auto_approve: true,
      whatsapp_enabled: true,
      email_enabled: true,
      banner_url: item.banner_url,
      logo_url: item.logo_url,
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
        event_images: [item.banner_url],
      },
      updated_at: new Date().toISOString(),
    };

    if (eventId) {
      const { error: updErr } = await supabase.from("events").update(eventPayload).eq("id", eventId);
      if (updErr) console.warn("Update error:", updErr.message);
    } else {
      const { data: newEvt, error: insErr } = await supabase
        .from("events")
        .insert({ ...eventPayload, created_at: new Date().toISOString() })
        .select("id")
        .single();
      if (insErr) {
        console.warn("Insert error:", insErr.message);
        continue;
      }
      eventId = newEvt.id;
    }

    // 2. Ensure ticket types
    await supabase.from("ticket_types").delete().eq("event_id", eventId);
    await supabase.from("ticket_types").insert(
      item.tickets.map((t, idx) => ({
        event_id: eventId,
        name: t.name,
        description: `Official ${t.name} with instant QR check-in`,
        category: t.category,
        price: t.price,
        capacity: t.capacity,
        max_per_person: 2,
        status: "on_sale",
        position: idx,
      }))
    );

    // 3. Upsert explore_marketplace_listings
    const minPricePaise = item.tickets.length > 0 ? Math.min(...item.tickets.map((t) => t.price * 100)) : 0;
    const isFree = minPricePaise === 0;

    const listingPayload = {
      event_id: eventId,
      status: "approved",
      featured: item.featured,
      category: item.category,
      city: item.city,
      venue_address: item.venue,
      editorial_summary: item.description,
      min_price_paise: minPricePaise,
      currency: "INR",
      is_free: isFree,
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
        .insert({ ...listingPayload, created_at: new Date().toISOString() });
    }
  }

  // 3. Populate Hero Carousel Campaigns for Explore:
  // - Multiple high-quality slides so the Hero Slider/Carousel activates (arrows, dots, swipe, auto-rotation)
  // - Active flight date (starts_at <= now) so it is served by the ad placement service
  // - Real event end dates in ends_at
  // - Clean badges ("Presented by YESP Corp", "Featured Summit", "Campus Headliner")
  console.log("Cleaning and updating explore_ad_campaigns for Hero Slider...");
  await supabase.from("explore_ad_campaigns").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const [
    { data: keynoteEvent },
    { data: aiSummitEvent },
    { data: navraasEvent },
  ] = await Promise.all([
    supabase.from("events").select("id").eq("apply_slug", "yesp-corp-keynote-2026").single(),
    supabase.from("events").select("id").eq("apply_slug", "developer-ai-builders-summit-2026").single(),
    supabase.from("events").select("id").eq("apply_slug", "navraas-20-slot-1").single(),
  ]);

  const nowPast = "2026-10-01T00:00:00.000Z";
  const heroCampaigns = [];

  if (keynoteEvent) {
    heroCampaigns.push({
      title: "YESP Corp Keynote 2026 — The Future of Autonomous Event Tech",
      description:
        "Unveiling next-gen digital pass design, <0.3s optical QR verification, and native Model Context Protocol tooling. Join engineers, founders, and event leaders.",
      placement: "hero",
      campaign_type: "brand_sponsor",
      advertiser_name: "YESP Corp",
      event_id: keynoteEvent.id,
      desktop_image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80",
      mobile_image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      badge_label: "Presented by YESP Corp",
      cta_text: "Register Free",
      destination_url: "/explore/event/yesp-corp-keynote-2026",
      city_targeting: ["All Cities", "Bengaluru"],
      starts_at: nowPast,
      ends_at: "2026-11-28T18:00:00.000Z",
      priority: 100,
      status: "active",
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (aiSummitEvent) {
    heroCampaigns.push({
      title: "Developer & AI Builders Summit 2026",
      description:
        "India's largest gathering of full-stack engineers and generative AI builders. Keynotes on local LLMs, AI agents, and sub-second web architecture.",
      placement: "hero",
      campaign_type: "event_promo",
      advertiser_name: "DevSphere India",
      event_id: aiSummitEvent.id,
      desktop_image_url:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1920&q=80",
      mobile_image_url:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      badge_label: "Featured Summit",
      cta_text: "Get Tickets",
      destination_url: "/explore/event/developer-ai-builders-summit-2026",
      city_targeting: ["All Cities", "Bengaluru"],
      starts_at: nowPast,
      ends_at: "2026-12-05T18:00:00.000Z",
      priority: 90,
      status: "active",
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (navraasEvent) {
    heroCampaigns.push({
      title: "NAVRAAS 2.0 — Inter-College Cultural Fest & Live Concert",
      description:
        "The premier student cultural festival featuring live band performances, choreo dance battles, fashion walks, and food stalls in Chennai.",
      placement: "hero",
      campaign_type: "event_promo",
      advertiser_name: "SRM Student Council",
      event_id: navraasEvent.id,
      desktop_image_url:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
      mobile_image_url:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      badge_label: "Campus Headliner",
      cta_text: "Book Pass",
      destination_url: "/explore/event/navraas-20-slot-1",
      city_targeting: ["All Cities", "Chennai"],
      starts_at: nowPast,
      ends_at: "2026-11-14T22:00:00.000Z",
      priority: 80,
      status: "active",
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (heroCampaigns.length > 0) {
    await supabase.from("explore_ad_campaigns").insert(heroCampaigns);
    console.log(`Inserted ${heroCampaigns.length} active hero slider campaigns.`);
  }

  console.log("=== Seeded 7 high-quality events and unified ad campaign successfully ===");
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
