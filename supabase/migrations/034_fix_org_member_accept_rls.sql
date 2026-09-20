-- Migration 034: Fix org_members update policy to allow invited users to accept invites
drop policy if exists "org_members_admin_update" on organization_members;

create policy "org_members_admin_update" on organization_members
  for update using (
    user_id = auth.uid()
    or get_user_org_role(organization_id) in ('owner','admin')
    or (
      status = 'pending'
      and (
        invited_email = public.current_user_email()
        or user_id is null
      )
    )
  );
