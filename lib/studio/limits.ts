import {
  type TicketDesignConfig,
  type TicketTemplate,
  type TicketShape,
  sanitizeTicketDesign,
  DEFAULT_TICKET_DESIGN,
} from "@/lib/pass-design";
import type { PlanSlug } from "@/lib/plan";

export interface StudioPlanLimits {
  planTier: PlanSlug;
  isPro: boolean;
  isStarter: boolean;
  isFree: boolean;
  canCustomPassDesign: boolean;
  canRemoveBranding: boolean;
  canUploadBackground: boolean;
  canUploadSponsorLogo: boolean;
  canUseAllTemplates: boolean;
  allowedTemplates: TicketTemplate[];
  canUseCustomShapes: boolean;
  allowedShapes: TicketShape[];
  canUseCategoryColors: boolean;
  canExportSvg: boolean;
  canSendUnlimitedTestEmails: boolean;
  maxDynamicFields: number;
}

const PRO_TIERS = new Set<string>([
  "pro",
  "business",
  "campus",
  "founder",
  "lifetime",
  "enterprise",
]);

export function getStudioPlanLimits(tier?: string | null): StudioPlanLimits {
  const normalizedTier = (tier || "free").toLowerCase() as PlanSlug;
  const isPro = PRO_TIERS.has(normalizedTier);
  const isStarter = normalizedTier === "starter";
  const isFree = !isPro && !isStarter;

  if (isPro) {
    return {
      planTier: normalizedTier,
      isPro: true,
      isStarter: false,
      isFree: false,
      canCustomPassDesign: true,
      canRemoveBranding: true,
      canUploadBackground: true,
      canUploadSponsorLogo: true,
      canUseAllTemplates: true,
      allowedTemplates: ["modern", "minimal", "event", "dark"],
      canUseCustomShapes: true,
      allowedShapes: ["standard", "rounded", "compact"],
      canUseCategoryColors: true,
      canExportSvg: true,
      canSendUnlimitedTestEmails: true,
      maxDynamicFields: Infinity,
    };
  }

  if (isStarter) {
    return {
      planTier: "starter",
      isPro: false,
      isStarter: true,
      isFree: false,
      canCustomPassDesign: true,
      canRemoveBranding: false,
      canUploadBackground: false,
      canUploadSponsorLogo: false,
      canUseAllTemplates: false,
      allowedTemplates: ["modern", "minimal", "event"],
      canUseCustomShapes: false,
      allowedShapes: ["standard"],
      canUseCategoryColors: true,
      canExportSvg: false,
      canSendUnlimitedTestEmails: false,
      maxDynamicFields: 6,
    };
  }

  // Free Tier
  return {
    planTier: "free",
    isPro: false,
    isStarter: false,
    isFree: true,
    canCustomPassDesign: true,
    canRemoveBranding: false,
    canUploadBackground: false,
    canUploadSponsorLogo: false,
    canUseAllTemplates: false,
    allowedTemplates: ["modern", "minimal"],
    canUseCustomShapes: false,
    allowedShapes: ["standard"],
    canUseCategoryColors: false,
    canExportSvg: false,
    canSendUnlimitedTestEmails: false,
    maxDynamicFields: 4,
  };
}

/**
 * Sanitizes and coerces a design configuration so that it strictly adheres
 * to the privileges of the organizer's active subscription tier.
 */
export function sanitizeDesignForPlan(
  configInput: unknown,
  tier?: string | null
): TicketDesignConfig {
  const limits = getStudioPlanLimits(tier);

  // First run base sanitizer
  const base = sanitizeTicketDesign(configInput);

  if (limits.isPro) {
    return base;
  }

  // Enforce tier restrictions for Free and Starter
  const template = limits.allowedTemplates.includes(base.template)
    ? base.template
    : "modern";

  const shape = limits.allowedShapes.includes(base.shape || "standard")
    ? base.shape
    : "standard";

  return {
    ...base,
    template,
    shape,
    backgroundImageUrl: limits.canUploadBackground ? base.backgroundImageUrl : null,
    sponsorLogoUrl: limits.canUploadSponsorLogo ? base.sponsorLogoUrl : null,
    categoryColors: limits.canUseCategoryColors ? base.categoryColors : {},
    // Restrict dynamic fields to tier quota if needed
    ...(limits.isFree
      ? {
          showOrganization: false,
          showPhone: false,
          showRegistrationNumber: false,
        }
      : {}),
  };
}
