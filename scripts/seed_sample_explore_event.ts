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
  console.log("Seeding sample event for Explore Marketplace...");

  // 1. Get an existing organizer user
  const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !usersData?.users?.length) {
    throw new Error(`Failed to list users: ${userError?.message}`);
  }
  const organizer = usersData.users[0];
  console.log(`Using organizer: ${organizer.email} (${organizer.id})`);

  // 2. Ensure organizer profile
  await supabase.from("profiles").upsert({
    id: organizer.id,
    user_id: organizer.id,
    email: organizer.email,
    full_name: "UrPass Event Team",
    company_name: "UrPass Community",
    created_at: new Date().toISOString(),
  });

  const slug = "bengaluru-tech-ai-founders-mixer";
  const eventName = "Bengaluru Tech & AI Founders Mixer";

  // 3. Upsert Event
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
      "Exclusive curated gathering of tech founders, AI practitioners, engineers, and product leaders in Bengaluru. Interactive panel sessions, product showcases, networking, and digital QR pass check-in.",
    event_date: "2026-11-20",
    start_time: "18:30",
    end_time: "21:30",
    venue: "Koramangala Social, Bengaluru",
    attendee_limit: 250,
    status: "active",
    is_paid_event: false,
    ticket_price: 0,
    application_enabled: true,
    apply_slug: slug,
    auto_approve: true,
    whatsapp_enabled: true,
    email_enabled: true,
    banner_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
    logo_url:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    custom_pass_design: {
      primaryColor: "#6200EE",
      accentColor: "#7C3AED",
      template: "modern",
      event_images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
      ],
    },
    updated_at: new Date().toISOString(),
  };

  if (eventId) {
    console.log(`Updating existing event: ${eventId}`);
    const { error: updateErr } = await supabase
      .from("events")
      .update(eventPayload)
      .eq("id", eventId);
    if (updateErr) throw updateErr;
  } else {
    console.log("Creating new event...");
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

  console.log(`Event ID: ${eventId}`);

  // 4. Ensure Ticket Type
  const { data: existingTicket } = await supabase
    .from("ticket_types")
    .select("id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (!existingTicket) {
    console.log("Creating General Admission ticket type...");
    const { error: ttErr } = await supabase.from("ticket_types").insert({
      event_id: eventId,
      name: "General Admission Pass",
      description: "Complimentary access to mixer panels and networking area",
      category: "general",
      price: 0,
      capacity: 250,
      max_per_person: 2,
      status: "on_sale",
      position: 0,
    });
    if (ttErr) console.warn("Ticket type warning:", ttErr.message);
  }

  // 5. Upsert into explore_marketplace_listings (Status: approved, featured: true)
  const listingPayload = {
    event_id: eventId,
    status: "approved",
    featured: true,
    category: "business",
    city: "Bengaluru",
    venue_address: "Koramangala Social, 80 Feet Road, 7th Block, Koramangala, Bengaluru, Karnataka 560095",
    editorial_summary:
      "Exclusive closed-door mixer bringing together seed and series-A startup founders, AI innovators, and product builders in Bengaluru.",
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
    console.log(`Updating explore listing: ${existingListing.id}`);
    const { error: listUpdateErr } = await supabase
      .from("explore_marketplace_listings")
      .update(listingPayload)
      .eq("id", existingListing.id);
    if (listUpdateErr) throw listUpdateErr;
  } else {
    console.log("Inserting approved explore listing...");
    const { error: listInsertErr } = await supabase
      .from("explore_marketplace_listings")
      .insert({
        ...listingPayload,
        created_at: new Date().toISOString(),
      });
    if (listInsertErr) throw listInsertErr;
  }

  console.log("Successfully seeded sample event!");
  console.log(`View at: http://localhost:3000/explore`);
  console.log(`Direct event URL: http://localhost:3000/events/${slug}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
