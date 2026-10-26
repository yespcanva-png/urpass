export type ExploreCategory =
  | "all"
  | "music"
  | "business"
  | "workshops"
  | "festivals"
  | "food_drink"
  | "sports"
  | "arts"
  | "community";

export interface CategoryOption {
  key: ExploreCategory;
  label: string;
}

export const EXPLORE_CATEGORIES: CategoryOption[] = [
  { key: "all", label: "All" },
  { key: "music", label: "Music" },
  { key: "business", label: "Business" },
  { key: "workshops", label: "Workshops" },
  { key: "festivals", label: "Festivals" },
  { key: "food_drink", label: "Food & Drink" },
  { key: "sports", label: "Sports" },
  { key: "arts", label: "Arts" },
  { key: "community", label: "Community" },
];

export const EXPLORE_CITIES = [
  "All Cities",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Coimbatore",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Kochi",
  "Thiruvananthapuram",
  "Madurai",
  "Erode",
  "Tiruppur",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "London",
  "Online",
] as const;

export type ExploreCity = (typeof EXPLORE_CITIES)[number];

export type ExploreDateFilter = "all" | "today" | "this_weekend" | "this_month";
export type ExplorePricingFilter = "all" | "free" | "paid";
export type ExploreSortOrder = "soonest" | "recently_added" | "price_asc" | "price_desc";

export interface ExploreEventItem {
  id: string;
  eventId: string;
  slug: string;
  name: string;
  description: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  category: ExploreCategory;
  categoryLabel: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  minPricePaise: number;
  currency: string;
  isFree: boolean;
  featured: boolean;
  organizerName: string;
  applicationEnabled: boolean;
  approvalRequired?: boolean;
  status: string;
}

export interface ExploreQueryParams {
  query?: string;
  city?: string;
  category?: ExploreCategory;
  dateFilter?: ExploreDateFilter;
  pricing?: ExplorePricingFilter;
  sort?: ExploreSortOrder;
  page?: number;
  limit?: number;
}

export interface ExploreQueryResult {
  events: ExploreEventItem[];
  featuredEvents: ExploreEventItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  activeCity: string;
  availableCities: string[];
}
