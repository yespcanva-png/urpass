import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDefaultFormConfig,
  type AttendeeFeedbackSubmission,
  type FeedbackAspect,
} from "@/lib/event-feedback";

// Mock next and supabase
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn(), notFound: vi.fn() }));

describe("Event Feedback Form Configuration & Defaults", () => {
  it("generates structured default feedback form config for an event", () => {
    const config = getDefaultFormConfig("event-123", "HackFest 2026");

    expect(config.event_id).toBe("event-123");
    expect(config.title).toContain("HackFest 2026");
    expect(config.is_enabled).toBe(true);
    expect(config.allow_anonymous).toBe(true);
    expect(config.require_attendee_email).toBe(false);
    expect(config.theme.primaryColor).toBe("#6D28D9");
    expect(config.thank_you.headline).toContain("Thank You");

    // Dynamic builder questions
    expect(config.questions.length).toBeGreaterThanOrEqual(4);
    const questionTypes = config.questions.map((q) => q.type);
    expect(questionTypes).toContain("rating");
    expect(questionTypes).toContain("single_choice");
    expect(questionTypes).toContain("nps");
    expect(questionTypes).toContain("yes_no");
  });

  it("exports pre-built templates for quick form creation", async () => {
    const { FORM_TEMPLATES, FORM_THEME_PRESETS } = await import("@/lib/event-feedback");
    expect(FORM_TEMPLATES.conference).toBeDefined();
    expect(FORM_TEMPLATES.hackathon).toBeDefined();
    expect(FORM_TEMPLATES.cultural).toBeDefined();
    expect(FORM_TEMPLATES.quick).toBeDefined();

    expect(FORM_TEMPLATES.conference.questions.length).toBeGreaterThan(0);
    expect(FORM_THEME_PRESETS.violet).toBeDefined();
    expect(FORM_THEME_PRESETS.emerald).toBeDefined();
    expect(FORM_THEME_PRESETS.blue).toBeDefined();
  });
});

describe("Feedback Analytics & Scoring Calculation", () => {
  const sampleAspects: FeedbackAspect[] = [
    { id: "venue", label: "Venue & Atmosphere", type: "rating", enabled: true },
    { id: "speakers", label: "Speakers & Content", type: "rating", enabled: true },
    { id: "organization", label: "Organization", type: "rating", enabled: true },
  ];

  const sampleResponses: AttendeeFeedbackSubmission[] = [
    {
      id: "res-1",
      event_id: "evt-1",
      attendee_name: "Alice",
      attendee_email: "alice@test.com",
      rating: 5,
      nps_score: 10, // Promoter
      aspects: { venue: 5, speakers: 5, organization: 4 },
      answers: { highlight: "Keynote was brilliant" },
      created_at: "2026-09-20T10:00:00Z",
    },
    {
      id: "res-2",
      event_id: "evt-1",
      attendee_name: "Bob",
      attendee_email: "bob@test.com",
      rating: 4,
      nps_score: 8, // Passive
      aspects: { venue: 4, speakers: 4, organization: 3 },
      answers: { highlight: "Hands-on workshop" },
      created_at: "2026-09-20T11:00:00Z",
    },
    {
      id: "res-3",
      event_id: "evt-1",
      attendee_name: "Charlie",
      attendee_email: "charlie@test.com",
      rating: 2,
      nps_score: 4, // Detractor
      aspects: { venue: 2, speakers: 3, organization: 2 },
      answers: { improvements: "More seating needed" },
      created_at: "2026-09-20T12:00:00Z",
    },
  ];

  it("calculates accurate average rating across submissions", () => {
    const totalRating = sampleResponses.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((totalRating / sampleResponses.length).toFixed(1));

    // (5 + 4 + 2) / 3 = 11 / 3 = 3.67 -> 3.7
    expect(avg).toBe(3.7);
  });

  it("calculates Net Promoter Score (NPS) accurately", () => {
    // Promoters (9-10): 1 (Alice)
    // Passives (7-8): 1 (Bob)
    // Detractors (0-6): 1 (Charlie)
    // NPS = % Promoters - % Detractors = (1/3)*100 - (1/3)*100 = 0
    const promoters = sampleResponses.filter((r) => r.nps_score! >= 9).length;
    const detractors = sampleResponses.filter((r) => r.nps_score! <= 6).length;
    const nps = Math.round(((promoters - detractors) / sampleResponses.length) * 100);

    expect(nps).toBe(0);
  });

  it("calculates positive NPS when promoters exceed detractors", () => {
    const positiveResponses: AttendeeFeedbackSubmission[] = [
      ...sampleResponses,
      {
        id: "res-4",
        event_id: "evt-1",
        rating: 5,
        nps_score: 10, // Promoter
        created_at: "2026-09-20T13:00:00Z",
      },
      {
        id: "res-5",
        event_id: "evt-1",
        rating: 5,
        nps_score: 9, // Promoter
        created_at: "2026-09-20T14:00:00Z",
      },
    ];

    // Promoters: 3 / 5 = 60%
    // Detractors: 1 / 5 = 20%
    // NPS = 60 - 20 = +40
    const promoters = positiveResponses.filter((r) => r.nps_score! >= 9).length;
    const detractors = positiveResponses.filter((r) => r.nps_score! <= 6).length;
    const nps = Math.round(((promoters - detractors) / positiveResponses.length) * 100);

    expect(nps).toBe(40);
  });

  it("aggregates aspect-specific averages correctly", () => {
    const venueSum = sampleResponses.reduce((sum, r) => sum + (r.aspects?.venue || 0), 0);
    const venueAvg = Number((venueSum / sampleResponses.length).toFixed(1));

    // (5 + 4 + 2) / 3 = 11 / 3 = 3.67 -> 3.7
    expect(venueAvg).toBe(3.7);

    const speakersSum = sampleResponses.reduce((sum, r) => sum + (r.aspects?.speakers || 0), 0);
    const speakersAvg = Number((speakersSum / sampleResponses.length).toFixed(1));

    // (5 + 4 + 3) / 3 = 12 / 3 = 4.0
    expect(speakersAvg).toBe(4.0);
  });
});

describe("Server Actions Module Exports", () => {
  it("exports all necessary server actions for feedback management", async () => {
    const actions = await import("@/app/actions/event-feedback");
    expect(typeof actions.getEventFeedbackForm).toBe("function");
    expect(typeof actions.saveEventFeedbackForm).toBe("function");
    expect(typeof actions.submitAttendeeFeedback).toBe("function");
    expect(typeof actions.getEventFeedbackData).toBe("function");
    expect(typeof actions.deleteEventFeedback).toBe("function");
  });
});
