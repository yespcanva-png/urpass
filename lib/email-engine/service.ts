import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getFromEmail, isEmailProviderConfigured, sendEmail } from "@/lib/email";
import {
  EMAIL_TEMPLATES_CATALOG,
  EmailTemplateSlug,
  WelcomeEmailData,
  ActivationEmailData,
  IncompleteEventEmailData,
  SubscriptionEmailData,
  PaymentFailedEmailData,
  WhatsNewEmailData,
  OfferEmailData,
} from "./templates";

function getAdminClient() {
  if (process.env.NODE_ENV === "test") return null;
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export interface DispatchEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Core Communication Engine Service
 */
export class CommunicationEngineService {
  /**
   * Check if a recipient has opted out of a category
   */
  async isOptedOut(
    email: string,
    category: "product_updates" | "lifecycle_reminders" | "marketing_offers"
  ): Promise<boolean> {
    const admin = getAdminClient();
    if (!admin) return false;

    try {
      const { data, error } = await admin
        .from("email_preferences")
        .select(category)
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (error || !data) return false;
      return (data as Record<string, boolean>)[category] === false;
    } catch {
      return false;
    }
  }

  /**
   * Log email delivery into email_delivery_logs (and communication_deliveries if event-related)
   */
  private async logDelivery({
    recipientEmail,
    templateSlug,
    subject,
    status,
    providerMessageId,
    errorMessage,
    userId,
    metadata = {},
  }: {
    recipientEmail: string;
    templateSlug: string;
    subject: string;
    status: "queued" | "sent" | "delivered" | "failed" | "suppressed";
    providerMessageId?: string;
    errorMessage?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const admin = getAdminClient();
    if (!admin) return;

    try {
      await admin.from("email_delivery_logs").insert({
        user_id: userId || null,
        recipient_email: recipientEmail,
        template_slug: templateSlug,
        subject,
        status,
        provider: metadata?.provider ? String(metadata.provider) : "zeptomail",
        provider_message_id: providerMessageId || null,
        error_message: errorMessage || null,
        metadata,
      });
    } catch {
      // Safe fallback if migration 059 hasn't run yet in Supabase
    }
  }

  /**
   * Raw dispatch helper
   */
  async dispatchEmail({
    to,
    subject,
    html,
    templateSlug,
    userId,
    metadata = {},
  }: {
    to: string;
    subject: string;
    html: string;
    templateSlug: EmailTemplateSlug;
    userId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<DispatchEmailResult> {
    const from = getFromEmail();

    if (!isEmailProviderConfigured()) {
      console.log(
        `[CommunicationEngine] email provider missing/mock. Simulated dispatch:`,
        { to, subject, templateSlug }
      );
      await this.logDelivery({
        recipientEmail: to,
        templateSlug,
        subject,
        status: "sent",
        providerMessageId: `sim_${Date.now()}`,
        userId,
        metadata: { ...metadata, simulated: true, provider: "simulated" },
      });
      return { success: true, simulated: true, messageId: `sim_${Date.now()}` };
    }

    try {
      const response = await sendEmail({
        from,
        to,
        subject,
        html,
      });

      const messageId = response?.id;
      const provider = response?.provider || "zeptomail";
      await this.logDelivery({
        recipientEmail: to,
        templateSlug,
        subject,
        status: "sent",
        providerMessageId: messageId,
        userId,
        metadata: { ...metadata, provider },
      });

      return { success: true, messageId };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to dispatch email";
      await this.logDelivery({
        recipientEmail: to,
        templateSlug,
        subject,
        status: "failed",
        errorMessage: errorMsg,
        userId,
        metadata,
      });
      return { success: false, error: errorMsg };
    }
  }

  /* ------------------------------------------------------------------ */
  /* Production Release Lifecycle Methods                              */
  /* ------------------------------------------------------------------ */

  /**
   * 1. Send Welcome Email
   */
  async sendWelcomeEmail(to: string, data: WelcomeEmailData, userId?: string) {
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.welcome.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "welcome",
      userId,
      metadata: { name: data.name },
    });
  }

  /**
   * 2. Send First Event Activation Email
   */
  async sendActivationEmail(to: string, data: ActivationEmailData, userId?: string) {
    const isSuppressed = await this.isOptedOut(to, "lifecycle_reminders");
    if (isSuppressed) {
      return { success: true, simulated: true, error: "Opted out" };
    }
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.activation.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "activation",
      userId,
      metadata: { name: data.name },
    });
  }

  /**
   * 3. Send Incomplete Event Setup Reminder
   */
  async sendIncompleteEventEmail(to: string, data: IncompleteEventEmailData, userId?: string) {
    const isSuppressed = await this.isOptedOut(to, "lifecycle_reminders");
    if (isSuppressed) {
      return { success: true, simulated: true, error: "Opted out" };
    }
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.incomplete_event.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "incomplete_event",
      userId,
      metadata: { eventId: data.eventId, eventName: data.eventName },
    });
  }

  /**
   * 4. Send Subscription / Plan Activated Email
   */
  async sendSubscriptionEmail(to: string, data: SubscriptionEmailData, userId?: string) {
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.subscription.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "subscription",
      userId,
      metadata: { planName: data.planName, cycle: data.billingCycle },
    });
  }

  /**
   * 5. Send Payment Failed Email
   */
  async sendPaymentFailedEmail(to: string, data: PaymentFailedEmailData, userId?: string) {
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.payment_failed.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "payment_failed",
      userId,
      metadata: { planName: data.planName, amountDue: data.amountDueFormatted },
    });
  }

  /**
   * 6. Send What's New / Product Update
   */
  async sendWhatsNewEmail(to: string, data: WhatsNewEmailData, userId?: string) {
    const isSuppressed = await this.isOptedOut(to, "product_updates");
    if (isSuppressed) {
      return { success: true, simulated: true, error: "Opted out" };
    }
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.whats_new.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "whats_new",
      userId,
      metadata: { featureTitle: data.featureTitle },
    });
  }

  /**
   * 7. Send Offer / Plan Upgrade Email
   */
  async sendOfferEmail(to: string, data: OfferEmailData, userId?: string) {
    const isSuppressed = await this.isOptedOut(to, "marketing_offers");
    if (isSuppressed) {
      return { success: true, simulated: true, error: "Opted out" };
    }
    const { subject, html } = EMAIL_TEMPLATES_CATALOG.offer.render(data);
    return this.dispatchEmail({
      to,
      subject,
      html,
      templateSlug: "offer",
      userId,
      metadata: { targetPlan: data.targetPlan, promoCode: data.promoCode },
    });
  }
}

export const communicationEngine = new CommunicationEngineService();
