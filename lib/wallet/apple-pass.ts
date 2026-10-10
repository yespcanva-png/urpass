import fs from "fs";
import path from "path";
import { PKPass } from "passkit-generator";

export interface ApplePassInput {
  passToken: string;
  ticketId?: string;
  eventName: string;
  eventDate?: string | null;
  venue?: string | null;
  attendeeName: string;
  passType?: string | null;
  categoryName?: string | null;
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoText?: string;
}

/**
 * Checks if all required Apple Wallet signing certificates are present in environment variables.
 */
export function isAppleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_PASS_TYPE_ID &&
    process.env.APPLE_PASS_TEAM_ID &&
    process.env.APPLE_PASS_CERT_BASE64 &&
    process.env.APPLE_PASS_KEY_BASE64 &&
    process.env.APPLE_PASS_WWDR_BASE64
  );
}

/**
 * Generates an Apple Wallet .pkpass buffer.
 * If credentials are missing, returns null so caller can handle fallback.
 */
export async function generateAppleWalletPass(
  input: ApplePassInput
): Promise<Buffer | null> {
  if (!isAppleWalletConfigured()) {
    return null;
  }

  try {
    const cert = Buffer.from(process.env.APPLE_PASS_CERT_BASE64!, "base64");
    const key = Buffer.from(process.env.APPLE_PASS_KEY_BASE64!, "base64");
    const wwdr = Buffer.from(process.env.APPLE_PASS_WWDR_BASE64!, "base64");
    const passphrase = process.env.APPLE_PASS_KEY_PASSWORD || undefined;

    // Load standard icon asset from public/icon.png
    const iconPath = path.join(process.cwd(), "public", "icon.png");
    let iconBuffer: Buffer | null = null;
    if (fs.existsSync(iconPath)) {
      iconBuffer = fs.readFileSync(iconPath);
    }

    const pass = new PKPass(
      {},
      {
        signerCert: cert,
        signerKey: key,
        wwdr,
        signerKeyPassphrase: passphrase,
      },
      {
        passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
        teamIdentifier: process.env.APPLE_PASS_TEAM_ID!,
        organizationName: input.logoText || "UrPass",
        description: input.eventName,
        backgroundColor: input.backgroundColor,
        foregroundColor: input.foregroundColor,
        labelColor: input.labelColor,
      }
    );

    pass.type = "eventTicket";

    pass.headerFields.push({
      key: "eventHeader",
      label: "EVENT",
      value: input.eventName,
    });

    // Primary field (Attendee name)
    pass.primaryFields.push({
      key: "attendee",
      label: "ATTENDEE",
      value: input.attendeeName,
    });

    // Secondary fields (Tier / Type & Date)
    pass.secondaryFields.push(
      {
        key: "passType",
        label: "TIER",
        value: input.categoryName || input.passType || "General Admission",
      },
      {
        key: "eventDate",
        label: "DATE",
        value: input.eventDate
          ? new Date(input.eventDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Confirmed",
      }
    );

    // Auxiliary fields (Ticket ID & Venue)
    pass.auxiliaryFields.push(
      {
        key: "ticketId",
        label: "TICKET ID",
        value: input.ticketId || input.passToken.slice(0, 8).toUpperCase(),
      },
      {
        key: "venue",
        label: "VENUE",
        value: input.venue || "Event Venue",
      }
    );

    // Back fields (Important Terms / URL)
    pass.backFields.push(
      {
        key: "terms",
        label: "ENTRY RULES",
        value:
          "Keep this QR pass ready at the gate. This pass is non-transferable once scanned unless reassigned by the organizer.",
      },
      {
        key: "passUrl",
        label: "WEB PASS URL",
        value: `https://urpass.space/pass/${input.passToken}`,
      }
    );

    // Barcode / QR Code
    pass.setBarcodes({
      message: input.passToken,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });

    // Add icon assets if available
    if (iconBuffer) {
      pass.addBuffer("icon.png", iconBuffer);
      pass.addBuffer("icon@2x.png", iconBuffer);
      pass.addBuffer("logo.png", iconBuffer);
      pass.addBuffer("logo@2x.png", iconBuffer);
    }

    const passBuffer = pass.getAsBuffer();
    return passBuffer;
  } catch (err) {
    console.error("[AppleWallet] Failed to generate .pkpass:", err);
    return null;
  }
}
