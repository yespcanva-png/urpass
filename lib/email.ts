import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const isDev = process.env.NODE_ENV === "development";

// In dev without a real key, log emails to console instead of failing silently
function getResend() {
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith("re_your")) {
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

// Resend requires a verified domain in production.
// In dev you can use delivered@resend.dev to bypass domain verification.
const FROM    = isDev
  ? "URPASS <delivered@resend.dev>"
  : "URPASS <noreply@urpass.space>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";
const OWNER_EMAIL = "srinithin@yespstudio.com";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInrFromPaise(amountPaise?: number | null) {
  if (amountPaise == null || Number.isNaN(amountPaise)) return "Not available";
  return `₹${(amountPaise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function sendEmail(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — email skipped.\n",
      "  To:", payload.to,
      "\n  Subject:", payload.subject
    );
    return;
  }
  const { error } = await resend.emails.send(payload);
  if (error) {
    console.error("[email] Resend error:", error);
    throw error;
  }
}

async function sendOwnerNotification({
  subject,
  title,
  rows,
}: {
  subject: string;
  title: string;
  rows: Array<[string, unknown]>;
}) {
  const safeTitle = escapeHtml(title);
  await sendEmail({
    from: FROM,
    to: OWNER_EMAIL,
    subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f6f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ff;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ede9fe;border-radius:18px;overflow:hidden;">
      <tr><td style="background:#6D28D9;padding:22px 26px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:3px;color:rgba(255,255,255,0.62);text-transform:uppercase;">URPASS Admin</p>
        <h1 style="margin:0;font-size:20px;line-height:1.35;color:#ffffff;">${safeTitle}</h1>
      </td></tr>
      <tr><td style="padding:24px 26px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${rows.map(([label, value]) => `
            <tr>
              <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;width:38%;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td>
              <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${escapeHtml(value || "Not provided")}</td>
            </tr>
          `).join("")}
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function notifyOwnerNewUser({
  name,
  email,
  provider,
  userId,
}: {
  name?: string | null;
  email?: string | null;
  provider: "email" | "google";
  userId?: string | null;
}) {
  await sendOwnerNotification({
    subject: `New URPASS signup: ${email ?? "unknown email"}`,
    title: "New user signup",
    rows: [
      ["Name", name],
      ["Email", email],
      ["Signup method", provider],
      ["User ID", userId],
      ["Time", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
    ],
  });
}

export async function sendUserWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}) {
  await sendEmail({
    from: FROM,
    to,
    subject: "Welcome to URPASS",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">
      <tr><td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.55);text-transform:uppercase;">Welcome</p>
        <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">You&apos;re in. Let&apos;s build your first event.</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:14px;color:#374151;line-height:1.6;">
          Hi <strong>${escapeHtml(name || "there")}</strong>, welcome to URPASS. Your account is ready.
        </p>
        <a href="${APP_URL}/dashboard" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">Open Dashboard &rarr;</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function notifyOwnerPaymentAttempt({
  kind,
  buyerName,
  buyerEmail,
  itemName,
  amountPaise,
  orderId,
}: {
  kind: "subscription" | "event_pass" | "ticket";
  buyerName?: string | null;
  buyerEmail?: string | null;
  itemName: string;
  amountPaise?: number | null;
  orderId?: string | null;
}) {
  await sendOwnerNotification({
    subject: `URPASS payment attempt: ${itemName}`,
    title: "Payment attempt started",
    rows: [
      ["Type", kind],
      ["Item", itemName],
      ["Amount", formatInrFromPaise(amountPaise)],
      ["Buyer name", buyerName],
      ["Buyer email", buyerEmail],
      ["Razorpay order", orderId],
      ["Time", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
    ],
  });
}

export async function notifyOwnerPaymentSuccess({
  kind,
  buyerName,
  buyerEmail,
  itemName,
  amountPaise,
  paymentId,
  orderId,
}: {
  kind: "subscription" | "event_pass" | "ticket";
  buyerName?: string | null;
  buyerEmail?: string | null;
  itemName: string;
  amountPaise?: number | null;
  paymentId?: string | null;
  orderId?: string | null;
}) {
  await sendOwnerNotification({
    subject: `URPASS payment captured: ${itemName}`,
    title: "Payment successful",
    rows: [
      ["Type", kind],
      ["Item", itemName],
      ["Amount", formatInrFromPaise(amountPaise)],
      ["Buyer name", buyerName],
      ["Buyer email", buyerEmail],
      ["Razorpay payment", paymentId],
      ["Razorpay order", orderId],
      ["Time", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
    ],
  });
}

export async function sendUserPaymentSuccessEmail({
  to,
  name,
  itemName,
  amountPaise,
  kind,
}: {
  to: string;
  name?: string | null;
  itemName: string;
  amountPaise?: number | null;
  kind: "subscription" | "event_pass" | "ticket";
}) {
  const heading = kind === "subscription"
    ? "Congratulations, your subscription is active"
    : kind === "event_pass"
      ? "Congratulations, your event pass is ready"
      : "Payment confirmed";

  await sendEmail({
    from: FROM,
    to,
    subject: `${heading} — URPASS`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">
      <tr><td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);padding:30px 32px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.58);text-transform:uppercase;">Payment Confirmed</p>
        <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">${escapeHtml(heading)}</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:14px;color:#374151;line-height:1.6;">
          Hi <strong>${escapeHtml(name || "there")}</strong>, thanks for your purchase. Your URPASS payment has been confirmed.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:14px;border:1px solid #bbf7d0;margin-bottom:20px;">
          <tr><td style="padding:18px 22px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;color:#6b7280;text-transform:uppercase;">Purchase</p>
            <p style="margin:0 0 4px;font-size:15px;font-weight:800;color:#111827;">${escapeHtml(itemName)}</p>
            <p style="margin:0;font-size:13px;color:#15803d;font-weight:700;">${escapeHtml(formatInrFromPaise(amountPaise))}</p>
          </td></tr>
        </table>
        <a href="${APP_URL}/dashboard" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">Open URPASS &rarr;</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

const PASS_TYPE_LABEL: Record<string, string> = {
  participant: "Participant",
  vip:         "VIP",
  speaker:     "Speaker",
  organizer:   "Organizer",
};

const PASS_TYPE_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  participant: { bg: "#f5f3ff", color: "#6D28D9", border: "#ddd6fe" },
  vip:         { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  speaker:     { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  organizer:   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
};

// Use hosted QR service — data:URI images are blocked by Gmail/Outlook
function qrUrl(data: string, size = 200) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=0a0a0a&margin=10&format=png`;
}

export async function sendPassEmail({
  to,
  attendeeName,
  eventName,
  eventDate,
  venue,
  passToken,
  passType = "participant",
}: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue: string;
  passToken: string;
  passType?: string;
}) {
  const passUrl = `${APP_URL}/pass/${passToken}`;

  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const shortCode = passToken.slice(0, 8).match(/.{1,4}/g)?.join("-").toUpperCase()
    ?? passToken.slice(0, 8).toUpperCase();

  const typeLabel = PASS_TYPE_LABEL[passType] ?? "Attendee";
  const typeColor = PASS_TYPE_COLOR[passType] ?? PASS_TYPE_COLOR.participant;
  const qrSrc     = qrUrl(passUrl, 200);

  await sendEmail({
    from: FROM,
    to,
    subject: `Your pass for ${eventName} is ready`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your Pass — ${eventName}</title>
</head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">

    <!-- Wordmark -->
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>

    <!-- Pass card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.14);">

      <!-- Purple header -->
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px 34px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Event Pass</p>
                <p style="margin:0 0 18px;font-size:21px;font-weight:800;color:#ffffff;line-height:1.3;">${eventName}</p>
                <p style="margin:0 0 5px;font-size:12px;color:rgba(255,255,255,0.7);">&#128197; ${formattedDate}</p>
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">&#128205; ${venue}</p>
              </td>
              <td width="90" valign="top" align="right">
                <span style="display:inline-block;background:${typeColor.bg};color:${typeColor.color};border:1px solid ${typeColor.border};font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;white-space:nowrap;">${typeLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Perforated divider -->
      <tr>
        <td style="padding:0 28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="18" style="background:#f0effe;height:18px;border-radius:0 0 10px 10px;"></td>
              <td style="border-top:2px dashed #e5e7eb;"></td>
              <td width="18" style="background:#f0effe;height:18px;border-radius:0 0 10px 10px;"></td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Attendee + QR -->
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:3px;color:#9ca3af;text-transform:uppercase;">Attendee</p>
          <p style="margin:0 0 4px;font-size:19px;font-weight:800;color:#0a0a0a;">${attendeeName}</p>
          <p style="margin:0 0 24px;font-size:12px;color:#9ca3af;">${to}</p>

          <!-- QR code via external service (works in all email clients) -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:14px;background:#fff;">
                <img src="${qrSrc}" width="180" height="180" alt="Entry QR Code" style="display:block;" />
              </td>
            </tr>
          </table>

          <p style="margin:14px 0 6px;font-size:11px;color:#d1d5db;font-family:'Courier New',monospace;letter-spacing:4px;">${shortCode}</p>
          <p style="margin:0;font-size:12px;color:#9ca3af;">Show this QR code at the entrance</p>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 32px 32px;">
          <a href="${passUrl}" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.2px;">
            View Full Pass &rarr;
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:18px 32px;background:#fafafa;border-radius:0 0 24px 24px;">
          <p style="margin:0;font-size:11px;color:#d1d5db;text-align:center;">
            This pass is personal &amp; non-transferable. Keep this email safe &mdash; the QR code is your entry ticket.
          </p>
        </td>
      </tr>

    </table>

    <p style="margin:20px 0 0;font-size:11px;color:#a78bfa;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>

  </td></tr>
</table>

</body>
</html>`.trim(),
  });
}

export async function sendApplicationConfirmationEmail({
  to,
  attendeeName,
  eventName,
  eventDate,
  venue,
}: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue: string;
}) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  await sendEmail({
    from: FROM,
    to,
    subject: `Application received — ${eventName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.1);">
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase;">URPASS</p>
          <p style="margin:0;font-size:21px;font-weight:800;color:#ffffff;">Application received</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">
            Hi <strong>${attendeeName}</strong>, thanks for applying to <strong>${eventName}</strong>.
            The organiser will review your application shortly.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border-radius:14px;border:1px solid #ede9fe;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:2px;color:#9ca3af;text-transform:uppercase;">Event details</p>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0a0a0a;">${eventName}</p>
                <p style="margin:0;font-size:13px;color:#6b7280;">&#128197; ${formattedDate}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">&#128205; ${venue}</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#9ca3af;">
            You&apos;ll receive your pass by email once approved. No action needed from your side.
          </p>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;border-radius:0 0 24px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#d1d5db;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

const ROLE_LABEL: Record<string, string> = {
  admin:         "Admin",
  event_manager: "Event Manager",
  checkin_staff: "Check-in Staff",
  viewer:        "Viewer",
};

export async function sendOrgInviteEmail({
  to,
  inviterName,
  orgName,
  role,
  inviteUrl,
}: {
  to: string;
  inviterName: string;
  orgName: string;
  role: string;
  inviteUrl: string;
}) {
  const roleLabel = ROLE_LABEL[role] ?? role;
  await sendEmail({
    from: FROM,
    to,
    subject: `You've been invited to join ${orgName} on URPASS`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Team Invitation</p>
          <p style="margin:0;font-size:21px;font-weight:800;color:#ffffff;">You&apos;re invited!</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">
            <strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> on URPASS as <strong>${roleLabel}</strong>.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border-radius:14px;border:1px solid #ede9fe;margin-bottom:20px;">
            <tr>
              <td style="padding:18px 24px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:2px;color:#9ca3af;text-transform:uppercase;">Your role</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#6D28D9;">${roleLabel}</p>
              </td>
            </tr>
          </table>
          <a href="${inviteUrl}" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
            Accept Invitation &rarr;
          </a>
          <p style="margin:14px 0 0;font-size:11px;color:#9ca3af;text-align:center;">
            This invite expires in 7 days. If you didn&apos;t expect this, you can safely ignore it.
          </p>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;border-radius:0 0 24px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#d1d5db;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendApprovalEmail({
  to,
  attendeeName,
  eventName,
  eventDate,
  venue,
}: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue: string;
}) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  await sendEmail({
    from: FROM,
    to,
    subject: `You're approved for ${eventName} — pass coming soon`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.1);">
      <tr>
        <td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);padding:30px 32px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.55);text-transform:uppercase;">URPASS</p>
          <p style="margin:0;font-size:21px;font-weight:800;color:#ffffff;">&#10003; You&apos;re approved!</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">
            Great news, <strong>${attendeeName}</strong>! Your application to <strong>${eventName}</strong> has been approved.
            Your entry pass will be sent to this email shortly.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:14px;border:1px solid #bbf7d0;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:2px;color:#9ca3af;text-transform:uppercase;">Event details</p>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0a0a0a;">${eventName}</p>
                <p style="margin:0;font-size:13px;color:#6b7280;">&#128197; ${formattedDate}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">&#128205; ${venue}</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#9ca3af;">
            Keep an eye on your inbox — your QR pass will arrive soon.
          </p>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;border-radius:0 0 24px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#d1d5db;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendEventReminderEmail({
  to,
  attendeeName,
  eventName,
  eventDate,
  startTime,
  venue,
  passToken,
  isOnline,
}: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  startTime?: string | null;
  venue: string;
  passToken: string;
  isOnline?: boolean;
}) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const passUrl = `${APP_URL}/pass/${passToken}`;
  const qrSrc = qrUrl(passUrl, 180);
  const timeStr = startTime ? ` at ${startTime}` : "";

  await sendEmail({
    from: FROM,
    to,
    subject: `Reminder: ${eventName} is coming up soon!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.55);text-transform:uppercase;">Event Reminder</p>
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">See you soon at ${escapeHtml(eventName)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 18px;font-size:14px;color:#374151;line-height:1.6;">
            Hi <strong>${escapeHtml(attendeeName)}</strong>, just a quick reminder that <strong>${escapeHtml(eventName)}</strong> is taking place on <strong>${formattedDate}${timeStr}</strong>.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border-radius:14px;border:1px solid #ede9fe;margin-bottom:20px;">
            <tr>
              <td style="padding:18px 22px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;color:#9ca3af;text-transform:uppercase;">When &amp; Where</p>
                <p style="margin:0 0 4px;font-size:15px;font-weight:800;color:#111827;">${formattedDate}${timeStr}</p>
                <p style="margin:0;font-size:13px;color:#6b7280;">&#128205; ${escapeHtml(venue)}</p>
              </td>
            </tr>
          </table>

          <div style="text-align:center;margin:24px 0 20px;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#6b7280;">Your Entry Pass</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:12px;background:#ffffff;">
                  <img src="${qrSrc}" width="160" height="160" alt="Entry QR Code" style="display:block;" />
                </td>
              </tr>
            </table>
          </div>

          <a href="${passUrl}" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
            ${isOnline ? "Access Live Pass & Meeting →" : "Open Digital Pass →"}
          </a>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;border-radius:0 0 24px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#d1d5db;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendPostEventThankYouEmail({
  to,
  attendeeName,
  eventName,
  eventId,
}: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventId: string;
}) {
  const feedbackUrl = `${APP_URL}/feedback/${eventId}`;

  await sendEmail({
    from: FROM,
    to,
    subject: `Thank you for attending ${eventName}!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0effe;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0effe;padding:40px 16px;">
  <tr><td align="center">
    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:4px;color:#9333ea;text-transform:uppercase;">URPASS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:30px 32px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.55);text-transform:uppercase;">Thank You</p>
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">Thank you for attending!</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
            Hi <strong>${escapeHtml(attendeeName)}</strong>, thank you for being a part of <strong>${escapeHtml(eventName)}</strong>.
          </p>
          <p style="margin:0 0 22px;font-size:14px;color:#4b5563;line-height:1.6;">
            We hope you had an inspiring experience! How was your time at the event? We&apos;d love to hear your feedback and suggestions.
          </p>
          <a href="${feedbackUrl}" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:15px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
            Share Event Feedback &rarr;
          </a>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;border-radius:0 0 24px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#d1d5db;">Powered by URPASS &middot; <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none;">urpass.space</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendInvoiceEmail({
  to,
  name,
  invoiceNumber,
  invoiceDate,
  itemName,
  subtotal,
  taxAmount,
  totalAmount,
  currency = "INR",
  isSample = false,
  pdfBytes,
}: {
  to: string;
  name?: string | null;
  invoiceNumber: string;
  invoiceDate: string;
  itemName: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency?: string;
  isSample?: boolean;
  pdfBytes?: Uint8Array;
}) {
  const safeName = escapeHtml(name || "there");
  const safeNumber = escapeHtml(invoiceNumber);
  const safeItem = escapeHtml(itemName);
  const formattedTotal = `${currency} ${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedSubtotal = `${currency} ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedTax = `${currency} ${taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const badgeText = isSample ? "SAMPLE TAX INVOICE" : "OFFICIAL TAX INVOICE";
  const subject = `${isSample ? "[Sample] " : ""}Tax Invoice ${invoiceNumber} — URPASS`;

  const attachments = pdfBytes
    ? [
        {
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ]
    : undefined;

  await sendEmail({
    from: FROM,
    to,
    subject,
    attachments,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f6f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ff;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(109,40,217,0.08);border:1px solid #ede9fe;">
      <tr>
        <td style="background:linear-gradient(135deg,#6D28D9 0%,#4c1d95 100%);padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:1.5px;background:rgba(255,255,255,0.18);color:#ffffff;text-transform:uppercase;">${badgeText}</span>
                <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.2;">Invoice ${safeNumber}</h1>
              </td>
              <td align="right" valign="top">
                <span style="font-size:18px;font-weight:900;letter-spacing:2px;color:#ffffff;">URPASS</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
            Hi <strong>${safeName}</strong>,
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
            ${isSample ? "Here is your sample invoice demonstration generated from URPASS." : "Thank you for your business! Your payment has been confirmed and your tax invoice is ready."}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcfaff;border-radius:14px;border:1px solid #ede9fe;margin-bottom:24px;overflow:hidden;">
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Invoice Number:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#111827;text-align:right;">${safeNumber}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Invoice Date:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(invoiceDate)}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Description:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:600;color:#111827;text-align:right;">${safeItem}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Taxable Amount:</td>
              <td style="padding:14px 18px;font-size:13px;color:#4b5563;text-align:right;">${formattedSubtotal}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">GST (18%):</td>
              <td style="padding:14px 18px;font-size:13px;color:#4b5563;text-align:right;">${formattedTax}</td>
            </tr>
            <tr style="background:#f5f3ff;">
              <td style="padding:16px 18px;font-size:13px;font-weight:700;color:#6D28D9;">Total Amount (Paid):</td>
              <td style="padding:16px 18px;font-size:16px;font-weight:800;color:#6D28D9;text-align:right;">${formattedTotal}</td>
            </tr>
          </table>

          <p style="margin:0 0 20px;font-size:12px;color:#6b7280;line-height:1.5;">
            The full official PDF tax invoice is attached to this email. You can also view and download all your past invoices at any time in your URPASS dashboard.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="${APP_URL}/billing" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
                  View Invoices in Dashboard &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            Yesp Corporation &middot; GSTIN: 33OPDPS9865F1Z3<br/>
            Tamil Nadu, India &middot; <a href="${APP_URL}" style="color:#6D28D9;text-decoration:none;">urpass.space</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendTrialStartedEmail({
  to,
  userName,
  planName,
  monthlyPricePaise,
  trialEndsAt,
}: {
  to: string;
  userName?: string | null;
  planName: string;
  monthlyPricePaise: number;
  trialEndsAt: string;
}) {
  const safeName = escapeHtml(userName || "there");
  const safePlan = escapeHtml(planName);
  const safeDate = escapeHtml(trialEndsAt);
  const monthlyTotalPaise = Math.round(monthlyPricePaise * 1.18);
  const formattedMonthly = formatInrFromPaise(monthlyTotalPaise);

  await sendEmail({
    from: FROM,
    to,
    subject: `Your 30-Day Free Trial of URPASS ${safePlan} is Active!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:36px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg, #1e1035, #6D28D9);padding:32px 32px 28px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#c4b5fd;">30-DAY FREE TRIAL ACTIVATED</p>
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">Welcome to URPASS ${safePlan}!</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:600;">Hi ${safeName},</p>
          <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
            Your 30-day free trial of <strong>URPASS ${safePlan}</strong> has started! You now have full access to all ${safePlan} features for the next 30 days.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcfaff;border-radius:14px;border:1px solid #ede9fe;margin-bottom:24px;overflow:hidden;">
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Plan:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#111827;text-align:right;">${safePlan}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Charged Today:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#16a34a;text-align:right;">₹0.00 (Free Trial)</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Free Trial Duration:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:600;color:#111827;text-align:right;">30 Days (until ${safeDate})</td>
            </tr>
            <tr style="background:#f5f3ff;">
              <td style="padding:16px 18px;font-size:13px;font-weight:700;color:#6D28D9;">First Renewal Charge:</td>
              <td style="padding:16px 18px;font-size:14px;font-weight:800;color:#6D28D9;text-align:right;">${formattedMonthly} on ${safeDate}</td>
            </tr>
          </table>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#166534;line-height:1.5;">
              <strong>AutoPay Confirmed:</strong> Your mandate is active. You will not be charged anything during your 30-day free trial. If you wish to cancel before the first payment, you can cancel anytime with one click in your billing settings.
            </p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="${APP_URL}/dashboard" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
                  Go to Your Dashboard &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            Tamil Nadu, India &middot; <a href="${APP_URL}" style="color:#6D28D9;text-decoration:none;">urpass.space</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}

