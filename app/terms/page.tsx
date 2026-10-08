import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Shield, FileText, CheckCircle2, Globe, Mail, MapPin } from "lucide-react";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions — URPASS",
  description:
    "Read the official URPASS Terms and Conditions governing access to and use of our event management, digital ticketing, QR check-in platform, subscriptions, and APIs.",
  alternates: { canonical: "https://urpass.space/terms" },
  openGraph: {
    title: "Terms and Conditions — URPASS",
    description: "Read the official Terms and Conditions governing access to and use of URPASS platform services.",
    url: "https://urpass.space/terms",
    type: "website",
  },
};

const EFFECTIVE_DATE = "8 October 2026";
const LAST_UPDATED = "8 October 2026";
const CONTACT_EMAIL = "urpass.space@yespstudio.com";
const WEBSITE_URL = "https://urpass.space";

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-24 border-b border-neutral-100 pb-10 last:border-0 last:pb-0">
      <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4 flex items-start sm:items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2 sm:mt-0" />
        <span>{title}</span>
      </h2>
      <div className="text-sm text-neutral-600 leading-relaxed space-y-3.5">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-5 py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="inline-flex items-center gap-2 bg-purple-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-4">
          <Scale className="w-3.5 h-3.5" />
          LEGAL &amp; COMPLIANCE
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
          URPASS — Terms and Conditions
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400 mb-8 pb-6 border-b border-neutral-100 font-mono">
          <span>
            <strong className="text-neutral-600 font-medium">Effective Date:</strong> {EFFECTIVE_DATE}
          </span>
          <span>&middot;</span>
          <span>
            <strong className="text-neutral-600 font-medium">Last Updated:</strong> {LAST_UPDATED}
          </span>
          <span>&middot;</span>
          <span>
            <strong className="text-neutral-600 font-medium">Website:</strong>{" "}
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              {WEBSITE_URL}
            </a>
          </span>
        </div>

        {/* Intro Highlight Box */}
        <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-6 mb-10 text-sm text-neutral-700 leading-relaxed space-y-3">
          <p className="font-semibold text-neutral-900">Welcome to URPASS.</p>
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the URPASS platform, including its
            website, dashboards, event registration services, ticketing functionality, digital passes, QR-based check-in
            systems, mobile applications, APIs, and related services.
          </p>
          <p>
            URPASS (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Platform&quot;) refers to the business entity
            operating the URPASS service, as identified in the applicable invoice or contractual documentation.
          </p>
          <p className="font-medium text-neutral-900 pt-1">
            By accessing, registering for, purchasing, or using URPASS services, you agree to these Terms.
          </p>
        </div>

        {/* Table of Contents Quick Grid */}
        <div className="mb-12 p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-brand" />
            Table of Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs font-medium text-neutral-600">
            <a href="#acceptance" className="hover:text-brand hover:underline">1. Acceptance of Terms</a>
            <a href="#services" className="hover:text-brand hover:underline">2. Description of Services</a>
            <a href="#accounts" className="hover:text-brand hover:underline">3. Accounts and Security</a>
            <a href="#plans" className="hover:text-brand hover:underline">4. Subscription &amp; Limits</a>
            <a href="#trials" className="hover:text-brand hover:underline">5. Trials &amp; Renewals</a>
            <a href="#pricing" className="hover:text-brand hover:underline">6. Pricing &amp; Taxes</a>
            <a href="#lifetime" className="hover:text-brand hover:underline">7. Event Plans &amp; Lifetime</a>
            <a href="#organizers" className="hover:text-brand hover:underline">8. Organizer Responsibilities</a>
            <a href="#ticket-sales" className="hover:text-brand hover:underline">9. Ticket Sales &amp; Payments</a>
            <a href="#refunds" className="hover:text-brand hover:underline">10. Refunds &amp; Chargebacks</a>
            <a href="#passes" className="hover:text-brand hover:underline">11. Digital Passes &amp; QR</a>
            <a href="#data-protection" className="hover:text-brand hover:underline">12. Data Protection</a>
            <a href="#ip" className="hover:text-brand hover:underline">13. Intellectual Property</a>
            <a href="#api" className="hover:text-brand hover:underline">14. APIs &amp; Integrations</a>
            <a href="#prohibited" className="hover:text-brand hover:underline">15. Prohibited Activities</a>
            <a href="#availability" className="hover:text-brand hover:underline">16. Availability &amp; Uptime</a>
            <a href="#liability" className="hover:text-brand hover:underline">17. Limitation of Liability</a>
            <a href="#disclaimers" className="hover:text-brand hover:underline">18. Disclaimer of Warranties</a>
            <a href="#indemnity" className="hover:text-brand hover:underline">19. Indemnification</a>
            <a href="#termination" className="hover:text-brand hover:underline">20. Suspension &amp; Termination</a>
            <a href="#force-majeure" className="hover:text-brand hover:underline">21. Force Majeure</a>
            <a href="#jurisdiction" className="hover:text-brand hover:underline">22. Law &amp; Jurisdiction</a>
            <a href="#disputes" className="hover:text-brand hover:underline">23. Dispute Resolution</a>
            <a href="#changes" className="hover:text-brand hover:underline">24. Changes to Terms</a>
            <a href="#general" className="hover:text-brand hover:underline">25. General Provisions</a>
            <a href="#contact" className="hover:text-brand hover:underline">26. Contact Information</a>
          </div>
        </div>

        {/* ── 1. Acceptance of Terms ── */}
        <Section title="1. Acceptance of Terms" id="acceptance">
          <p>
            <strong>1.1.</strong> By creating an account, purchasing a subscription, registering for an event, or using
            URPASS, you agree to comply with these Terms and applicable laws.
          </p>
          <p>
            <strong>1.2.</strong> If you use URPASS on behalf of an organization, institution, company, or other legal
            entity, you represent that you have the authority to accept these Terms on its behalf.
          </p>
          <p>
            <strong>1.3.</strong> Users who do not agree with these Terms must discontinue use of the Platform.
          </p>
          <p>
            <strong>1.4.</strong> You must be at least 18 years old to create an organizer account. Minors may participate in
            events where permitted by applicable law and the organizer&apos;s rules, with any legally required parental or
            guardian consent.
          </p>
          <p>
            <strong>1.5.</strong> Additional written agreements, event-specific conditions, or enterprise contracts may apply.
            Where an authorized written agreement expressly conflicts with these Terms, that agreement takes precedence for
            the relevant service.
          </p>
        </Section>

        {/* ── 2. Description of Services ── */}
        <Section title="2. Description of Services" id="services">
          <p>URPASS provides cloud-based event management and digital access technology.</p>
          <p>Depending on the selected plan and available features, services may include:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 my-3">
            {[
              "Event creation, publishing, and management.",
              "Event registration and attendee management.",
              "Free and paid ticketing functionality.",
              "Digital QR-coded event passes.",
              "QR scanning, validation, and check-in/check-out.",
              "Registration forms and custom attendee fields.",
              "Attendee approval and waitlisting.",
              "Event analytics and attendance reporting.",
              "Email notifications and other supported communications.",
              "Team roles and access permissions.",
              "Event websites, branding, and customization.",
              "Payment gateway integrations.",
              "API, webhook, and third-party integrations.",
              "Mobile-based event entry management.",
              "Institutional and enterprise event management solutions.",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            URPASS may introduce, improve, modify, or discontinue features, subject to applicable contractual obligations
            and legal requirements.
          </p>
          <p>Features, usage limits, and entitlements depend on the purchased plan.</p>
        </Section>

        {/* ── 3. Accounts and Security ── */}
        <Section title="3. Accounts and Security" id="accounts">
          <p>
            <strong>3.1.</strong> Users must provide accurate and current account information.
          </p>
          <p>
            <strong>3.2.</strong> Account holders are responsible for maintaining the confidentiality of passwords,
            credentials, API keys, authentication tokens, and access permissions.
          </p>
          <p>
            <strong>3.3.</strong> Account holders must ensure that employees, contractors, volunteers, and other authorized
            users comply with these Terms.
          </p>
          <p>
            <strong>3.4.</strong> Unauthorized account sharing, fraudulent registration, and attempts to bypass subscription
            limits are prohibited.
          </p>
          <p>
            <strong>3.5.</strong> URPASS may require additional verification where reasonably necessary to prevent fraud or
            secure the Platform.
          </p>
          <p>
            <strong>3.6.</strong> Users must promptly notify URPASS of suspected unauthorized access or security incidents
            affecting their account.
          </p>
          <p>
            <strong>3.7.</strong> URPASS may restrict accounts where there is reasonable evidence of fraud, abuse, security
            risk, or violation of applicable laws.
          </p>
        </Section>

        {/* ── 4. Subscription Plans and Usage Limits ── */}
        <Section title="4. Subscription Plans and Usage Limits" id="plans">
          <p>URPASS offers multiple subscription and purchase options, including:</p>
          <div className="flex flex-wrap gap-2 my-2">
            {[
              "Free",
              "Starter",
              "Pro",
              "Business",
              "One-time Event Plans",
              "URPASS Campus",
              "Enterprise or Custom Plans",
              "Promotional & Founder Lifetime Plans",
            ].map((plan, idx) => (
              <span key={idx} className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-full border border-neutral-200">
                {plan}
              </span>
            ))}
          </div>
          <p>
            <strong>4.1.</strong> Plan pricing, features, limits, eligibility, and billing intervals are determined by the
            applicable offer and the information presented at the time of purchase.
          </p>
          <p>
            <strong>4.2.</strong> Current public plan details are available at{" "}
            <Link href="/pricing" className="text-brand font-medium hover:underline">
              https://urpass.space/pricing
            </Link>
            .
          </p>
          <p>
            <strong>4.3.</strong> Limits may include the number of events, registrations, organizer seats, custom fields, API
            requests, storage, and other resources.
          </p>
          <p>
            <strong>4.4.</strong> URPASS may prevent additional registrations, event creation, or use of restricted features
            when applicable plan limits are reached.
          </p>
          <p>
            <strong>4.5.</strong> Exceeding usage limits may require upgrading, purchasing additional capacity, or reducing
            usage.
          </p>
          <p>
            <strong>4.6.</strong> Subscription benefits cannot be resold, sublicensed, or transferred without written
            authorization.
          </p>
          <p>
            <strong>4.7.</strong> Any pricing or feature changes affecting an existing paid subscription will be communicated
            as required by applicable law and the applicable subscription agreement.
          </p>
        </Section>

        {/* ── 5. Free Trials, Billing, and Renewals ── */}
        <Section title="5. Free Trials, Billing, and Renewals" id="trials">
          <p>
            <strong>5.1.</strong> URPASS may offer a promotional free trial of 30 days on eligible paid plans.
          </p>
          <p>
            <strong>5.2.</strong> Where stated in the offer, the trial may require an authorized payment mandate, including
            AutoPay.
          </p>
          <p>
            <strong>5.3.</strong> Trial eligibility may be restricted to one trial per account or other disclosed eligibility
            conditions.
          </p>
          <p>
            <strong>5.4.</strong> Unless cancelled before the trial ends, an eligible subscription may convert to a paid
            subscription and the authorized payment method may be charged, in accordance with the terms disclosed during
            enrollment.
          </p>
          <p>
            <strong>5.5.</strong> Recurring subscriptions renew according to the billing cycle selected by the customer,
            unless cancelled or otherwise terminated.
          </p>
          <p>
            <strong>5.6.</strong> Applicable subscription charges, taxes, renewal frequency, and payment authorization
            requirements must be disclosed during checkout.
          </p>
          <p>
            <strong>5.7.</strong> Customers may cancel recurring subscriptions using the available billing controls or by
            contacting URPASS support.
          </p>
          <p>
            <strong>5.8.</strong> Cancellation stops future recurring charges, subject to payment mandates already processed
            and applicable payment gateway procedures.
          </p>
          <p>
            <strong>5.9.</strong> Unless otherwise stated in a specific offer or required by law, access to paid subscription
            features continues until the end of the paid billing period.
          </p>
          <p>
            <strong>5.10.</strong> If a payment fails, URPASS may retry collection in accordance with the payment
            authorization, notify the customer, restrict paid functionality, or suspend the subscription.
          </p>
          <p>
            <strong>5.11.</strong> Customers are responsible for maintaining valid billing information and ensuring sufficient
            payment authorization.
          </p>
        </Section>

        {/* ── 6. Pricing, Taxes, and Payments ── */}
        <Section title="6. Pricing, Taxes, and Payments" id="pricing">
          <p>
            <strong>6.1.</strong> Prices may be displayed in Indian Rupees (INR), British Pounds (GBP), or other supported
            currencies.
          </p>
          <p>
            <strong>6.2.</strong> Applicable taxes, including GST where relevant, will be calculated or disclosed during
            checkout.
          </p>
          <p>
            <strong>6.3.</strong> Unless expressly stated otherwise, advertised subscription prices may exclude applicable
            taxes.
          </p>
          <p>
            <strong>6.4.</strong> Payments may be processed through third-party payment gateways or authorized payment service
            providers, including Razorpay and other providers supported by the Platform.
          </p>
          <p>
            <strong>6.5.</strong> Payment processing is subject to the applicable payment provider&apos;s terms and security
            requirements.
          </p>
          <p>
            <strong>6.6.</strong> URPASS does not guarantee approval of any payment transaction by a bank, card network, UPI
            provider, or payment gateway.
          </p>
          <p>
            <strong>6.7.</strong> Any currency conversion charges, international transaction fees, or bank charges are
            governed by the applicable financial institution or payment provider.
          </p>
          <p>
            <strong>6.8.</strong> URPASS will issue applicable invoices or payment records according to its billing procedures
            and legal obligations.
          </p>
        </Section>

        {/* ── 7. One-Time Event Plans and Lifetime Offers ── */}
        <Section title="7. One-Time Event Plans and Lifetime Offers" id="lifetime">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2">7.1. One-Time Event Plans</h3>
              <p>
                One-time event purchases provide access to the selected event-related features and registration allowance
                described at purchase. One-time event plans do not automatically provide an ongoing monthly or annual
                subscription. Unused registrations or event allowances are not transferable unless expressly permitted by the
                applicable offer.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2">7.2. Founder Lifetime Access</h3>
              <p>
                Where offered, URPASS Founder Lifetime Access is a one-time purchase governed by the specific offer accepted
                at checkout.
              </p>
              <p className="mt-2">
                The term &quot;Lifetime&quot; refers to the duration expressly defined in that offer, subject to applicable
                law and any disclosed conditions. For an offer advertising access through 2125, that stated term and the
                features expressly guaranteed at purchase will form part of the customer&apos;s contractual entitlement.
              </p>
              <p className="mt-2">
                Founder Lifetime Access does not automatically include future products, separately priced services, third-party
                charges, payment processing fees, or features not included in the original offer.
              </p>
              <p className="mt-2">
                URPASS will not retrospectively reduce or remove expressly guaranteed paid entitlements except as permitted by
                the applicable contract or law. If a purchased service is permanently discontinued before the promised term
                expires, affected customers will receive the remedies required by the applicable agreement and law.
              </p>
              <p className="mt-2 text-xs text-neutral-500 font-mono">
                Lifetime access does not mean ownership of URPASS software, code, infrastructure, or intellectual property.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 8. Event Organizer Responsibilities ── */}
        <Section title="8. Event Organizer Responsibilities" id="organizers">
          <p>
            Event organizers are solely responsible for the events they create and operate, including their compliance with
            applicable laws.
          </p>
          <p>Their responsibilities include:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>Providing accurate event information.</li>
            <li>Obtaining necessary event permissions and licenses.</li>
            <li>Defining ticket prices and eligibility.</li>
            <li>Establishing event cancellation and refund policies.</li>
            <li>Managing venue capacity and safety.</li>
            <li>Handling attendee complaints and event-related disputes.</li>
            <li>Providing legally required disclosures.</li>
            <li>Protecting attendee information.</li>
            <li>Managing staff and scanner access.</li>
            <li>Complying with applicable tax obligations.</li>
            <li>Delivering the event and any promised attendee benefits.</li>
          </ul>
          <p>
            URPASS supplies technology and does not become the event organizer solely by providing the Platform.
          </p>
          <p>
            Unless separately agreed in writing, URPASS does not guarantee event attendance, ticket sales, commercial
            success, sponsorship revenue, venue availability, or event profitability.
          </p>
          <p>
            Organizers must not misrepresent URPASS as the event owner, sponsor, or guarantor without authorization.
          </p>
        </Section>

        {/* ── 9. Ticket Sales and Payment Processing ── */}
        <Section title="9. Ticket Sales and Payment Processing" id="ticket-sales">
          <p>
            <strong>9.1.</strong> URPASS may enable organizers to create paid tickets and collect payments through supported
            payment integrations.
          </p>
          <p>
            <strong>9.2.</strong> The identity of the merchant or payment recipient, settlement arrangements, transaction
            fees, and applicable charges depend on the payment configuration disclosed for the relevant event.
          </p>
          <p>
            <strong>9.3.</strong> Where an organizer receives ticket payments directly through its payment gateway account,
            the organizer remains responsible for its merchant obligations, event delivery, and applicable refunds.
          </p>
          <p>
            <strong>9.4.</strong> Where payments are collected or settled through another authorized arrangement, the
            responsibilities of the applicable parties will be governed by the disclosed checkout terms, payment provider
            agreements, and applicable law.
          </p>
          <p>
            <strong>9.5.</strong> URPASS may charge a platform or transaction fee where disclosed.
          </p>
          <p>
            <strong>9.6.</strong> Payment gateway fees, taxes, refunds, chargeback charges, and settlement deductions may apply
            according to the relevant arrangements.
          </p>
          <p>
            <strong>9.7.</strong> URPASS does not guarantee settlement timing or payment processing availability controlled by a
            third-party payment provider.
          </p>
          <p>
            <strong>9.8.</strong> Transaction reporting provided by URPASS is for operational reference and must be reconciled
            against the applicable payment provider&apos;s official records.
          </p>
        </Section>

        {/* ── 10. Event Cancellations, Refunds, and Chargebacks ── */}
        <Section title="10. Event Cancellations, Refunds, and Chargebacks" id="refunds">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1.5">10.1. Event Ticket Refunds</h3>
              <p>
                Organizers must publish and honor a lawful event refund and cancellation policy. Where the organizer is the
                seller of the ticket, it is responsible for handling eligible attendee refunds and event cancellation
                obligations. Attendees should first contact the event organizer for event-specific refund requests. URPASS
                may assist with payment and technical records where available. Nothing in these Terms removes any refund or
                consumer remedy required by applicable law.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1.5">10.2. URPASS Subscription Refunds</h3>
              <p>
                URPASS subscription and one-time service payments are generally non-refundable once the purchased service has
                been made available, except where a refund is required by law, expressly offered in the applicable purchase
                terms, or approved by URPASS. Requests involving duplicate charges, unauthorized transactions, billing errors,
                or failure to provide the purchased service will be reviewed.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1.5">10.3. Chargebacks</h3>
              <p>
                Payment disputes may be subject to the applicable bank, card network, UPI provider, and payment gateway
                procedures. Organizers must cooperate with legitimate transaction investigations and provide relevant
                transaction evidence where legally permitted. URPASS may suspend affected payment or ticketing functionality
                where reasonably necessary to prevent fraud, protect users, or comply with payment provider obligations.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 11. Digital Passes and QR Check-In ── */}
        <Section title="11. Digital Passes and QR Check-In" id="passes">
          <p>
            <strong>11.1.</strong> QR passes are generated for event access and validation according to the organizer&apos;s
            event rules.
          </p>
          <p>
            <strong>11.2.</strong> A QR code or digital ticket does not independently guarantee admission where the event has
            been cancelled, access has been revoked lawfully, capacity restrictions apply, or the attendee does not meet
            disclosed eligibility requirements.
          </p>
          <p>
            <strong>11.3.</strong> Organizers are responsible for configuring appropriate access permissions, entry rules, and
            validation procedures.
          </p>
          <p>
            <strong>11.4.</strong> Attendees must not forge, duplicate, manipulate, or misuse event passes.
          </p>
          <p>
            <strong>11.5.</strong> URPASS may implement duplicate scan detection, validation checks, and other security
            mechanisms, but no digital system can guarantee prevention of every form of misuse.
          </p>
          <p>
            <strong>11.6.</strong> Organizers should establish appropriate fallback procedures for internet outages, device
            failures, power interruptions, and other operational incidents.
          </p>
          <p>
            <strong>11.7.</strong> Event organizers remain responsible for on-site crowd management and admission decisions
            consistent with applicable law.
          </p>
        </Section>

        {/* ── 12. Attendee Information and Data Protection ── */}
        <Section title="12. Attendee Information and Data Protection" id="data-protection">
          <p>
            <strong>12.1.</strong> Event organizers are responsible for ensuring that attendee information is collected and
            processed with an appropriate legal basis and any required notices or consents.
          </p>
          <p>
            <strong>12.2.</strong> Depending on the arrangement, URPASS may process attendee information on behalf of an
            organizer or for its own legitimate platform purposes, as described in the applicable{" "}
            <Link href="/privacy" className="text-brand font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            <strong>12.3.</strong> Organizers must not collect unnecessary sensitive information or use the Platform to
            process unlawful or prohibited categories of data.
          </p>
          <p>
            <strong>12.4.</strong> Organizers must provide appropriate privacy notices and handle requests from attendees
            concerning their personal information as legally required.
          </p>
          <p>
            <strong>12.5.</strong> URPASS will implement reasonable security measures appropriate to the information processed
            and applicable legal requirements.
          </p>
          <p>
            <strong>12.6.</strong> Organizers must restrict access to attendee data to authorized personnel and protect exported
            data against unauthorized disclosure.
          </p>
          <p>
            <strong>12.7.</strong> URPASS may use service providers to support hosting, communications, security, analytics,
            and payment integrations, subject to applicable legal and contractual requirements.
          </p>
          <p>
            <strong>12.8.</strong> Data retention, deletion, processing purposes, international transfers, and individual
            privacy rights are governed by the applicable Privacy Policy, contractual arrangements, and laws in force.
          </p>
          <p>
            <strong>12.9.</strong> URPASS does not acquire ownership of organizers&apos; underlying attendee records merely by
            hosting or processing them.
          </p>
          <p>
            <strong>12.10.</strong> Account termination or subscription cancellation does not necessarily require immediate
            deletion of all records where retention is legally required or necessary for legitimate outstanding obligations.
          </p>
        </Section>

        {/* ── 13. Intellectual Property ── */}
        <Section title="13. Intellectual Property" id="ip">
          <p>
            <strong>13.1.</strong> URPASS owns or licenses the software, design, trademarks, interfaces, documentation, and
            original technology comprising the Platform.
          </p>
          <p>
            <strong>13.2.</strong> Access to URPASS grants a limited, revocable, non-exclusive, non-transferable right to use
            the purchased services in accordance with these Terms, subject to any non-revocable contractual entitlements and
            applicable law.
          </p>
          <p>
            <strong>13.3.</strong> Customers retain ownership of their original event content, branding, attendee records, and
            other materials they lawfully provide.
          </p>
          <p>
            <strong>13.4.</strong> Customers grant URPASS a limited license to host, process, transmit, and display submitted
            content for the purpose of providing, securing, supporting, and maintaining the Service.
          </p>
          <p>
            <strong>13.5.</strong> Customers must not copy, resell, commercially exploit, reverse-engineer, or distribute
            URPASS software except where expressly permitted or protected by law.
          </p>
          <p>
            <strong>13.6.</strong> Unauthorized use of URPASS trademarks, logos, or branding is prohibited.
          </p>
        </Section>

        {/* ── 14. APIs, Webhooks, and Integrations ── */}
        <Section title="14. APIs, Webhooks, and Integrations" id="api">
          <p>
            <strong>14.1.</strong> API and webhook access are available only where included in the customer&apos;s plan or
            separately authorized.
          </p>
          <p>
            <strong>14.2.</strong> API credentials must remain confidential and must not be publicly exposed.
          </p>
          <p>
            <strong>14.3.</strong> Customers are responsible for applications and integrations connected through their
            credentials.
          </p>
          <p>
            <strong>14.4.</strong> Reasonable usage, rate, and security limits may apply.
          </p>
          <p>
            <strong>14.5.</strong> URPASS may temporarily restrict integration access in response to excessive requests,
            security threats, or misuse.
          </p>
          <p>
            <strong>14.6.</strong> Integrations with external software and payment providers are subject to those
            providers&apos; independent terms and availability.
          </p>
          <p>
            <strong>14.7.</strong> URPASS is not responsible for failures originating solely from third-party systems outside
            its reasonable control, except where liability cannot lawfully be excluded.
          </p>
        </Section>

        {/* ── 15. Prohibited Activities ── */}
        <Section title="15. Prohibited Activities" id="prohibited">
          <p>Users must not:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>Conduct fraudulent events or deceptive ticket sales.</li>
            <li>Collect payments for unlawful activities.</li>
            <li>Upload malicious software or harmful code.</li>
            <li>Manipulate QR codes, event records, or transaction information.</li>
            <li>Attempt unauthorized access to accounts or systems.</li>
            <li>Sell counterfeit, invalid, or unauthorized event tickets.</li>
            <li>Violate intellectual property or privacy rights.</li>
            <li>Send unsolicited or unlawful communications.</li>
            <li>Circumvent subscription limits or technical restrictions.</li>
            <li>Interfere with system availability or security.</li>
            <li>Misrepresent the ownership or legitimacy of an event.</li>
            <li>Use URPASS in violation of applicable laws or regulations.</li>
          </ul>
          <p className="mt-3">
            URPASS may investigate suspected misuse and take proportionate action, including restricting access, suspending
            services, or referring unlawful activity to competent authorities where appropriate.
          </p>
        </Section>

        {/* ── 16. Service Availability and Maintenance ── */}
        <Section title="16. Service Availability and Maintenance" id="availability">
          <p>
            <strong>16.1.</strong> URPASS aims to provide reliable services but does not guarantee uninterrupted or
            error-free availability.
          </p>
          <p>
            <strong>16.2.</strong> Planned maintenance, security updates, infrastructure incidents, third-party failures, and
            other technical events may affect availability.
          </p>
          <p>
            <strong>16.3.</strong> URPASS may temporarily restrict services where reasonably necessary to protect platform
            security or reliability.
          </p>
          <p>
            <strong>16.4.</strong> URPASS will use commercially reasonable efforts to address material technical issues within
            its control.
          </p>
          <p>
            <strong>16.5.</strong> Specific uptime guarantees, service credits, or support response commitments apply only
            where expressly included in a separate service-level agreement.
          </p>
          <p>
            <strong>16.6.</strong> Organizers are responsible for establishing reasonable business continuity arrangements for
            critical events.
          </p>
        </Section>

        {/* ── 17. Limitation of Liability ── */}
        <Section title="17. Limitation of Liability" id="liability">
          <p>
            <strong>17.1.</strong> To the maximum extent permitted by applicable law, URPASS is not liable for indirect,
            incidental, special, or consequential losses, including lost profits, lost business opportunities, or reputational
            harm arising from use of the Platform.
          </p>
          <p>
            <strong>17.2.</strong> URPASS is not responsible for independent acts or omissions of event organizers, attendees,
            payment providers, venues, or third parties except to the extent liability legally arises from URPASS&apos;s own
            conduct.
          </p>
          <p>
            <strong>17.3.</strong> Subject to applicable law and any separate written agreement, URPASS&apos;s total aggregate
            liability arising out of or relating to the Service will not exceed the fees paid by the claimant to URPASS for the
            relevant service during the twelve months preceding the event giving rise to the claim.
          </p>
          <p>
            <strong>17.4.</strong> This limitation does not exclude or restrict liability that cannot lawfully be excluded or
            restricted, including liability for fraud, willful misconduct, or mandatory consumer and statutory rights where
            applicable.
          </p>
          <p>
            <strong>17.5.</strong> Nothing in these Terms prevents a party from seeking a remedy that cannot legally be waived.
          </p>
        </Section>

        {/* ── 18. Disclaimer of Warranties ── */}
        <Section title="18. Disclaimer of Warranties" id="disclaimers">
          <p>
            URPASS provides its services on an &quot;as available&quot; basis, subject to warranties, guarantees, and remedies
            that cannot legally be excluded.
          </p>
          <p>
            URPASS does not warrant that the Platform will be completely free of technical errors, vulnerabilities, outages,
            or compatibility issues.
          </p>
          <p>
            Unless expressly agreed, URPASS does not guarantee specific event revenue, attendance figures, business results,
            or payment settlement outcomes.
          </p>
          <p>Nothing in this section overrides an express contractual commitment or applicable statutory warranty.</p>
        </Section>

        {/* ── 19. Indemnification ── */}
        <Section title="19. Indemnification" id="indemnity">
          <p>
            To the extent permitted by applicable law, organizers agree to indemnify URPASS against reasonable third-party
            claims, losses, and costs directly arising from:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 my-2">
            <li>Fraudulent or unlawful events organized by them.</li>
            <li>Their material breach of these Terms.</li>
            <li>Their violation of third-party intellectual property rights.</li>
            <li>Their unlawful collection or processing of attendee information.</li>
            <li>Their failure to comply with applicable event-related legal requirements.</li>
          </ul>
          <p>
            This obligation applies only to the extent the claim is attributable to the organizer&apos;s conduct and does not
            require indemnification for URPASS&apos;s own negligence, misconduct, or legal violations.
          </p>
          <p>
            URPASS will provide reasonably prompt notice of qualifying claims and an appropriate opportunity to participate in
            their defense.
          </p>
        </Section>

        {/* ── 20. Suspension and Termination ── */}
        <Section title="20. Suspension and Termination" id="termination">
          <p>
            <strong>20.1.</strong> URPASS may suspend or terminate an account where reasonably justified by serious or
            repeated Terms violations, fraud, unlawful activity, payment failure, or material security risks.
          </p>
          <p>
            <strong>20.2.</strong> Where reasonably practicable, URPASS will provide notice and an opportunity to remedy a
            breach before termination.
          </p>
          <p>
            <strong>20.3.</strong> Immediate restriction may be necessary where delay would create a material security, fraud,
            safety, or legal risk.
          </p>
          <p>
            <strong>20.4.</strong> Customers may request account closure or cancel eligible subscriptions using available
            account controls or customer support.
          </p>
          <p>
            <strong>20.5.</strong> Termination does not remove accrued payment obligations, legally required record retention,
            or provisions intended to survive termination.
          </p>
          <p>
            <strong>20.6.</strong> Any legally required refunds, data access rights, or contractual remedies will continue to
            apply.
          </p>
        </Section>

        {/* ── 21. Force Majeure ── */}
        <Section title="21. Force Majeure" id="force-majeure">
          <p>
            Neither party will be responsible for a failure or delay caused by extraordinary circumstances beyond its
            reasonable control, to the extent permitted by law.
          </p>
          <p>
            Such circumstances may include natural disasters, government restrictions, widespread telecommunications outages,
            war, major infrastructure failures, and other qualifying events.
          </p>
          <p>The affected party must take reasonable steps to mitigate the impact and resume performance.</p>
          <p>
            This section does not eliminate payment, refund, or other obligations that remain enforceable under applicable law.
          </p>
        </Section>

        {/* ── 22. Governing Law and Exclusive Jurisdiction ── */}
        <Section title="22. Governing Law and Exclusive Jurisdiction" id="jurisdiction">
          <p>
            <strong>22.1.</strong> These Terms and Conditions shall be governed by and construed in accordance with the laws of
            India.
          </p>
          <p className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-medium">
            <strong>22.2.</strong> Subject to applicable laws, mandatory statutory jurisdiction, and the legal competence of
            the relevant courts, any civil dispute, claim, controversy, or proceeding arising out of or relating to URPASS,
            its services, subscriptions, transactions, agreements, or these Terms shall be subject to the{" "}
            <strong>exclusive jurisdiction of the competent courts located in Erode, Tamil Nadu, India</strong>, provided
            those courts otherwise have jurisdiction over the matter.
          </p>
          <p>
            <strong>22.3.</strong> The parties agree that proceedings falling within the scope of this valid exclusive
            jurisdiction agreement shall be instituted before the competent courts in Erode, Tamil Nadu.
          </p>
          <p>
            <strong>22.4.</strong> No provision of these Terms shall exclude or restrict the jurisdiction of a consumer
            commission, regulatory authority, tribunal, or other forum where such jurisdiction is mandatory or cannot lawfully
            be excluded by agreement.
          </p>
          <p>
            <strong>22.5.</strong> Nothing in this section prevents any person from exercising non-waivable rights or remedies
            available under applicable law.
          </p>
        </Section>

        {/* ── 23. Dispute Resolution ── */}
        <Section title="23. Dispute Resolution" id="disputes">
          <p>
            <strong>23.1.</strong> Users are encouraged to first report service-related disputes to URPASS through its official
            support contact.
          </p>
          <p>
            <strong>23.2.</strong> URPASS and the affected party may attempt to resolve the matter through good-faith
            communication.
          </p>
          <p>
            <strong>23.3.</strong> Either party may pursue mediation or another lawful dispute resolution method by mutual
            agreement.
          </p>
          <p>
            <strong>23.4.</strong> Informal dispute resolution is voluntary and does not prevent a party from approaching a
            competent court, consumer commission, regulator, or other legally authorized forum.
          </p>
          <p>
            <strong>23.5.</strong> Any applicable legal limitation period or statutory remedy remains unaffected by this
            section.
          </p>
        </Section>

        {/* ── 24. Changes to These Terms ── */}
        <Section title="24. Changes to These Terms" id="changes">
          <p>
            <strong>24.1.</strong> URPASS may update these Terms to reflect changes in services, technology, regulations,
            business practices, or security requirements.
          </p>
          <p>
            <strong>24.2.</strong> Material changes will be communicated through appropriate channels, such as email, account
            notification, or website notices, as required by applicable law.
          </p>
          <p>
            <strong>24.3.</strong> Updated Terms will display a revised effective date.
          </p>
          <p>
            <strong>24.4.</strong> Changes will not retrospectively remove expressly guaranteed paid rights except where
            permitted by the applicable contract or law.
          </p>
          <p>
            <strong>24.5.</strong> Continued use of the Service after properly notified changes become effective may
            constitute acceptance where legally valid. Where affirmative consent is required, URPASS will obtain it.
          </p>
        </Section>

        {/* ── 25. General Provisions ── */}
        <Section title="25. General Provisions" id="general">
          <p>
            <strong>25.1. Severability:</strong> If a provision is found unenforceable, the remaining provisions will continue
            to apply to the extent legally possible.
          </p>
          <p>
            <strong>25.2. No Waiver:</strong> A failure to enforce a provision does not automatically waive the right to
            enforce it later.
          </p>
          <p>
            <strong>25.3. Assignment:</strong> Customers may not transfer their account or agreement without authorization,
            except where law permits. URPASS may assign its rights and obligations in connection with a lawful business
            restructuring or transfer, subject to applicable contractual and legal protections.
          </p>
          <p>
            <strong>25.4. Entire Agreement:</strong> These Terms, applicable purchase terms, incorporated policies, and
            authorized written agreements collectively govern the relevant service.
          </p>
          <p>
            <strong>25.5. Survival:</strong> Provisions concerning outstanding payments, intellectual property, liability,
            dispute resolution, and other obligations intended to survive will remain effective after termination where
            applicable.
          </p>
        </Section>

        {/* ── 26. Contact Information ── */}
        <Section title="26. Contact Information" id="contact">
          <p>For questions concerning URPASS services, subscriptions, billing, legal notices, or these Terms, contact:</p>
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3 mt-3">
            <div className="font-bold text-neutral-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand" />
              URPASS — Legal &amp; Support Team
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                Website:{" "}
                <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-medium">
                  {WEBSITE_URL}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand hover:underline font-medium">
                  {CONTACT_EMAIL}
                </a>
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-neutral-700 pt-1 border-t border-neutral-200">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong>Governing Law:</strong> India
                <br />
                <strong>Contractually Selected Court Jurisdiction:</strong> Erode, Tamil Nadu, India, subject to applicable law.
              </div>
            </div>
          </div>
        </Section>

        <div className="pt-10 border-t border-neutral-100 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-brand hover:underline underline-offset-2">
            &larr; Back to Home
          </Link>
          <p className="text-xs text-neutral-400 font-mono">&copy; 2026 URPASS. All rights reserved.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
