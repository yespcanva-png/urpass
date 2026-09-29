import type { Metadata } from "next";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  BarChart3,
  Receipt,
  Smartphone,
  Lock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Razorpay Event Ticketing & Registration Software | URPASS",
  description:
    "Razorpay event ticketing & registration software: accept UPI, cards, and netbanking in India with automatic verification and instant digital QR passes.",
  alternates: { canonical: "https://urpass.space/razorpay-event-ticketing" },
  openGraph: {
    title: "Razorpay Event Ticketing & Registration Software | URPASS",
    description:
      "Razorpay event ticketing & registration software: accept UPI, cards, and netbanking in India with automatic verification and instant digital QR passes.",
    url: "https://urpass.space/razorpay-event-ticketing",
  },
};

export default function RazorpayEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/razorpay-event-ticketing",
        badge: "RAZORPAY PAYMENT INTEGRATION",
        h1: "Razorpay Event Ticketing & Registration Software",
        description:
          "The complete Razorpay event ticketing and registration software for Indian conferences, college fests, seminars, and workshops. Accept UPI, credit/debit cards, and netbanking with automated webhook verification and instant digital QR passes.",
        ctaLabel: "Connect Razorpay & sell tickets",
        directAnswer: {
          title: "What is Razorpay event ticketing software?",
          summary:
            "Razorpay event ticketing software integrates Razorpay's payment gateway directly into event registration forms. It allows organizers to sell tickets and collect registration fees via UPI, credit/debit cards, and netbanking in Indian Rupees (₹), instantly issuing digital QR passes upon payment verification without manual intervention.",
          keyPoints: [
            "Registration → Digital QR Pass → Payment → Check-In → Attendance workflow",
            "Automated webhook verification: zero manual reconciliation of bank statements or UTR numbers",
            "Instant digital QR pass generation delivered directly to attendee mobile browsers and emails",
            "Direct T+2 settlement into your verified Indian bank account with 100% attendee data ownership",
          ],
        },
        steps: [
          {
            n: "01",
            title: "Setup Event & Tiers",
            desc: "Configure ticket prices in INR (₹), early-bird deadlines, and custom attendee questions.",
          },
          {
            n: "02",
            title: "Connect Razorpay",
            desc: "Link your verified Razorpay account keys to process payments directly into your bank.",
          },
          {
            n: "03",
            title: "Publish Registration",
            desc: "Share your high-converting, mobile-responsive event ticketing page across student & attendee channels.",
          },
          {
            n: "04",
            title: "Seamless Checkout",
            desc: "Attendees pay in seconds via Google Pay, PhonePe, Paytm, RuPay, credit/debit cards, or netbanking.",
          },
          {
            n: "05",
            title: "Instant QR Pass",
            desc: "Bank-verified webhook triggers instant digital QR pass creation with zero organizer delay.",
          },
          {
            n: "06",
            title: "Door Scanning",
            desc: "Scan attendees at entrance gates using smartphone cameras and review reconciled financial reports.",
          },
        ],
        features: [
          {
            icon: CreditCard,
            title: "Complete Indian Payment Stack",
            desc: "Accept UPI (GPay, PhonePe, Paytm, CRED), credit/debit cards, RuPay, netbanking across 50+ banks, and wallets.",
          },
          {
            icon: Lock,
            title: "PCI-DSS Level 1 Security",
            desc: "Bank-grade encrypted checkout protects attendee payment credentials and prevents fraud.",
          },
          {
            icon: QrCode,
            title: "Automated QR Pass Issuance",
            desc: "Tickets are issued the exact millisecond Razorpay confirms payment capture — no manual checks required.",
          },
          {
            icon: Zap,
            title: "Sub-Second Webhook Engine",
            desc: "High-reliability webhook handling ensures tickets are never dropped even during flash sale surges.",
          },
          {
            icon: Receipt,
            title: "GST Invoice Generation",
            desc: "Automatically capture attendee company GSTIN and issue compliant tax invoices for B2B conference registrations.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Revenue Analytics",
            desc: "Track gross ticket volume, payment conversion rates, and arrival check-in velocity from one unified dashboard.",
          },
        ],
        competitorComparison: {
          title: "URPASS with Razorpay vs Third-Party Event Aggregators",
          subtitle:
            "Why professional event producers choose direct Razorpay integration over middleman portals.",
          competitorName: "Third-Party Aggregators",
          rows: [
            {
              criteria: "Payment Processing Model",
              urpass: "Direct merchant account (payments land directly in your bank account)",
              competitor: "Aggregator escrow: middleman holds all ticket money until weeks after the event",
              urpassAdvantage: true,
            },
            {
              criteria: "Platform Commissions",
              urpass: "0% platform commission on ticket sales with low flat subscription",
              competitor: "5% to 12% cut deducted from every single ticket transaction",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Buyer Fees",
              urpass: "Zero surprise surcharges or 'internet handling fees'",
              competitor: "Steep 8% to 15% convenience markups added on the final payment screen",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Control",
              urpass: "100% private to you — export anytime to CSV or sync with your CRM",
              competitor: "Portal locks attendee data and markets competitors' events to them",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Check-In Tools",
              urpass: "Included: smartphone camera scanning with duplicate pass prevention",
              competitor: "Extra fees for scanner apps or rented physical barcode hardware",
              urpassAdvantage: true,
            },
            {
              criteria: "Refund Management",
              urpass: "Instant 1-click refund initiation directly via Razorpay dashboard",
              competitor: "Cumbersome refund requests through aggregator customer support tickets",
              urpassAdvantage: true,
            },
          ],
        },
        callout: {
          badge: "BANK-GRADE RELIABILITY",
          title: "Scale from 50 paid attendees to 10,000+ without payment drop-offs.",
          description:
            "Razorpay powers India's leading startups and enterprises. By pairing Razorpay's high-success checkout infrastructure with URPASS's instant QR pass and gate check-in engine, you deliver a world-class attendee experience.",
          bullets: [
            "Over 98% payment success rate on UPI intent and mobile card transactions",
            "Automatic retry flows and multiple payment route redundancy",
            "Instant WhatsApp and email ticket dispatch upon successful capture",
            "Zero lock-in: your attendee relationship and bank credentials remain yours forever",
          ],
        },
        useCases: [
          "Professional Industry Summits",
          "College Technical & Cultural Fests",
          "Founder & Startup Pitch Events",
          "Medical & Academic Conferences",
          "Hands-On Developer Workshops",
          "Stand-Up Comedy & Music Gigs",
          "Business Networking Breakfasts",
          "Community Sports Tournaments",
        ],
        deepDiveSections: [
          {
            badge: "AUTOMATION WORKFLOW",
            title: "How URPASS Reconciles Razorpay Payments Without Manual Effort",
            paragraphs: [
              "When an attendee registers on URPASS, our backend generates an atomic Razorpay order with cryptographic order IDs. When the attendee authorizes the payment via UPI or card, Razorpay securely notifies URPASS via server-to-server webhooks within milliseconds.",
              "URPASS verifies the HMAC signature to validate authenticity, transitions the attendee record to 'paid', and immediately generates an encrypted digital QR pass. Even if the attendee closes their browser before the redirect finishes, the webhook ensures their ticket is safely generated and delivered to their inbox.",
            ],
            bullets: [
              "HMAC-SHA256 signature verification guarantees zero spoofed or altered transactions",
              "Automatic seat capacity decrement prevents overbooking during simultaneous checkouts",
              "Immediate email dispatch with downloadable pass links and offline QR views",
            ],
            takeaway:
              "Deploy automated, error-free event ticketing with India's most trusted payment gateway.",
          },
        ],
        faqs: [
          {
            q: "How do I connect my Razorpay account to URPASS?",
            a: "Connecting Razorpay takes less than 2 minutes. In your URPASS dashboard settings, enter your Razorpay Key ID and Key Secret. Once saved, all paid ticket orders will process directly through your Razorpay account.",
          },
          {
            q: "Can attendees pay using Google Pay and PhonePe through Razorpay?",
            a: "Yes. Razorpay provides full UPI intent support, allowing mobile attendees to tap Google Pay, PhonePe, Paytm, CRED, or BHIM to authorize payments instantly without typing UPI IDs.",
          },
          {
            q: "How does URPASS prevent tickets from being issued for failed payments?",
            a: "URPASS only generates and sends digital QR passes upon receiving a verified payment capture webhook with a valid cryptographic signature from Razorpay. Failed or pending payments never receive a pass.",
          },
          {
            q: "When does the ticket revenue reach my bank account?",
            a: "Because payments process through your own Razorpay merchant account, funds settle directly into your linked Indian bank account according to your standard Razorpay settlement schedule (usually T+2 business days).",
          },
          {
            q: "Can I issue refunds to attendees if an event is rescheduled?",
            a: "Yes. You can initiate refunds directly through your Razorpay dashboard or URPASS attendee panel. Razorpay processes the refund back to the attendee's original payment method automatically.",
          },
          {
            q: "Can I collect corporate GSTIN numbers on the registration form?",
            a: "Yes. You can enable GST collection on your ticketing form. Attendees can input their company name and GSTIN number to receive automated tax invoices for corporate expense reimbursement.",
          },
          {
            q: "Does URPASS charge extra commission fees on Razorpay transactions?",
            a: "No. URPASS offers zero-commission ticketing plans where you pay 0% platform commission on ticket sales, paying only the standard Razorpay gateway processing fee.",
          },
        ],
        relatedLinks: [
          { title: "Razorpay Event Registration", href: "/razorpay-event-registration", category: "Product" },
          { title: "Event Registration with UPI Payment", href: "/event-registration-with-upi-payment", category: "Product" },
          { title: "Zero Commission Event Ticketing India", href: "/zero-commission-event-ticketing-india", category: "Product" },
          { title: "Events in India Hub", href: "/in", category: "Location" },
          { title: "QR Event Check-In Software", href: "/qr-event-check-in", category: "Product" },
          { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", category: "Guide" },
        ],
        ctaTitle: "Supercharge your event ticketing with Razorpay",
        ctaDescription:
          "Accept UPI and cards with instant webhook reconciliation, zero commission cuts, and automated QR passes.",
      }}
    />
  );
}