export async function sendTrialReminderEmail({
  to,
  userName,
  planName,
  daysRemaining,
  trialEndsAt,
  monthlyPricePaise,
}: {
  to: string;
  userName?: string | null;
  planName: string;
  daysRemaining: number;
  trialEndsAt: string;
  monthlyPricePaise: number;
}) {
  const safeName = escapeHtml(userName || "there");
  const safePlan = escapeHtml(planName);
  const safeDate = escapeHtml(trialEndsAt);
  const monthlyTotalPaise = Math.round(monthlyPricePaise * 1.18);
  const formattedMonthly = formatInrFromPaise(monthlyTotalPaise);

  await sendEmail({
    from: FROM,
    to,
    subject: `Reminder: Your URPASS ${safePlan} trial ends in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:36px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg, #2d124d, #7c3aed);padding:32px 32px 28px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#ddd6fe;">TRIAL RENEWAL REMINDER</p>
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">
            ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left on your free trial
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:600;">Hi ${safeName},</p>
          <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
            This is a friendly reminder that your 30-day free trial of <strong>URPASS ${safePlan}</strong> will end on <strong>${safeDate}</strong> (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} from now).
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcfaff;border-radius:14px;border:1px solid #ede9fe;margin-bottom:24px;overflow:hidden;">
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Plan:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#111827;text-align:right;">${safePlan}</td>
            </tr>
            <tr style="border-bottom:1px solid #ede9fe;">
              <td style="padding:14px 18px;font-size:12px;color:#6b7280;">Trial Expiration:</td>
              <td style="padding:14px 18px;font-size:13px;font-weight:600;color:#111827;text-align:right;">${safeDate}</td>
            </tr>
            <tr style="background:#f5f3ff;">
              <td style="padding:16px 18px;font-size:13px;font-weight:700;color:#6D28D9;">Scheduled Renewal:</td>
              <td style="padding:16px 18px;font-size:14px;font-weight:800;color:#6D28D9;text-align:right;">${formattedMonthly}</td>
            </tr>
          </table>

          <p style="margin:0 0 24px;font-size:13px;color:#6b7280;line-height:1.6;">
            If you love using URPASS, you don&apos;t need to do anything &mdash; your subscription will continue seamlessly via AutoPay. If you don&apos;t wish to renew, you can cancel anytime before ${safeDate} in your billing settings and you will not be charged.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="${APP_URL}/billing" style="display:block;background:#6D28D9;color:#ffffff;text-align:center;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">
                  Manage Subscription in Billing Settings &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #f3f4f6;padding:16px 32px;background:#fafafa;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            Tamil Nadu, India &middot; <a href="${APP_URL}" style="color:#6D28D9;text-decoration:none;">urpass.space</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim(),
  });
}


