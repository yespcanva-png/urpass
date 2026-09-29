import type { Metadata } from "next";
import { CreditCard, FileText, ShieldCheck, Zap, Ticket, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration and Payment System | URPASS by Yesp",
  description: "Complete event registration and payment system by Yesp Corporation. Collect custom attendee data, accept UPI and card payments via Razorpay, and issue instant passes with 0% platform commission.",
  keywords: [
    "event registration and payment system",
    "event registration payment gateway",
    "online event registration with payments",
    "UPI event registration",
    "Razorpay event ticketing system"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-and-payment-system" },
  openGraph: {
    title: "Event Registration and Payment System | URPASS by Yesp",
    description: "Complete event registration and payment system by Yesp Corporation. Collect custom attendee data and accept payments with 0% platform commission.",
    url: "https://urpass.space/event-registration-and-payment-system",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REGISTRATION & PAYMENTS",
        h1: "Integrated Event Registration and Payment System",
        canonicalUrl: "https://urpass.space/event-registration-and-payment-system",
        description: "URPASS by Yesp Corporation connects registration forms, direct payment collection, and instant digital pass delivery into one clean platform. Keep 100% of your ticket revenue.",
        ctaLabel: "Start Collecting Registrations",
        directAnswer: {
          title: "How does the URPASS registration and payment system work?",
          summary: "URPASS provides an integrated workflow where attendees complete customizable registration questionnaires and settle fees via native payment gateways (UPI, Credit/Debit cards, Net Banking via Razorpay). Once payment succeeds, the system automatically marks the record as approved, triggers payment webhooks, and issues a tamper-proof digital QR pass.",
          keyPoints: [
            "0% platform commission fees — zero hidden revenue cuts",
            "Native payment support for UPI (Google Pay, PhonePe, Paytm) and international cards",
            "Automatic invoice and QR pass generation upon successful transaction",
            "Instant reconciliation and attendee approval automation"
          ]
        },
        features: [
          { icon: FileText, title: "Custom Registration Fields", desc: "Collect attendee phone numbers, organization names, department details, or dietary preferences effortlessly." },
          { icon: CreditCard, title: "Instant UPI & Card Rails", desc: "Native Razorpay integration supports high-conversion checkout flows across India and international markets." },
          { icon: Zap, title: "Automated Pass Delivery", desc: "Digital QR credentials are created and emailed the instant payment authorization is confirmed." },
          { icon: ShieldCheck, title: "PCI-DSS Compliant Security", desc: "Payments are processed securely through certified gateway infrastructure without storing sensitive cardholder data." },
          { icon: Ticket, title: "Multi-Price Tiers & Discounts", desc: "Create early-bird discounts, student rates, VIP tickets, and group booking tiers." },
          { icon: Users, title: "Financial Reporting & Exports", desc: "Track gross revenue, completed transactions, and export comprehensive reconciliation sheets in CSV." }
        ],
        faqs: [
          { q: "How quickly do ticket funds reach our bank account?", a: "Funds are deposited directly into your linked bank account via standard Razorpay settlement cycles (T+2 business days)." },
          { q: "Are platform fees deducted from ticket transactions?", a: "URPASS charges 0% platform commission fees. Only standard payment gateway processing fees apply." },
          { q: "Who developed this registration and payment system?", a: "URPASS is engineered and operated by Yesp Corporation." }
        ]
      }}
    />
  );
}
