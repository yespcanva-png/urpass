import { sendEmail } from "@/lib/email";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface SendJobApplicationConfirmationParams {
  candidateName?: string;
  applicantName?: string;
  candidateEmail?: string;
  applicantEmail?: string;
  jobTitle?: string;
  roleOrDepartment?: string;
  department?: string;
  applicationId?: string;
  applicationType?: string;
}

export async function sendJobApplicationConfirmationEmail(
  params: SendJobApplicationConfirmationParams
): Promise<boolean> {
  const candidateName = params.candidateName || params.applicantName || "Applicant";
  const candidateEmail = params.candidateEmail || params.applicantEmail || "";
  const jobTitle = params.jobTitle || params.roleOrDepartment || "General Application";
  const department = params.department || params.roleOrDepartment || "General";
  const applicationId = params.applicationId || `APP-${Date.now().toString(36).toUpperCase()}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Received — UrPass Careers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0a10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0a10; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background: #13111c; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #6200EE 0%, #3700B3 100%); padding: 32px 36px;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.8);">UrPass Careers</p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">We Received Your Application</h1>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                Hi <strong>${escapeHtml(candidateName)}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for your interest in building the future of event technology with <strong>UrPass</strong>. We have securely received your application details for:
              </p>

              <!-- Application Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 24px; padding: 18px 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #a78bfa;">Applied Position</p>
                    <p style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: #ffffff;">${escapeHtml(jobTitle)}</p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      Department: <strong style="color: #e2e8f0;">${escapeHtml(department)}</strong> &middot; Ref: <span style="font-family: monospace; color: #c4b5fd;">${escapeHtml(applicationId.slice(0, 8))}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">
                What happens next?
              </p>
              <ul style="margin: 0 0 28px 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #cbd5e1;">
                <li>Our engineering and operations team reviews every candidate profile thoughtfully.</li>
                <li>If your background aligns with our open roadmap challenges, we will reach out directly via email to coordinate a casual technical conversation.</li>
                <li>Even if this specific opening is not an exact match, we retain your details for upcoming growth batches.</li>
              </ul>

              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="https://urpass.space/careers" style="display: inline-block; background: #6200EE; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 10px;">
                  Explore More at UrPass &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                &copy; 2026 URPASS by Yesp Corporation &middot; Bengaluru, India &middot; <a href="https://urpass.space/privacy" style="color: #a78bfa; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await sendEmail({
      to: candidateEmail,
      subject: `UrPass Application Received: ${jobTitle}`,
      html,
      text: `Hi ${candidateName},\n\nThank you for applying to UrPass for the position: ${jobTitle} (${department}).\n\nWe have received your application (Ref: ${applicationId.slice(0, 8)}) and our team will review it thoughtfully.\n\nBest regards,\nThe UrPass Team\nhttps://urpass.space/careers`,
    });
    return true;
  } catch (err) {
    console.warn("[careers-email] Failed to send candidate acknowledgement email:", err);
    return false;
  }
}

export interface NotifyAdminNewJobApplicationParams {
  candidateName?: string;
  applicantName?: string;
  candidateEmail?: string;
  applicantEmail?: string;
  phone?: string | null;
  jobTitle?: string;
  roleOrDepartment?: string;
  department?: string;
  applicationType?: string;
  yearsOfExperience?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
  coverNote?: string;
  whyUrpass?: string;
  applicationId?: string;
}

export async function notifyAdminNewJobApplication(
  params: NotifyAdminNewJobApplicationParams
): Promise<boolean> {
  const candidateName = params.candidateName || params.applicantName || "Applicant";
  const candidateEmail = params.candidateEmail || params.applicantEmail || "";
  const phone = params.phone;
  const jobTitle = params.jobTitle || params.roleOrDepartment || "General Application";
  const department = params.department || params.roleOrDepartment || "General";
  const applicationType = params.applicationType || "job";
  const yearsOfExperience = params.yearsOfExperience;
  const linkedinUrl = params.linkedinUrl;
  const portfolioUrl = params.portfolioUrl;
  const resumeUrl = params.resumeUrl;
  const coverNote = params.coverNote || params.whyUrpass || "";
  const applicationId = params.applicationId || `APP-${Date.now().toString(36).toUpperCase()}`;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "ops@urpass.space";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Job Application — ${escapeHtml(candidateName)}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; padding: 28px;">
    <div style="border-bottom: 2px solid #6200EE; padding-bottom: 16px; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 700; color: #6200EE; text-transform: uppercase; letter-spacing: 1.5px;">UrPass Recruitment Alert</span>
      <h2 style="margin: 6px 0 0 0; font-size: 20px; color: #0f172a;">New Application: ${escapeHtml(jobTitle)}</h2>
    </div>

    <table width="100%" style="font-size: 13px; line-height: 1.6; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; width: 140px;">Candidate:</td>
        <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${escapeHtml(candidateName)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Email:</td>
        <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(candidateEmail)}" style="color: #6200EE;">${escapeHtml(candidateEmail)}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding: 6px 0; color: #64748b;">Phone:</td><td style="padding: 6px 0;">${escapeHtml(phone)}</td></tr>` : ""}
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Department:</td>
        <td style="padding: 6px 0;">${escapeHtml(department)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b;">Type:</td>
        <td style="padding: 6px 0;">${escapeHtml(applicationType)}</td>
      </tr>
      ${yearsOfExperience ? `<tr><td style="padding: 6px 0; color: #64748b;">Experience:</td><td style="padding: 6px 0;">${escapeHtml(yearsOfExperience)}</td></tr>` : ""}
      ${linkedinUrl ? `<tr><td style="padding: 6px 0; color: #64748b;">LinkedIn:</td><td style="padding: 6px 0;"><a href="${escapeHtml(linkedinUrl)}" target="_blank" style="color: #6200EE;">${escapeHtml(linkedinUrl)}</a></td></tr>` : ""}
      ${portfolioUrl ? `<tr><td style="padding: 6px 0; color: #64748b;">Portfolio/GitHub:</td><td style="padding: 6px 0;"><a href="${escapeHtml(portfolioUrl)}" target="_blank" style="color: #6200EE;">${escapeHtml(portfolioUrl)}</a></td></tr>` : ""}
      ${resumeUrl ? `<tr><td style="padding: 6px 0; color: #64748b;">Resume PDF:</td><td style="padding: 6px 0;"><a href="${escapeHtml(resumeUrl)}" target="_blank" style="display: inline-block; background: #6200EE; color: #ffffff; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 11px;">View Resume PDF &rarr;</a></td></tr>` : ""}
    </table>

    <div style="background: #f1f5f9; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Candidate Note / Why UrPass:</p>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(coverNote)}</p>
    </div>

    <div style="text-align: right; border-top: 1px solid #e2e8f0; padding-top: 14px;">
      <a href="https://urpass.space/ops" style="font-size: 12px; font-weight: 700; color: #6200EE; text-decoration: none;">
        Open Ops Command Center &rarr;
      </a>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await sendEmail({
      to: adminEmail,
      subject: `[Careers] New Application: ${candidateName} — ${jobTitle}`,
      html,
      text: `New Job Application Received:\n\nCandidate: ${candidateName} (${candidateEmail})\nRole: ${jobTitle} (${department})\nExperience: ${yearsOfExperience || "N/A"}\nLinkedIn: ${linkedinUrl || "N/A"}\nResume: ${resumeUrl || "N/A"}\n\nNote:\n${coverNote}\n\nReview in Ops: https://urpass.space/ops`,
    });
    return true;
  } catch (err) {
    console.warn("[careers-email] Failed to send admin recruitment notification email:", err);
    return false;
  }
}
