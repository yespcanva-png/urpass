import type { Metadata } from "next";
import { TrendingUp, BarChart3, Bot, Zap, PieChart, Activity } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AI Event Analytics & Attendance Velocity Intelligence | URPASS",
  description:
    "Real-time event analytics and attendance velocity intelligence powered by AI and Model Context Protocol (MCP). Forecast gate bottlenecks, track live check-ins, and generate instant post-event reports.",
  keywords: [
    "AI event analytics",
    "attendance velocity intelligence",
    "event check-in analytics AI",
    "MCP event stats",
    "real-time event reporting AI",
    "gate traffic forecasting",
    "URPASS event analytics",
  ],
  alternates: { canonical: "https://urpass.space/ai-event-analytics" },
  openGraph: {
    title: "AI Event Analytics & Attendance Velocity Intelligence | URPASS",
    description: "Analyze event attendance, gate velocity, and demographic distributions conversationally with AI agents connected via MCP.",
    url: "https://urpass.space/ai-event-analytics",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PREDICTIVE EVENT INTELLIGENCE",
        h1: "AI Event Analytics & Attendance Velocity Intelligence",
        canonicalUrl: "https://urpass.space/ai-event-analytics",
        description:
          "Unlock conversational event intelligence. With URPASS MCP analytics tools like get_event_stats and list_attendees, AI assistants query real-time check-in velocity, forecast gate arrival bottlenecks, and synthesize comprehensive post-event executive summaries in seconds.",
        ctaLabel: "Analyze Your Events with AI",
        features: [
          { icon: TrendingUp, title: "Real-Time Velocity Tracking", desc: "Monitor check-in velocity (scans per minute) across every entrance gate to detect arrival spikes and queue bottlenecks." },
          { icon: Bot, title: "Conversational Metric Queries", desc: "Ask: 'What percentage of VIP attendees checked in by 10 AM?' and receive immediate data-backed responses." },
          { icon: Zap, title: "Arrival Surge Forecasting", desc: "Predict peak entrance congestion using historical velocity curves and registration check-in patterns." },
          { icon: PieChart, title: "Cohort & Tier Breakdown", desc: "Break down registrations and turnout across ticket tiers, corporate affiliations, and geographical regions." },
          { icon: Activity, title: "Live Gate Load Balancing", desc: "Detect unbalanced gate queues in real time and reallocate scanning staff to clear lines before keynotes begin." },
          { icon: BarChart3, title: "1-Click Executive Reports", desc: "Have Claude or Cursor synthesize attendance metrics, drop-off rates, and feedback ratings into executive presentations." },
        ],
        steps: [
          { n: "01", title: "Mount Analytics Tools", desc: "Connect your AI assistant to the URPASS MCP server to grant access to get_event_stats and attendee data." },
          { n: "02", title: "Query Real-Time State", desc: "Prompt your agent during the event: 'Summarize today's check-in velocity and current gate occupancy.'" },
          { n: "03", title: "Identify Arrival Bottlenecks", desc: "The agent analyzes check-in timestamps and flags gates with high scan volumes or slow verification speeds." },
          { n: "04", title: "Optimize Gate Logistics", desc: "Direct venue staff to open extra scanning lanes or redirect attendees based on AI velocity insights." },
          { n: "05", title: "Generate Post-Event Synthesis", desc: "At the conclusion of the event, generate complete turnout percentages, peak hours, and sponsor ROI reports." },
        ],
        callout: {
          badge: "DATA-DRIVEN EVENT OPS",
          title: "Stop waiting days for post-event reports. Get live insights instantly.",
          description: "Traditional event platforms require downloading massive CSV files and building pivot tables in Excel to answer simple questions. URPASS combines real-time PostgreSQL analytics with Model Context Protocol, allowing organizers and sponsors to ask questions in plain English and receive instant answers.",
          bullets: [
            "Sub-second execution of complex aggregate queries across tens of thousands of records",
            "Automatic calculation of check-in velocity, show-up rates, and no-show percentages",
            "Correlates check-in timestamps with session schedules to assess track popularity",
            "Exportable to CSV, JSON, Markdown tables, or executive bullet-point summaries",
          ],
        },
        deepDiveSections: [
          {
            badge: "VELOCITY METRICS",
            title: "Understanding attendance velocity and gate throughput",
            paragraphs: [
              "Attendance velocity measures the rate at which participants cross venue thresholds over time. Monitoring this curve allows organizers to anticipate catering surges, adjust keynote start times, and balance staff across gates.",
              "The get_event_stats MCP tool aggregates total registrations, total checked-in, pending approvals, and check-in percentage, providing AI agents with the raw telemetry required to compute instantaneous velocity.",
            ],
            takeaway: "Empower event directors with actionable situational awareness throughout the event day.",
          },
          {
            badge: "POST-EVENT REPORTING",
            title: "Automating stakeholder and sponsor ROI debriefs",
            paragraphs: [
              "After an event, sponsors and leadership want to know turnout statistics, attendee demographics, and gate engagement. Manually compiling these decks takes hours.",
              "With URPASS MCP, you can simply instruct Claude: 'Generate an executive summary of our annual summit, highlighting total turnout, check-in velocity peaks, and registration conversion rates.'",
            ],
            takeaway: "Deliver professional stakeholder debriefs within 10 minutes of event closing.",
          },
        ],
        faqs: [
          { q: "Can I query historical events from previous years?", a: "Yes. The MCP server can query any past or active event associated with your organizer account." },
          { q: "Are attendee feedback survey responses included in analytics?", a: "Yes. Post-event survey ratings and qualitative comments are queryable through the analytics endpoints." },
          { q: "Is the data updated in real time as passes are scanned?", a: "Yes. Database mutations update immediately with zero caching lag, ensuring 100% accurate live metrics." },
        ],
        relatedLinks: [
          { title: "Real-Time Event Analytics", href: "/event-analytics", category: "Product" },
          { title: "Claude Desktop Event Ops", href: "/claude-desktop-event-management", category: "Product" },
          { title: "AI-Powered Event Check-In", href: "/ai-event-check-in", category: "Use Case" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
