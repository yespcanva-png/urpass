/**
 * UrPass Corporate Email Design System
 * Principles:
 * - Minimal, Premium SaaS (Stripe / Linear / Notion aesthetic)
 * - Clean white background (#ffffff)
 * - Strong, crisp typography (-apple-system / Segoe UI)
 * - Single primary CTA
 * - Predictable visual hierarchy
 * - Universal email-client compatibility
 */

export interface CorporateEmailOptions {
  preheader?: string;
  heading: string;
  message: string;
  cta?: {
    label: string;
    url: string;
  };
  contextContentHtml?: string;
  secondaryInfo?: string;
  unsubscribeUrl?: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";

export function renderCorporateEmailHtml({
  preheader,
  heading,
  message,
  cta,
  contextContentHtml,
  secondaryInfo,
  unsubscribeUrl,
}: CorporateEmailOptions): string {
  const safePreheader = preheader
    ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>`
    : "";

  const ctaButtonHtml = cta
    ? `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 28px 0 32px 0;">
        <tr>
          <td align="left">
            <a href="${cta.url}"
               target="_blank"
               style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; line-height: 20px; text-decoration: none; padding: 12px 26px; border-radius: 8px; text-align: center; border: 1px solid #0f172a; letter-spacing: -0.2px;">
              ${cta.label} &rarr;
            </a>
          </td>
        </tr>
      </table>
    `
    : "";

  const contextBoxHtml = contextContentHtml
    ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin: 28px 0;">
        ${contextContentHtml}
      </div>
    `
    : "";

  const secondaryHtml = secondaryInfo
    ? `
      <div style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #64748b;">
        ${secondaryInfo}
      </div>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .content-cell {
        padding: 32px 0 !important;
      }
      .main-heading {
        font-size: 20px !important;
        line-height: 28px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #0f172a;">
  ${safePreheader}
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #f8fafc; padding: 36px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <tr>
            <td class="content-cell" style="padding: 40px 44px;">
              
              <!-- 1. UrPass Brand Wordmark -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                <tr>
                  <td align="left" style="padding-bottom: 32px;">
                    <a href="${APP_URL}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                      <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;">UrPass</span>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 2. Main Heading -->
              <h1 class="main-heading" style="margin: 0 0 14px 0; font-size: 24px; font-weight: 700; line-height: 32px; letter-spacing: -0.5px; color: #0f172a;">
                ${heading}
              </h1>

              <!-- 3. Supporting message -->
              <div style="font-size: 15px; line-height: 24px; color: #475569; margin: 0;">
                ${message}
              </div>

              <!-- 4. Primary CTA -->
              ${ctaButtonHtml}

              <!-- 5. Context / Feature Content -->
              ${contextBoxHtml}

              <!-- 6. Secondary information -->
              ${secondaryHtml}

              <!-- 7. Corporate Footer -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                <tr>
                  <td align="left" style="font-size: 12px; line-height: 18px; color: #94a3b8;">
                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">UrPass</p>
                    <p style="margin: 0 0 12px 0;">Event access, simplified.</p>
                    <p style="margin: 0;">
                      <a href="${APP_URL}/dashboard" style="color: #64748b; text-decoration: underline;">Dashboard</a>
                      <span style="padding: 0 6px;">&bull;</span>
                      <a href="${APP_URL}/privacy" style="color: #64748b; text-decoration: underline;">Privacy</a>
                      <span style="padding: 0 6px;">&bull;</span>
                      <a href="${unsubscribeUrl || `${APP_URL}/dashboard/settings`}" style="color: #64748b; text-decoration: underline;">Preferences</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
