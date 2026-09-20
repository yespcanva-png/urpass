-- Ticket types are part of the event registration flow.
-- Applicants can read on-sale ticket types for public active events, and
-- ticket orders keep the selected ticket type for payment reconciliation.

alter table ticket_orders
  add column if not exists ticket_type_id uuid references ticket_types(id) on delete set null;

create index if not exists idx_ticket_orders_ticket_type on ticket_orders(ticket_type_id);

drop policy if exists "ticket_types_public_on_sale_select" on ticket_types;

create policy "ticket_types_public_on_sale_select" on ticket_types
  for select using (
    status = 'on_sale'
    and exists (
      select 1
      from events
      where events.id = ticket_types.event_id
        and events.status = 'active'
        and events.application_enabled = true
    )
  );
