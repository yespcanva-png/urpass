export const CONFIG = {
  APP_NAME: "UrPass One",
  APP_VERSION: "1.0.0",
  DEFAULT_API_BASE: "https://urpass.space",
  
  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "@urpass_one_auth_token",
    USER_PROFILE: "@urpass_one_user_profile",
    LAST_ORG_ID: "@urpass_one_last_org_id",
    LAST_EVENT_ID: "@urpass_one_last_event_id",
    ASSIGNED_GATE_ID: "@urpass_one_assigned_gate_id",
    DEVICE_ID: "@urpass_one_device_id",
    OFFLINE_MANIFEST_PREFIX: "@urpass_one_manifest_",
    OFFLINE_QUEUE: "@urpass_one_offline_scans_queue",
    SCAN_AUDIT_LOGS: "@urpass_one_audit_logs",
    ACTIVE_ALERTS: "@urpass_one_alerts",
  },

  // Capacity Thresholds
  CAPACITY_WARNING_PERCENT: 80,
  CAPACITY_CRITICAL_PERCENT: 90,
  CAPACITY_MAX_PERCENT: 100,

  // Scanning Defaults
  AUTO_RESET_SCAN_RESULT_MS: 3200,
  HAPTIC_ENABLED_BY_DEFAULT: true,
  AUDIO_CHIME_ENABLED: true,
  SYNC_INTERVAL_MS: 5000,
};
