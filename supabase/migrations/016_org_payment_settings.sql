-- Organization-level payment settings
-- Orgs on Starter/Pro/Enterprise can store their own Razorpay credentials.
-- The organization owner or admin can manage these settings.

CREATE TABLE IF NOT EXISTS org_payment_settings (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID        NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  razorpay_key_id     TEXT,
  razorpay_key_secret TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE org_payment_settings ENABLE ROW LEVEL SECURITY;

-- Org owner/admin can read and write their org's payment settings
CREATE POLICY "org_payment_owner_admin_select" ON org_payment_settings
  FOR SELECT USING (
    get_user_org_role(organization_id) IN ('owner', 'admin')
  );

CREATE POLICY "org_payment_owner_admin_insert" ON org_payment_settings
  FOR INSERT WITH CHECK (
    get_user_org_role(organization_id) IN ('owner', 'admin')
  );

CREATE POLICY "org_payment_owner_admin_update" ON org_payment_settings
  FOR UPDATE USING (
    get_user_org_role(organization_id) IN ('owner', 'admin')
  );

CREATE POLICY "org_payment_owner_admin_delete" ON org_payment_settings
  FOR DELETE USING (
    get_user_org_role(organization_id) = 'owner'
  );

CREATE TRIGGER org_payment_settings_updated_at
  BEFORE UPDATE ON org_payment_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
