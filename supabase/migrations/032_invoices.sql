-- 032: Billing invoices
-- Stores immutable invoice snapshots and secure PDF locations for dashboard history.

CREATE TABLE IF NOT EXISTS public.invoices (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number       text NOT NULL UNIQUE,
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id      uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  payment_id           text,
  seller_name          text NOT NULL,
  seller_gstin         text NOT NULL,
  seller_address       text NOT NULL,
  customer_name        text NOT NULL,
  customer_email       text NOT NULL,
  customer_address     text,
  customer_gstin       text,
  place_of_supply      text,
  state_code           text,
  subtotal             numeric(12,2) NOT NULL DEFAULT 0,
  discount             numeric(12,2) NOT NULL DEFAULT 0,
  taxable_amount       numeric(12,2) NOT NULL DEFAULT 0,
  cgst_rate            numeric(5,2) NOT NULL DEFAULT 0,
  cgst_amount          numeric(12,2) NOT NULL DEFAULT 0,
  sgst_rate            numeric(5,2) NOT NULL DEFAULT 0,
  sgst_amount          numeric(12,2) NOT NULL DEFAULT 0,
  igst_rate            numeric(5,2) NOT NULL DEFAULT 0,
  igst_amount          numeric(12,2) NOT NULL DEFAULT 0,
  total_amount         numeric(12,2) NOT NULL DEFAULT 0,
  currency             text NOT NULL DEFAULT 'INR',
  invoice_date         date NOT NULL DEFAULT CURRENT_DATE,
  billing_period_start date,
  billing_period_end   date,
  payment_status       text NOT NULL DEFAULT 'paid'
                         CHECK (payment_status IN ('paid','pending','failed','refunded','partially_refunded')),
  invoice_status       text NOT NULL DEFAULT 'issued'
                         CHECK (invoice_status IN ('issued','void','credited')),
  pdf_url              text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_owner_select"
  ON public.invoices FOR SELECT
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_invoices_user_date
  ON public.invoices(user_id, invoice_date DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_payment_id
  ON public.invoices(payment_id);

CREATE TABLE IF NOT EXISTS public.credit_notes (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_number text NOT NULL UNIQUE,
  invoice_id         uuid NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason             text NOT NULL,
  subtotal           numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount         numeric(12,2) NOT NULL DEFAULT 0,
  total_amount       numeric(12,2) NOT NULL DEFAULT 0,
  currency           text NOT NULL DEFAULT 'INR',
  document_date      date NOT NULL DEFAULT CURRENT_DATE,
  pdf_url            text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_notes_owner_select"
  ON public.credit_notes FOR SELECT
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_credit_notes_user_date
  ON public.credit_notes(user_id, document_date DESC);
