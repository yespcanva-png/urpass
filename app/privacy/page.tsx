import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & UK GDPR Compliance — URPASS",
  description:
    "Learn how URPASS collects, processes, and protects your personal data in accordance with the UK GDPR, Data Protection Act 2018, and international privacy standards.",
  alternates: { canonical: "https://urpass.space/privacy" },
};

const EFFECTIVE_DATE = "28 September 2026";
const DPO_EMAIL = "privacy@urpass.space";

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        {title}
      </h2>
      <div className="text-sm text-neutral-600 leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-900 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="inline-flex items-center gap-2 bg-purple-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-4">
          <Shield className="w-3.5 h-3.5" />
          UK GDPR &amp; DATA PRIVACY
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
          Privacy Policy &amp; Data Protection Notice
        </h1>
        <p className="text-sm text-neutral-400 mb-10">
          Effective date: {EFFECTIVE_DATE} &middot; Last updated: September 2026
        </p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-10 text-xs text-neutral-600 leading-relaxed space-y-2">
          <div className="font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand" />
            Summary for UK &amp; International Users
          </div>
          <p>
            URPASS complies with the <strong>UK General Data Protection Regulation (UK GDPR)</strong>, the{" "}
            <strong>Data Protection Act 2018 (DPA 2018)</strong>, and the{" "}
            <strong>Privacy and Electronic Communications Regulations (PECR)</strong>.
          </p>
          <p>
            When you register for an event organized by a third-party host, <strong>the Event Organizer is the Data Controller</strong>, and URPASS acts as the <strong>Data Processor</strong>. When you create an organizer account with URPASS, URPASS is the <strong>Data Controller</strong> of your account information.
          </p>
        </div>

        <Section title="1. Who We Are">
          <p>
            URPASS (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the digital event registration, ticketing, pass generation, and entrance check-in platform available at{" "}
            <a href="https://urpass.space" className="text-brand underline">urpass.space</a>.
          </p>
          <p>
            If you have questions regarding this Privacy Policy or your data protection rights under the UK GDPR, you can contact our Data Protection desk at:
          </p>
          <p className="font-mono text-xs bg-neutral-100 p-3 rounded-lg border border-neutral-200">
            Email: {DPO_EMAIL} / srinithin@yespstudio.com<br />
            Address: Yesp Corporation, Data Protection Office<br />
            Subject: UK GDPR Data Subject Access / Erasure Request
          </p>
        </Section>

        <Section title="2. The Data We Collect">
          <p>We collect personal information depending on how you interact with our platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Event Attendees:</strong> Full name, email address, mobile phone number, ticket tier, custom registration answers configured by the organizer (e.g. dietary requirements, company, student ID number), check-in timestamp, and entry gate location.
            </li>
            <li>
              <strong>Event Organizers &amp; Staff:</strong> Name, work email address, organization name, billing details, password hash, IP address, and role permissions (Admin, Event Manager, Scanner).
            </li>
            <li>
              <strong>Payment &amp; Billing Data:</strong> Transaction ID, invoice address, VAT / GST number, card brand, and last 4 digits. Full credit/debit card numbers and bank security codes are processed directly by our PCI-DSS Level 1 certified payment partners (Stripe and Razorpay) and are <em>never stored on URPASS servers</em>.
            </li>
            <li>
              <strong>Technical &amp; Log Data:</strong> Browser type, operating system, device camera access for QR scanning (camera video stream is processed entirely client-side and never recorded or transmitted to servers), IP address, and approximate geolocation.
            </li>
          </ul>
        </Section>

        <Section title="3. Lawful Basis for Processing (UK GDPR Article 6)">
          <p>Under the UK GDPR, we process your personal data under the following legal bases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Performance of a Contract (Article 6(1)(b)):</strong> To deliver digital event passes, issue tax invoices, process payments, and validate your ticket entry at the gate.
            </li>
            <li>
              <strong>Legitimate Interests (Article 6(1)(f)):</strong> To detect duplicate QR ticket entry, prevent fraud, secure our servers, and ensure scanner speed and reliability.
            </li>
            <li>
              <strong>Legal Obligation (Article 6(1)(c)):</strong> To comply with tax, statutory accounting, and financial reporting laws (e.g. HMRC VAT and Indian GST invoicing).
            </li>
            <li>
              <strong>Consent (Article 6(1)(a)):</strong> For optional promotional updates, non-essential cookies, or specialized registration field questions.
            </li>
          </ul>
        </Section>

        <Section title="4. How Long We Keep Your Data">
          <p>
            We retain attendee data only for as long as necessary to fulfill the purposes of the event and satisfy legal, accounting, and reporting obligations:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Event Pass &amp; Check-In Logs:</strong> Retained for 12 months following event completion, after which organizers can archive or permanently delete attendee lists.</li>
            <li><strong>Financial Invoices &amp; Receipts:</strong> Retained for 6 years in compliance with HMRC and statutory tax rules.</li>
            <li><strong>Inactive User Accounts:</strong> Deleted or anonymized after 24 months of total inactivity.</li>
          </ul>
        </Section>

        <Section title="5. Your Rights Under UK GDPR">
          <p>As a data subject in the United Kingdom or European Economic Area, you have significant rights:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right of Access (Article 15):</strong> Request a copy of all personal data we hold about you.</li>
            <li><strong>Right to Rectification (Article 16):</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure / Right to be Forgotten (Article 17):</strong> Request deletion of your attendee pass data and personal profile.</li>
            <li><strong>Right to Restrict Processing (Article 18):</strong> Ask us to restrict how we use your information.</li>
            <li><strong>Right to Data Portability (Article 20):</strong> Receive your data in a structured, machine-readable format (CSV/JSON).</li>
            <li><strong>Right to Object (Article 21):</strong> Object to any processing based on legitimate interests.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at <a href={`mailto:${DPO_EMAIL}`} className="text-brand underline">{DPO_EMAIL}</a>. We respond to all verified UK GDPR requests within 30 days without charge.
          </p>
          <p>
            You also have the right to lodge a complaint with the UK supervisory authority, the <strong>Information Commissioner&apos;s Office (ICO)</strong>, at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand underline">ico.org.uk</a>.
          </p>
        </Section>

        <Section title="6. Cookies &amp; PECR Compliance">
          <p>
            Under the Privacy and Electronic Communications Regulations (PECR), we use strictly necessary cookies to keep you signed in and preserve session security. Non-essential analytical cookies require your explicit prior consent via our cookie banner.
          </p>
          <p>
            You can modify your cookie preferences at any time by clearing your browser cache or clicking &quot;Cookie Preferences&quot; in our footer.
          </p>
        </Section>

        <Section title="7. Data Processing Addendum (DPA) for Organizers">
          <p>
            For corporate, university, and business organizers acting as Data Controllers under the UK GDPR, our standard Data Processing Addendum (DPA) governs all attendee processing. By using URPASS to collect registrations, you agree to our standard contractual clauses ensuring GDPR-compliant data processing.
          </p>
        </Section>
      </div>
    </div>
  );
}
