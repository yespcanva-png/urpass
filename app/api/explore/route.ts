import { NextRequest, NextResponse } from "next/server";
import { fetchExploreMarketplaceEvents } from "@/lib/explore/service";
import type {
  ExploreCategory,
  ExploreDateFilter,
  ExplorePricingFilter,
  ExploreQueryParams,
  ExploreSortOrder,
} from "@/lib/explore/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: ExploreQueryParams = {
      query: searchParams.get("q") || undefined,
      city: searchParams.get("city") || undefined,
      category: (searchParams.get("category") as ExploreCategory) || undefined,
      dateFilter: (searchParams.get("date") as ExploreDateFilter) || undefined,
      pricing: (searchParams.get("pricing") as ExplorePricingFilter) || undefined,
      sort: (searchParams.get("sort") as ExploreSortOrder) || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    };

    const result = await fetchExploreMarketplaceEvents(params);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to query Explore marketplace",
      },
      { status: 500 }
    );
  }
}
