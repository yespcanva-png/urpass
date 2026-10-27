import { MarketingPageConfig } from "./types";

/**
 * Sanitizes strings for safe embedding into application/ld+json script tags.
 * Prevents HTML/script injection by escaping closing tags and ampersands.
 */
function sanitizeJsonString(raw: string): string {
  return raw
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function generateStructuredData(page: MarketingPageConfig) {
  const baseUrl = "https://urpass.space";
  const pageUrl = page.canonicalUrl || `${baseUrl}/${page.slug}`;
  const isManagedService =
    page.slug === "remote-managed-event-services" ||
    page.slug === "self-service-vs-managed-events" ||
    page.canonicalUrl?.includes("/services/") ||
    page.slug.startsWith("managed-") ||
    page.slug.startsWith("services/");

  const graph: any[] = [
    // 1. BreadcrumbList
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title.split("|")[0].trim(),
          item: pageUrl,
        },
      ],
    },
    // 2. WebPage
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title.split("|")[0].trim(),
            item: pageUrl,
          },
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "UrPass",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icon.png`,
        },
      },
    },
  ];

  // 3. SoftwareApplication or Service schema
  if (isManagedService) {
    graph.push({
      "@type": "Service",
      name: "UrPass Remote Managed Event Setup & Support",
      serviceType: "Event Registration & QR Check-in Technical Setup",
      provider: {
        "@type": "Organization",
        name: "UrPass",
        url: baseUrl,
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      description:
        "Remote technical configuration for event registration, ticketing categories, branded QR passes, and gate scanner orientation. Note: Remote setup and cloud support only; no on-site personnel.",
      offers: [
        {
          "@type": "Offer",
          name: "Essential Managed Setup",
          price: "2999",
          priceCurrency: "INR",
          description: "Technical configuration for events up to 1,000 attendees with basic registration form and standard digital passes.",
        },
        {
          "@type": "Offer",
          name: "Pro Managed Setup",
          price: "7999",
          priceCurrency: "INR",
          description: "Technical configuration for events up to 5,000 attendees with custom pass design, tiered ticketing, and scanner orientation.",
        },
        {
          "@type": "Offer",
          name: "Premium Managed Setup",
          price: "14999",
          priceCurrency: "INR",
          description: "Advanced technical setup for up to 15,000 attendees with multi-gate scanner routing and live remote standby.",
        },
      ],
    });
  } else {
    graph.push({
      "@type": "SoftwareApplication",
      name: "UrPass",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      url: pageUrl,
      description: page.description,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "84",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Free Forever Plan",
          price: "0",
          priceCurrency: "INR",
          description: "1 active event, up to 100 registrations/month, 0% ticket commission, no credit card required.",
        },
        {
          "@type": "Offer",
          name: "Starter Plan",
          price: "499",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "3 active events, 500 registrations/month, CSV exports, 0% ticket commission.",
        },
        {
          "@type": "Offer",
          name: "Pro Plan",
          price: "999",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "10 active events, 2,500 registrations/month, custom pass designer, priority support.",
        },
        {
          "@type": "Offer",
          name: "Business Plan",
          price: "2499",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "Unlimited active events*, 10,000 registrations/month, custom domain, API & webhooks.",
        },
      ],
    });
  }

  // 4. FAQPage schema matching visible FAQs
  if (page.faqs && page.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    });
  }

  const jsonObject = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return sanitizeJsonString(JSON.stringify(jsonObject));
}
