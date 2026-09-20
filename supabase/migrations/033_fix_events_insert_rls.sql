-- Migration 033: Fix events_owner_insert to prevent organization hijacking
-- Ensures that an organizer can only specify an organization_id if they are an active owner or admin.

drop policy if exists "events_owner_insert" on events;

create policy "events_owner_insert" on events
  for insert with check (
    auth.uid() = organizer_id
    and (
      organization_id is null
      or get_user_org_role(organization_id) in ('owner', 'admin')
    )
  );
