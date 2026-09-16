"use server";

import { createClient } from "@/lib/supabase/server";

export interface ApiUsage {
  api_requests: number;
  registrations: number;
  check_ins: number;
  events: number;
  year_month: string;
}

export async function getApiUsage(): Promise<ApiUsage> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { api_requests: 0, registrations: 0, check_ins: 0, events: 0, year_month: "" };
  }

  const yearMonth = new Date().toISOString().slice(0, 7);

  const { data } = await supabase
    .from("api_usage")
    .select("api_requests, registrations, check_ins, events, year_month")
    .eq("user_id", user.id)
    .eq("year_month", yearMonth)
    .single();

  if (!data) {
    return { api_requests: 0, registrations: 0, check_ins: 0, events: 0, year_month: yearMonth };
  }

  return data as ApiUsage;
}
