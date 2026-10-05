import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { resolveTicketDesign } from "@/lib/pass-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PASS_TYPE_LABEL: Record<string, string> = {
  participant: "PARTICIPANT",
  vip: "VIP",
  speaker: "SPEAKER",
  organizer: "ORGANIZER",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ passToken: string }> }
) {
  const { passToken } = await params;

  // Service-role client bypasses RLS (server only, key never sent to client)
  const supabase = createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: pass } = await supabase
    .from("passes")
    .select("pass_token, pass_type, status, attendee_id, event_id")
    .eq("pass_token", passToken)
    .single();

  if (!pass) return new Response("Not found", { status: 404 });

  const [{ data: attendee }, { data: event }] = await Promise.all([
    supabase.from("attendees").select("name, email, phone").eq("id", pass.attendee_id).single(),
    supabase.from("events").select("name, event_date, start_time, venue, custom_pass_design").eq("id", pass.event_id).single(),
  ]);

  if (!attendee || !event) return new Response("Not found", { status: 404 });

  // Fetch organizer plan + branding
  const { data: eventOrg } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("id", pass.event_id)
    .single();

  const organizerId = eventOrg?.organizer_id ?? null;
  let showBranding = true;
  let orgProfileData: { org_name: string | null; brand_color: string | null; org_logo_url: string | null; custom_pass_design: unknown } | null = null;

  if (organizerId) {
    const [{ data: sub }, { data: orgProfile }] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan:plans(slug), is_trial, trial_ends_at")
        .eq("user_id", organizerId)
        .in("status", ["active", "trialing"])
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("org_name, brand_color, org_logo_url, custom_pass_design, hide_urpass_branding")
        .eq("user_id", organizerId)
        .single(),
    ]);

    const isTrialExpired = sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date();
    const planSlug = isTrialExpired ? "free" : ((sub?.plan as unknown as { slug: string } | null)?.slug ?? "free");
    showBranding = !(planSlug !== "free" && orgProfile?.hide_urpass_branding);
    orgProfileData = orgProfile;
  }

  const design = resolveTicketDesign(
    event.custom_pass_design,
    orgProfileData?.custom_pass_design,
    orgProfileData?.brand_color
  );

  const isDark = design.template === "dark";
  const isMinimal = design.template === "minimal";
  const isModern = design.template === "modern";

  const categoryColor = pass.pass_type
    ? design.categoryColors?.[pass.pass_type] ||
      design.categoryColors?.[pass.pass_type.toLowerCase()] ||
      design.categoryColors?.[pass.pass_type.toUpperCase()]
    : null;
  const activeColor = categoryColor || design.primaryColor || "#635BFF";

  const cardBg = isDark ? "#111317" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#111827";
  const subtextColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#27272a" : "#e5e7eb";

  const orgName = orgProfileData?.org_name || null;
  const logoToDisplay = design.logoUrl || orgProfileData?.org_logo_url || null;

  const qrSizePx = design.qrSize === "sm" ? 130 : design.qrSize === "lg" ? 170 : 150;

  // QR code as base64 PNG
  const qrDataUrl = await QRCode.toDataURL(passToken, {
    width: qrSizePx,
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const typeLabel = PASS_TYPE_LABEL[pass.pass_type] ?? (pass.pass_type ? pass.pass_type.toUpperCase() : "PARTICIPANT");
  const shortCode = (passToken.slice(0, 8).match(/.{1,4}/g) ?? []).join("-").toUpperCase();
  const isCheckedIn = pass.status === "checked_in";

  const rulesList = [
    design.showSingleEntryRule !== false ? "Valid for single entry" : null,
    design.showGateNotice !== false ? "Keep QR ready at gate" : null,
    design.customInstruction || null,
  ].filter(Boolean);

  const orderedFields = Array.isArray(design.fieldOrder) && design.fieldOrder.length > 0
    ? design.fieldOrder
    : [
        "showAttendeeName",
        "showOrganization",
        "showPhone",
        "showRegistrationNumber",
        "showTicketId",
      ];

  const img = new ImageResponse(
    (
      <div
        style={{
          width: 400,
          minHeight: 620,
          display: "flex",
          flexDirection: "column",
          backgroundColor: cardBg,
          borderRadius: 24,
          overflow: "hidden",
          border: `1px solid ${borderColor}`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: textColor,
        }}
      >
        {/* Accent Top Strip for Event & Modern */}
        {(design.template === "event" || isModern) && (
          <div
            style={{
              height: 8,
              width: "100%",
              backgroundColor: activeColor,
            }}
          />
        )}

        {/* Card Interior */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "24px 24px 20px",
            flex: 1,
          }}
        >
          {/* Logo & Sponsor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {logoToDisplay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoToDisplay}
                alt="Logo"
                style={{ height: 32, maxWidth: 130, objectFit: "contain" }}
              />
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                {orgName || "URPASS"}
              </span>
            )}

            {design.sponsorLogoUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>×</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={design.sponsorLogoUrl}
                  alt="Sponsor Logo"
                  style={{ height: 24, maxWidth: 90, objectFit: "contain", opacity: 0.85 }}
                />
              </div>
            )}
          </div>

          {/* Event Title */}
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.3,
              textTransform: "uppercase",
              lineHeight: 1.25,
              marginBottom: 10,
              maxWidth: 340,
            }}
          >
            {event.name}
          </span>

          {/* Ticket Type Pill */}
          {design.showTicketType && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "3px 12px",
                borderRadius: 99,
                color: activeColor,
                backgroundColor: `${activeColor}18`,
                border: `1px solid ${activeColor}40`,
                marginBottom: 12,
              }}
            >
              <span>{typeLabel}</span>
            </div>
          )}

          {/* Center QR (if not bottom) */}
          {design.qrPosition !== "bottom" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                borderRadius: 14,
                padding: 12,
                border: design.showQrBorder !== false ? "1px solid #e5e7eb" : "none",
                marginBottom: 12,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} width={qrSizePx} height={qrSizePx} alt="QR" />
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                SCAN FOR ENTRY
              </span>
            </div>
          )}

          {/* Dynamic Ordered Fields */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              width: "100%",
            }}
          >
            {orderedFields.map((fieldId) => {
              if (fieldId === "showAttendeeName" && design.showAttendeeName) {
                return (
                  <span
                    key="showAttendeeName"
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: textColor,
                    }}
                  >
                    {attendee.name}
                  </span>
                );
              }

              if (fieldId === "showPhone" && design.showPhone && attendee.phone) {
                return (
                  <span
                    key="showPhone"
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: subtextColor,
                    }}
                  >
                    {attendee.phone}
                  </span>
                );
              }

              if (fieldId === "showRegistrationNumber" && design.showRegistrationNumber) {
                return (
                  <span
                    key="showRegistrationNumber"
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 4,
                      backgroundColor: isDark ? "#27272a" : "#f4f4f5",
                      color: isDark ? "#d4d4d8" : "#52525b",
                    }}
                  >
                    REG-{shortCode}
                  </span>
                );
              }

              if (fieldId === "showTicketId" && design.showTicketId) {
                return (
                  <div
                    key="showTicketId"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: "#9ca3af",
                        textTransform: "uppercase",
                      }}
                    >
                      TICKET ID:
                    </span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                      #{shortCode}
                    </span>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Bottom QR (if bottom) */}
          {design.qrPosition === "bottom" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                borderRadius: 14,
                padding: 12,
                border: design.showQrBorder !== false ? "1px solid #e5e7eb" : "none",
                margin: "10px 0",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} width={qrSizePx} height={qrSizePx} alt="QR" />
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                SCAN FOR ENTRY
              </span>
            </div>
          )}

          {/* Date & Venue Footer */}
          {(design.showEventDate !== false || (design.showVenue && event.venue)) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                width: "100%",
                paddingTop: 10,
                marginTop: 10,
                borderTop: `1px solid ${borderColor}`,
                fontSize: 11,
                color: subtextColor,
              }}
            >
              {design.showEventDate !== false && (
                <span>{formattedDate}{event.start_time ? ` · ${event.start_time}` : ""}</span>
              )}
              {design.showVenue && event.venue && <span>{event.venue}</span>}
            </div>
          )}

          {/* Custom Message */}
          {design.customMessage && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 8,
                marginTop: 8,
                borderTop: "1px dashed #d1d5db",
                width: "100%",
                fontSize: 11,
                fontStyle: "italic",
                color: subtextColor,
              }}
            >
              <span>&ldquo;{design.customMessage}&rdquo;</span>
            </div>
          )}

          {/* Admission Rules */}
          {rulesList.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 8,
                marginTop: 8,
                borderTop: `1px solid ${borderColor}`,
                width: "100%",
                fontSize: 9,
                fontWeight: 600,
                color: subtextColor,
              }}
            >
              <span>{rulesList.join(" • ")}</span>
            </div>
          )}

          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: isCheckedIn ? "#f0fdf4" : `${activeColor}12`,
              border: `1px solid ${isCheckedIn ? "#bbf7d0" : `${activeColor}30`}`,
              borderRadius: 12,
              padding: "8px 20px",
              width: "100%",
              marginTop: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isCheckedIn ? "#15803d" : activeColor,
              }}
            >
              {isCheckedIn ? "VERIFIED ENTRY · CHECKED IN" : "VALID · SHOW AT ENTRANCE"}
            </span>
          </div>
        </div>

        {/* Branding footer */}
        {showBranding && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 24px",
              borderTop: `1px solid ${borderColor}`,
              backgroundColor: isDark ? "#09090b" : "#f9fafb",
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "#9ca3af",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Powered by URPASS
            </span>
          </div>
        )}
      </div>
    ),
    {
      width: 400,
      headers: {
        "Content-Disposition": `attachment; filename="urpass-${shortCode}.png"`,
      },
    }
  );

  return img;
}

