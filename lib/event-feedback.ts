export type QuestionType =
  | "rating"
  | "nps"
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "paragraph"
  | "yes_no"
  | "dropdown";

export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
  scaleStartLabel?: string;
  scaleEndLabel?: string;
}

export interface FormBrandingTheme {
  primaryColor: string;
  themePreset: "violet" | "blue" | "emerald" | "amber" | "rose" | "dark";
  submitButtonText: string;
}

export interface FormThankYouConfig {
  headline: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface FeedbackAspect {
  id: string;
  label: string;
  type: "rating";
  enabled: boolean;
}

export interface FeedbackCustomQuestion {
  id: string;
  label: string;
  type: "text" | "rating";
  required: boolean;
}

export interface EventFeedbackFormConfig {
  id?: string;
  event_id: string;
  title: string;
  description: string;
  is_enabled: boolean;
  allow_anonymous: boolean;
  require_attendee_email: boolean;
  require_attendee_name?: boolean;

  // Rich Customizable Form Builder Questions
  questions: FormQuestion[];

  // Form Branding & Appearance
  theme: FormBrandingTheme;

  // Post-submission Thank You screen customization
  thank_you: FormThankYouConfig;

  // Legacy fields preserved for backwards compatibility
  aspects: FeedbackAspect[];
  enable_nps: boolean;
  nps_question: string;
  custom_questions: FeedbackCustomQuestion[];
  updated_at?: string;
}

export interface AttendeeFeedbackSubmission {
  id: string;
  event_id: string;
  attendee_id?: string | null;
  attendee_name?: string | null;
  attendee_email?: string | null;
  rating: number; // 1-5
  nps_score?: number | null; // 0-10
  feedback_text?: string | null;
  aspects?: Record<string, number>;
  answers?: Record<string, string | string[] | number | boolean>;
  created_at: string;
}

export interface FeedbackAnalyticsStats {
  totalCount: number;
  averageRating: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  npsScore: number | null; // -100 to +100
  npsBreakdown: {
    promoters: number; // 9-10
    passives: number;  // 7-8
    detractors: number; // 0-6
  };
  aspectAverages: Record<string, { label: string; average: number; count: number }>;
}

export const DEFAULT_ASPECTS: FeedbackAspect[] = [
  { id: "overall", label: "Overall Experience", type: "rating", enabled: true },
  { id: "organization", label: "Organization & Flow", type: "rating", enabled: true },
  { id: "venue", label: "Venue & Atmosphere", type: "rating", enabled: true },
  { id: "content", label: "Speakers & Content", type: "rating", enabled: true },
];

export const DEFAULT_CUSTOM_QUESTIONS: FeedbackCustomQuestion[] = [
  {
    id: "highlight",
    label: "What was your favorite highlight or session?",
    type: "text",
    required: false,
  },
  {
    id: "improvements",
    label: "What could we improve for our next event?",
    type: "text",
    required: false,
  },
];

export const DEFAULT_QUESTIONS: FormQuestion[] = [
  {
    id: "overall_rating",
    type: "rating",
    label: "How would you rate your overall experience?",
    description: "Rate from 1 to 5 stars",
    required: true,
    maxRating: 5,
  },
  {
    id: "session_quality",
    type: "single_choice",
    label: "Which track or session stood out to you most?",
    description: "Select the most valuable session",
    required: false,
    options: ["Keynote Session", "Technical Deep-Dive", "Panel Discussion", "Interactive Workshop"],
  },
  {
    id: "nps",
    type: "nps",
    label: "How likely are you to recommend our events to a colleague or friend?",
    description: "0 = Not at all likely, 10 = Extremely likely",
    required: false,
    scaleStartLabel: "Not likely",
    scaleEndLabel: "Extremely likely",
  },
  {
    id: "attend_again",
    type: "yes_no",
    label: "Would you attend our future events or next edition?",
    required: false,
  },
  {
    id: "highlight",
    type: "text",
    label: "What was your favorite moment or key takeaway?",
    description: "A short sentence or thought",
    required: false,
  },
  {
    id: "improvements",
    type: "paragraph",
    label: "What could we improve or do better for next time?",
    description: "Suggestions on logistics, topics, networking, or venue",
    required: false,
  },
];

export const FORM_THEME_PRESETS: Record<
  FormBrandingTheme["themePreset"],
  { name: string; hex: string; bg: string; border: string; text: string }
> = {
  violet: {
    name: "Royal Violet",
    hex: "#6D28D9",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  blue: {
    name: "Electric Blue",
    hex: "#2563EB",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  emerald: {
    name: "Emerald Green",
    hex: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  amber: {
    name: "Sunset Amber",
    hex: "#D97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  rose: {
    name: "Vibrant Rose",
    hex: "#E11D48",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
  },
  dark: {
    name: "Modern Onyx",
    hex: "#18181B",
    bg: "bg-neutral-100",
    border: "border-neutral-300",
    text: "text-neutral-900",
  },
};

export const FORM_TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    iconName: string;
    questions: FormQuestion[];
  }
> = {
  conference: {
    name: "Tech Summit & Conference",
    description: "Ideal for conferences, summits, and symposiums with speakers and panels",
    iconName: "Presentation",
    questions: [
      {
        id: "q_conf_overall",
        type: "rating",
        label: "Overall Conference Experience",
        description: "How would you rate the conference overall?",
        required: true,
        maxRating: 5,
      },
      {
        id: "q_conf_speakers",
        type: "rating",
        label: "Speaker Quality & Relevance",
        description: "Content depth, delivery, and presentation quality",
        required: true,
        maxRating: 5,
      },
      {
        id: "q_conf_tracks",
        type: "multiple_choice",
        label: "Which tracks did you attend?",
        required: false,
        options: ["AI & Cloud Track", "Design & UX Track", "Product Strategy", "Hands-on Workshops"],
      },
      {
        id: "q_conf_nps",
        type: "nps",
        label: "How likely are you to recommend this conference to your peers?",
        required: true,
        scaleStartLabel: "Not likely",
        scaleEndLabel: "Extremely likely",
      },
      {
        id: "q_conf_highlight",
        type: "text",
        label: "What was the single most valuable takeaway for you?",
        required: false,
      },
      {
        id: "q_conf_future",
        type: "paragraph",
        label: "What topics or speakers would you love to see next year?",
        required: false,
      },
    ],
  },
  hackathon: {
    name: "Hackathon & Builder Day",
    description: "Tailored for hackathons, coding sprints, and project showcases",
    iconName: "Code",
    questions: [
      {
        id: "q_hack_overall",
        type: "rating",
        label: "Overall Hackathon Experience",
        required: true,
        maxRating: 5,
      },
      {
        id: "q_hack_mentors",
        type: "rating",
        label: "Mentorship & Technical Guidance",
        description: "Availability and helpfulness of mentors and judges",
        required: false,
        maxRating: 5,
      },
      {
        id: "q_hack_problem",
        type: "single_choice",
        label: "How did you find the problem statements & challenges?",
        required: false,
        options: ["Too Easy", "Balanced & Exciting", "Extremely Challenging", "Vague / Needs Clarity"],
      },
      {
        id: "q_hack_facilities",
        type: "rating",
        label: "Food, Internet & Venue Facilities",
        required: false,
        maxRating: 5,
      },
      {
        id: "q_hack_participate_again",
        type: "yes_no",
        label: "Would you participate in our next hackathon?",
        required: true,
      },
      {
        id: "q_hack_suggestions",
        type: "paragraph",
        label: "Any shoutouts for organizers or things we should improve?",
        required: false,
      },
    ],
  },
  cultural: {
    name: "College Fest & Cultural Event",
    description: "Designed for campus fests, music concerts, and cultural competitions",
    iconName: "Sparkles",
    questions: [
      {
        id: "q_fest_vibe",
        type: "rating",
        label: "Overall Fest Vibe & Energy",
        description: "Rate the crowd, ambiance, and entertainment",
        required: true,
        maxRating: 5,
      },
      {
        id: "q_fest_entry",
        type: "rating",
        label: "Gate Entry & Pass Verification Speed",
        description: "Was QR check-in smooth and fast?",
        required: false,
        maxRating: 5,
      },
      {
        id: "q_fest_highlight",
        type: "dropdown",
        label: "Which segment was your personal favorite?",
        required: false,
        options: ["Celebrity / DJ Night", "Stage Competitions", "Food Stalls", "Games & Stalls"],
      },
      {
        id: "q_fest_nps",
        type: "nps",
        label: "How likely are you to bring friends to our next fest?",
        required: false,
        scaleStartLabel: "Never",
        scaleEndLabel: "Definitely!",
      },
      {
        id: "q_fest_comments",
        type: "paragraph",
        label: "What made your day special or what could be better?",
        required: false,
      },
    ],
  },
  quick: {
    name: "Quick 3-Question Pulse",
    description: "Short and sweet survey with the highest attendee completion rate",
    iconName: "Zap",
    questions: [
      {
        id: "q_quick_rating",
        type: "rating",
        label: "How would you rate today's event?",
        required: true,
        maxRating: 5,
      },
      {
        id: "q_quick_highlight",
        type: "text",
        label: "What was the highlight or most helpful part?",
        required: false,
      },
      {
        id: "q_quick_improvements",
        type: "paragraph",
        label: "What is one thing we could do better?",
        required: false,
      },
    ],
  },
};

export function getDefaultFormConfig(eventId: string, eventName = "the event"): EventFeedbackFormConfig {
  return {
    event_id: eventId,
    title: `Share Your Feedback for ${eventName}`,
    description: `Thank you for joining us at ${eventName}! We'd love your candid thoughts to make future events even more rewarding.`,
    is_enabled: true,
    allow_anonymous: true,
    require_attendee_email: false,
    require_attendee_name: false,
    questions: DEFAULT_QUESTIONS,
    theme: {
      primaryColor: "#6D28D9",
      themePreset: "violet",
      submitButtonText: "Submit Event Feedback",
    },
    thank_you: {
      headline: "Thank You for Your Feedback!",
      message: `Your response has been delivered directly to the organizers of ${eventName}. Your insights help us curate an even better experience next time.`,
      ctaText: "Explore More Events on URPASS",
      ctaUrl: "https://urpass.space",
    },
    // Backwards-compatible defaults
    aspects: DEFAULT_ASPECTS,
    enable_nps: true,
    nps_question: "How likely are you to recommend our future events to a friend or colleague?",
    custom_questions: DEFAULT_CUSTOM_QUESTIONS,
  };
}

export function createEmptyStats(): FeedbackAnalyticsStats {
  return {
    totalCount: 0,
    averageRating: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    npsScore: null,
    npsBreakdown: { promoters: 0, passives: 0, detractors: 0 },
    aspectAverages: {},
  };
}

export function calculateFeedbackStats(
  responses: AttendeeFeedbackSubmission[],
  aspectConfigs: FeedbackAspect[] = DEFAULT_ASPECTS
): FeedbackAnalyticsStats {
  const stats = createEmptyStats();
  if (responses.length === 0) return stats;

  stats.totalCount = responses.length;
  let totalRatingSum = 0;

  const aspectSums: Record<string, { sum: number; count: number }> = {};
  for (const a of aspectConfigs) {
    aspectSums[a.id] = { sum: 0, count: 0 };
  }

  let npsPromoters = 0;
  let npsPassives = 0;
  let npsDetractors = 0;
  let npsCount = 0;

  for (const r of responses) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    stats.ratingBreakdown[star] = (stats.ratingBreakdown[star] || 0) + 1;
    totalRatingSum += r.rating;

    // NPS
    if (r.nps_score !== null && r.nps_score !== undefined) {
      npsCount++;
      if (r.nps_score >= 9) npsPromoters++;
      else if (r.nps_score >= 7) npsPassives++;
      else npsDetractors++;
    }

    // Aspects
    if (r.aspects) {
      for (const [key, val] of Object.entries(r.aspects)) {
        if (typeof val === "number" && val > 0) {
          if (!aspectSums[key]) aspectSums[key] = { sum: 0, count: 0 };
          aspectSums[key].sum += val;
          aspectSums[key].count += 1;
        }
      }
    }
  }

  stats.averageRating = Number((totalRatingSum / responses.length).toFixed(1));

  if (npsCount > 0) {
    const promoterPct = (npsPromoters / npsCount) * 100;
    const detractorPct = (npsDetractors / npsCount) * 100;
    stats.npsScore = Math.round(promoterPct - detractorPct);
    stats.npsBreakdown = {
      promoters: npsPromoters,
      passives: npsPassives,
      detractors: npsDetractors,
    };
  }

  for (const aspect of aspectConfigs) {
    const entry = aspectSums[aspect.id];
    if (entry && entry.count > 0) {
      stats.aspectAverages[aspect.id] = {
        label: aspect.label,
        average: Number((entry.sum / entry.count).toFixed(1)),
        count: entry.count,
      };
    }
  }

  return stats;
}
