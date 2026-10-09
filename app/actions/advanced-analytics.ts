'use server';

import { createClient } from '@/lib/supabase/server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getFullEventAnalytics } from '@/lib/advanced-analytics';
import type { AnalyticsFilter, FullEventAnalyticsReport } from '@/lib/advanced-analytics/types';

export async function getEventAdvancedAnalyticsAction(
  eventId: string,
  filter?: AnalyticsFilter
): Promise<{ success: boolean; data?: FullEventAnalyticsReport; error?: string; disabled?: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    // Verify organizer permission
    const { data: event } = await supabase
      .from('events')
      .select('id, organizer_id, custom_pass_design')
      .eq('id', eventId)
      .single();

    if (!event || event.organizer_id !== user.id) {
      return { success: false, error: 'You are not authorized to view analytics for this event.' };
    }

    // Check feature flag
    const enabled = isFeatureEnabled(event, 'advanced_analytics');
    if (!enabled) {
      return {
        success: false,
        disabled: true,
        error: 'Advanced Analytics is not enabled for this event. Enable it in Settings → Advanced Features.',
      };
    }

    const report = await getFullEventAnalytics(eventId, filter);
    return { success: true, data: report };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to generate analytics report.' };
  }
}
