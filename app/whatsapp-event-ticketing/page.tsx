import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Ticketing With WhatsApp Tickets — Instant QR Pass Delivery | URPASS",
  description:
    "Deliver event tickets directly through WhatsApp. Attendees receive personalized digital QR passes in their chat with instant sub-second gate check-in.",
  keywords: [
    "event ticketing with whatsapp tickets",
    "whatsapp event ticketing",
    "send event tickets on whatsapp",
    "whatsapp qr ticket delivery",
    "whatsapp event registration",
    "digital pass delivery whatsapp",
  ],
  alternates: { canonical: "https://urpass.space/whatsapp-event-ticketing" },
  openGraph: {
    title: "Event Ticketing With WhatsApp Tickets | Instant QR Pass Delivery | URPASS",
    description:
      "Send digital QR passes directly to attendee WhatsApp chats. 0% platform commission, direct UPI payments, and high-speed door check-in.",
    url: "https://urpass.space/whatsapp-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function WhatsappEventTicketingPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/whatsapp-event-ticketing",
        badge: "WHATSAPP TICKET DELIVERY",
        h1: "Event Ticketing With WhatsApp Tickets",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Never deal with lost ticket emails again. Automatically deliver high-contrast scannable QR passes straight to attendees' WhatsApp chats upon registration or ticket purchase.",
        primaryCtaLabel: "Send tickets",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event ticketing with WhatsApp tickets: send automated digital QR passes to attendees via WhatsApp, accept instant UPI payments, and scan passes at the entrance.",
        comparisonRows: [
          {
            criteria: "Ticket Open & Delivery Rate",
            urpass: "98%+ open rate via instant WhatsApp message delivery",
            competitor: "20% open rate; tickets get trapped in spam/promotions folders",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendee Friction at Gate",
            urpass: "Attendees open WhatsApp and display QR pass in 2 seconds",
            competitor: "Frustrated attendees search email inboxes at the venue entrance",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on ticket sales",
            competitor: "5% to 8% platform fee plus convenience fees",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Channel Delivery",
            urpass: "WhatsApp + Apple Wallet + Email included",
            competitor: "Email attachment only",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Email-Only Ticketing Portals",
        pageSpecificTakeaway:
          "Delivering event tickets via WhatsApp in India eliminates lost email tickets, prevents entrance queue delays, and gives attendees an effortless entry pass right in their favorite messaging app.",
      }}
    />
  );
}
