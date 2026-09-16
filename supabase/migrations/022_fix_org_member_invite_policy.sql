-- Avoid direct auth.users reads from RLS policies.
-- PostgREST evaluates the policy as the requesting role, so the inline
-- auth.users lookup can turn normal organization membership reads into 403s.

create or replace function public.current_user_email()
returns text
language sql
security definer
stable
set search_path = auth
as $$
  select email
  from users
  where id = auth.uid()
  limit 1;
$$;

drop policy if exists "org_members_member_select" on organization_members;

create policy "org_members_member_select" on organization_members
  for select using (
    user_id = auth.uid()
    or is_org_member(organization_id)
    or (
      status = 'pending'
      and invited_email = public.current_user_email()
    )
  );
