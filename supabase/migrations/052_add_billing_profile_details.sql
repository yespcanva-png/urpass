-- 052: Add billing profile details to profiles table
-- Enables organizers to save company name, GSTIN, phone, and billing address for tax invoices

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS gstin text,
  ADD COLUMN IF NOT EXISTS billing_address text;

COMMENT ON COLUMN public.profiles.gstin IS '15-digit Goods and Services Tax Identification Number for Indian business invoices';
COMMENT ON COLUMN public.profiles.company_name IS 'Legal company / business entity name for invoicing';
COMMENT ON COLUMN public.profiles.billing_address IS 'Registered business billing address for GST / VAT invoices';
 