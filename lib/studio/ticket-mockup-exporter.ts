import QRCode from "qrcode";
import type { StudioTemplateDefinition } from "./templates";

export interface TicketMockupData {
  template: StudioTemplateDefinition;
  eventName: string;
  hostName?: string;
  venue?: string;
  date?: string;
  attendeeName?: string;
  ticketId?: string;
  logoUrl?: string;
}

/**
 * Loads an image from a URL or data URI safely into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Helper to draw rounded rectangle
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generates a photorealistic 2x Retina canvas rendering of the customized pass
 */
export async function exportTicketMockupCanvas(
  data: TicketMockupData
): Promise<HTMLCanvasElement> {
  const {
    template,
    eventName,
    hostName = "URPASS PRESENTS",
    venue = "Palace Grounds, Main Arena",
    date = "24 OCT 2026 · 09:30 AM IST",
    attendeeName = "ARJUN KUMAR",
    ticketId = "#URP-90284",
    logoUrl,
  } = data;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire canvas 2D context");

  // Generate QR Code data URL
  const verifyUrl = `https://urpass.space/verify?token=demo-${encodeURIComponent(
    eventName.toLowerCase().replace(/[^a-z0-9]/g, "-")
  )}-${Date.now().toString(36)}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 320,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
  const qrImg = await loadImage(qrDataUrl);

  // Optional custom logo
  let customLogoImg: HTMLImageElement | null = null;
  if (logoUrl) {
    try {
      customLogoImg = await loadImage(logoUrl);
    } catch {
      customLogoImg = null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1. DIGITAL MOBILE PASS FORMAT (800 x 1400 at 2x)
  // ─────────────────────────────────────────────────────────────
  if (template.format === "digital") {
    canvas.width = 800;
    canvas.height = 1420;

    const isLight = template.thumbnailBg === "#FFFFFF" || template.thumbnailBg === "#F8FAFC";
    const bg = template.thumbnailBg;
    const textColor = isLight ? "#09090B" : "#FFFFFF";
    const subtextColor = isLight ? "#71717A" : "#A1A1AA";

    // Outer stage background
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle ambient glow behind pass
    const grad = ctx.createRadialGradient(400, 710, 100, 400, 710, 600);
    grad.addColorStop(0, isLight ? "rgba(99, 102, 241, 0.25)" : `${bg}80`);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pass Container Chassis
    const px = 60;
    const py = 60;
    const pw = 680;
    const ph = 1240;
    const radius = 48;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    drawRoundedRect(ctx, px, py, pw, ph, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();

    // Border line
    ctx.lineWidth = 2;
    ctx.strokeStyle = isLight ? "#E4E4E7" : "rgba(255, 255, 255, 0.15)";
    drawRoundedRect(ctx, px, py, pw, ph, radius);
    ctx.stroke();

    // Smartphone Dynamic Island notch
    drawRoundedRect(ctx, 330, 84, 140, 20, 10);
    ctx.fillStyle = "#000000";
    ctx.fill();

    // Top Header: Host / College Name
    ctx.fillStyle = subtextColor;
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(hostName.toUpperCase(), 400, 150);

    // Event Logo or Category Badge
    if (customLogoImg) {
      const logoW = 64;
      const logoH = 64;
      ctx.drawImage(customLogoImg, 400 - logoW / 2, 170, logoW, logoH);
    } else {
      drawRoundedRect(ctx, 310, 175, 180, 36, 18);
      ctx.fillStyle = isLight ? "#F4F4F5" : "rgba(255, 255, 255, 0.12)";
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.font = "800 16px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`★ ${template.category.toUpperCase()} PASS ★`, 400, 199);
    }

    // Event Title
    ctx.fillStyle = textColor;
    ctx.font = "900 44px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";

    // Multi-line event title wrapping
    const words = eventName.toUpperCase().split(" ");
    let line1 = "";
    let line2 = "";
    for (const w of words) {
      if ((line1 + w).length < 24) {
        line1 += (line1 ? " " : "") + w;
      } else {
        line2 += (line2 ? " " : "") + w;
      }
    }
    ctx.fillText(line1, 400, 275);
    if (line2) {
      ctx.fillText(line2, 400, 325);
    }

    // Date & Venue
    ctx.fillStyle = isLight ? "#6366F1" : "#A78BFA";
    ctx.font = "700 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(date.toUpperCase(), 400, line2 ? 375 : 340);

    ctx.fillStyle = subtextColor;
    ctx.font = "500 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(venue, 400, line2 ? 410 : 375);

    // Center QR Card Container
    const qrBoxSize = 360;
    const qx = 400 - qrBoxSize / 2;
    const qy = 450;
    drawRoundedRect(ctx, qx, qy, qrBoxSize, qrBoxSize, 28);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#E4E4E7";
    ctx.stroke();

    // Draw QR code inside white card
    ctx.drawImage(qrImg, qx + 30, qy + 25, 300, 300);

    // Micro Scan Label
    ctx.fillStyle = "#18181B";
    ctx.font = "bold 15px monospace";
    ctx.fillText("⚡ SUB-0.3s CAMERA GATE SCAN", 400, qy + qrBoxSize - 12);

    // Attendee Credential Card
    const cardY = 850;
    drawRoundedRect(ctx, 100, cardY, 600, 160, 24);
    ctx.fillStyle = isLight ? "#F4F4F5" : "rgba(255, 255, 255, 0.08)";
    ctx.fill();
    ctx.strokeStyle = isLight ? "#E4E4E7" : "rgba(255, 255, 255, 0.15)";
    ctx.stroke();

    ctx.fillStyle = subtextColor;
    ctx.font = "700 16px -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ATTENDEE PASS HOLDER", 130, cardY + 45);

    ctx.fillStyle = textColor;
    ctx.font = "900 32px -apple-system, sans-serif";
    ctx.fillText(attendeeName.toUpperCase(), 130, cardY + 90);

    ctx.fillStyle = isLight ? "#10B981" : "#34D399";
    ctx.font = "bold 20px monospace";
    ctx.fillText("VIP ALL ACCESS • ZONE A", 130, cardY + 130);

    ctx.textAlign = "right";
    ctx.fillStyle = subtextColor;
    ctx.font = "bold 20px monospace";
    ctx.fillText(ticketId, 670, cardY + 90);

    // Bottom Security Banner
    ctx.textAlign = "center";
    ctx.fillStyle = subtextColor;
    ctx.font = "600 16px monospace";
    ctx.fillText("🔒 256-BIT CRYPTO GATE VERIFICATION · NON-TRANSFERABLE", 400, 1060);

    // Watermark / Viral Attribution Footer
    ctx.fillStyle = "#A1A1AA";
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Official Event Pass Powered by URPASS.space", 400, 1360);

    return canvas;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PRINTABLE CONCERT & SPORTS STUB TICKET (1560 x 680 at 2x)
  // ─────────────────────────────────────────────────────────────
  if (template.format === "printable") {
    canvas.width = 1560;
    canvas.height = 760;

    const bg = template.thumbnailBg;
    const isLight = bg === "#FFFFFF" || bg === "#FEF3C7";
    const textColor = isLight ? "#18181B" : "#FFFFFF";
    const subtextColor = isLight ? "#71717A" : "#9CA3AF";

    // Outer canvas background
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ticket body coordinates
    const tx = 50;
    const ty = 50;
    const tw = 1460;
    const th = 600;
    const radius = 32;

    // Draw main ticket container
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    drawRoundedRect(ctx, tx, ty, tw, th, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();

    // Divider line position (70% split)
    const divX = tx + Math.floor(tw * 0.72);

    // Semicircular Perforation Notch Cutouts
    const notchR = 30;
    // Top notch
    ctx.fillStyle = "#0A0A0C";
    ctx.beginPath();
    ctx.arc(divX, ty, notchR, 0, Math.PI);
    ctx.fill();

    // Bottom notch
    ctx.beginPath();
    ctx.arc(divX, ty + th, notchR, Math.PI, 0);
    ctx.fill();

    // Perforated Dashed Line
    ctx.strokeStyle = isLight ? "#D4D4D8" : "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(divX, ty + notchR);
    ctx.lineTo(divX, ty + th - notchR);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── LEFT SIDE: Main Event Information ──
    const leftX = tx + 50;

    // Header Category Badge
    ctx.fillStyle = "#EC4899";
    ctx.font = "800 20px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${hostName.toUpperCase()} // LIVE TOUR 2026`, leftX, ty + 70);

    // Event Title
    ctx.fillStyle = textColor;
    ctx.font = "900 52px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(eventName.toUpperCase(), leftX, ty + 140);

    // Date & Time
    ctx.fillStyle = isLight ? "#6366F1" : "#A78BFA";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(date.toUpperCase(), leftX, ty + 200);

    // Venue
    ctx.fillStyle = subtextColor;
    ctx.font = "500 24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`📍 ${venue}`, leftX, ty + 245);

    // Attendee Box on Ticket
    drawRoundedRect(ctx, leftX, ty + 300, 920, 190, 20);
    ctx.fillStyle = isLight ? "#F4F4F5" : "rgba(255,255,255,0.08)";
    ctx.fill();

    ctx.fillStyle = subtextColor;
    ctx.font = "700 18px -apple-system, sans-serif";
    ctx.fillText("PASS HOLDER", leftX + 40, ty + 350);
    ctx.fillText("SEATING / ADMISSION", leftX + 500, ty + 350);

    ctx.fillStyle = textColor;
    ctx.font = "900 36px -apple-system, sans-serif";
    ctx.fillText(attendeeName.toUpperCase(), leftX + 40, ty + 405);

    ctx.fillStyle = "#10B981";
    ctx.font = "bold 26px monospace";
    ctx.fillText("ZONE A • ROW 1 • SEAT 42", leftX + 500, ty + 405);

    // ── RIGHT SIDE: Admit One Tear-off Stub ──
    const stubCenter = divX + (tx + tw - divX) / 2;

    ctx.textAlign = "center";
    ctx.fillStyle = "#EC4899";
    ctx.font = "900 28px monospace";
    ctx.fillText("ADMIT ONE", stubCenter, ty + 80);

    // Stub QR Code
    const sqrSize = 220;
    const sqrX = stubCenter - sqrSize / 2;
    const sqrY = ty + 110;
    drawRoundedRect(ctx, sqrX, sqrY, sqrSize, sqrSize, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.drawImage(qrImg, sqrX + 15, sqrY + 15, 190, 190);

    // Striped Barcode simulation
    const barPatterns = [3, 1, 4, 2, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 4, 2];
    const bx = stubCenter - 130;
    const by = ty + 370;
    const bh = 50;

    let currX = bx;
    ctx.fillStyle = isLight ? "#000000" : "#FFFFFF";
    for (let i = 0; i < barPatterns.length; i++) {
      const w = barPatterns[i] * 2;
      if (i % 2 === 0) {
        ctx.fillRect(currX, by, w, bh);
      }
      currX += w + 2;
    }

    ctx.font = "bold 18px monospace";
    ctx.fillStyle = subtextColor;
    ctx.fillText(ticketId, stubCenter, by + bh + 30);
    ctx.font = "600 14px monospace";
    ctx.fillText("TEAR FOR GATE ENTRY", stubCenter, ty + th - 40);

    // Bottom Watermark
    ctx.fillStyle = "#A1A1AA";
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Designed on URPASS.space · Zero-Fee Event Registration & Sub-0.3s Camera Check-in", canvas.width / 2, 700);

    return canvas;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CONFERENCE & FESTIVAL LANYARD BADGE (880 x 1320 at 2x)
  // ─────────────────────────────────────────────────────────────
  canvas.width = 880;
  canvas.height = 1380;

  const bg = template.thumbnailBg;
  const isLight = bg === "#FFFFFF";
  const textColor = isLight ? "#18181B" : "#FFFFFF";

  // Canvas background
  ctx.fillStyle = "#0A0A0C";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bx = 60;
  const by = 60;
  const bw = 760;
  const bh = 1180;
  const radius = 40;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  drawRoundedRect(ctx, bx, by, bw, bh, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.restore();

  // Top Lanyard Slot Punch Hole (Cutout)
  const slotW = 160;
  const slotH = 28;
  const slotX = 440 - slotW / 2;
  const slotY = by + 28;
  drawRoundedRect(ctx, slotX, slotY, slotW, slotH, slotH / 2);
  ctx.fillStyle = "#0A0A0C";
  ctx.fill();

  // Conference Banner
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("OFFICIAL DELEGATE BADGE · 2026", 440, by + 105);

  ctx.fillStyle = textColor;
  ctx.font = "900 46px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(eventName.toUpperCase(), 440, by + 170);

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "600 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`${date} · ${venue}`, 440, by + 215);

  // Giant Attendee Name Card (White badge insert)
  const whiteCardY = by + 270;
  const whiteCardH = 480;
  drawRoundedRect(ctx, bx + 40, whiteCardY, bw - 80, whiteCardH, 32);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 20;

  // Custom Logo inside badge insert if available
  if (customLogoImg) {
    const lSize = 64;
    ctx.drawImage(customLogoImg, 440 - lSize / 2, whiteCardY + 30, lSize, lSize);
  }

  ctx.fillStyle = "#71717A";
  ctx.font = "bold 18px monospace";
  ctx.fillText("ATTENDEE CREDENTIAL", 440, whiteCardY + (customLogoImg ? 125 : 65));

  // Big 5-Meter Visible Name
  ctx.fillStyle = "#09090B";
  ctx.font = "900 56px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(attendeeName.toUpperCase(), 440, whiteCardY + (customLogoImg ? 195 : 145));

  // Organization / College
  ctx.fillStyle = "#4B5563";
  ctx.font = "700 28px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(hostName, 440, whiteCardY + (customLogoImg ? 245 : 205));

  // Role Pill
  drawRoundedRect(ctx, 290, whiteCardY + (customLogoImg ? 295 : 265), 300, 60, 30);
  ctx.fillStyle = "#6D28D9";
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 24px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SPEAKER / ALL ACCESS", 440, whiteCardY + (customLogoImg ? 335 : 305));

  // QR Code & NFC Bottom Zone
  const bqrSize = 220;
  const bqrX = 140;
  const bqrY = by + 800;
  drawRoundedRect(ctx, bqrX, bqrY, bqrSize, bqrSize, 24);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.drawImage(qrImg, bqrX + 15, bqrY + 15, 190, 190);

  ctx.textAlign = "left";
  ctx.fillStyle = textColor;
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("NFC TAP / GATE SCAN", 400, bqrY + 60);

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Sub-0.3s Instant Camera Scan", 400, bqrY + 100);

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 24px monospace";
  ctx.fillText(ticketId, 400, bqrY + 145);

  // Watermark
  ctx.textAlign = "center";
  ctx.fillStyle = "#A1A1AA";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Designed on URPASS.space · Digital & Printed Pass Engine", 440, 1310);

  return canvas;
}

/**
 * Downloads the high-resolution PNG mockup file to user's computer
 */
export async function downloadTicketMockup(
  data: TicketMockupData,
  filename?: string
): Promise<void> {
  const canvas = await exportTicketMockupCanvas(data);
  const dataUrl = canvas.toDataURL("image/png");

  const safeName = data.eventName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "urpass";
  const finalFilename = filename || `${safeName}-ticket-mockup.png`;

  const link = document.createElement("a");
  link.download = finalFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies the ticket mockup PNG image directly to clipboard
 */
export async function copyTicketMockupToClipboard(
  data: TicketMockupData
): Promise<boolean> {
  try {
    const canvas = await exportTicketMockupCanvas(data);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, "image/png");
    });
  } catch {
    return false;
  }
}
