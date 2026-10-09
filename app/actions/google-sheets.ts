'use server';

import { createClient } from '@/lib/supabase/server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import {
  getGoogleSheetsSettings,
  executeGoogleSheetsSync,
} from '@/lib/google-sheets';
import type {
  GoogleSheetsConnection,
  GoogleSheetsSyncConfig,
  GoogleSheetsSyncJob,
  GoogleSheetsSyncTab,
} from '@/lib/google-sheets/types';

export async function getGoogleSheetsConnectionAction(eventId: string): Promise<{
  success: boolean;
  connection?: GoogleSheetsConnection;
  error?: string;
  disabled?: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    const { data: event } = await supabase
      .from('events')
      .select('id, organizer_id, custom_pass_design')
      .eq('id', eventId)
      .single();

    if (!event || event.organizer_id !== user.id) {
      return { success: false, error: 'You are not authorized to view Google Sheets settings for this event.' };
    }

    const enabled = isFeatureEnabled(event, 'google_sheets');
    if (!enabled) {
      return {
        success: false,
        disabled: true,
        error: 'Google Sheets Integration is not enabled for this event. Enable it in Settings → Advanced Features.',
      };
    }

    const config = getGoogleSheetsSettings(event);

    const connection: GoogleSheetsConnection = {
      eventId,
      connected: Boolean(config.spreadsheetId),
      spreadsheetId: config.spreadsheetId,
      spreadsheetTitle: config.spreadsheetTitle || 'Event Attendance Sheet',
      spreadsheetUrl: config.spreadsheetId
        ? `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`
        : null,
      selectedTabs: config.selectedTabs,
      syncMode: config.syncMode,
      autoSyncEnabled: config.autoSyncEnabled,
      retryCount: 0,
      lastSyncStatus: 'success',
    };

    return { success: true, connection };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch Google Sheets connection.' };
  }
}

export async function triggerGoogleSheetsSyncAction(
  eventId: string,
  tabs?: GoogleSheetsSyncTab[]
): Promise<{ success: boolean; job?: GoogleSheetsSyncJob; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    const { data: event } = await supabase
      .from('events')
      .select('id, organizer_id, custom_pass_design')
      .eq('id', eventId)
      .single();

    if (!event || event.organizer_id !== user.id) {
      return { success: false, error: 'You are not authorized to trigger sync for this event.' };
    }

    const enabled = isFeatureEnabled(event, 'google_sheets');
    if (!enabled) {
      return {
        success: false,
        error: 'Google Sheets Integration is disabled.',
      };
    }

    const config = getGoogleSheetsSettings(event);
    const tabsToSync = tabs && tabs.length > 0 ? tabs : config.selectedTabs;

    const result = await executeGoogleSheetsSync({
      eventId,
      tabsToSync,
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to sync to Google Sheets.' };
  }
}
