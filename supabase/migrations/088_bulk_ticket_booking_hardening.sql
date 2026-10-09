-- 088: M01 Bulk Ticket Booking hardening
-- Adds durable quantity-aware reservations, order line items, and partial refund status support.

ALTER TABLE public.ticket_reservations
  ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0);

CREATE INDEX IF NOT EXISTS idx_ticket_reservations_event_quantity
  ON public.ticket_reservations(event_id, status, expires_at, quantity);

ALTER TABLE public.ticket_orders
  DROP CONSTRAINT IF EXISTS ticket_orders_status_check;

ALTER TABLE public.ticket_orders
  ADD CONSTRAINT ticket_orders_status_check
  CHECK (status IN ('created', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'));

CREATE TABLE IF NOT EXISTS public.ticket_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  ticket_type_name TEXT NOT NULL,
  unit_amount_paise INT NOT NULL DEFAULT 0 CHECK (unit_amount_paise >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  subtotal_paise INT NOT NULL DEFAULT 0 CHECK (subtotal_paise >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_order_items_order
  ON public.ticket_order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_ticket_order_items_event
  ON public.ticket_order_items(event_id);

ALTER TABLE public.ticket_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ticket_order_items_organizer_select" ON public.ticket_order_items;
CREATE POLICY "ticket_order_items_organizer_select" ON public.ticket_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = ticket_order_items.event_id
        AND (
          e.organizer_id = auth.uid()
          OR (
            e.organization_id IS NOT NULL
            AND public.is_org_member(e.organization_id)
          )
        )
    )
  );

DROP POLICY IF EXISTS "ticket_order_items_service_role_all" ON public.ticket_order_items;
CREATE POLICY "ticket_order_items_service_role_all" ON public.ticket_order_items
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
