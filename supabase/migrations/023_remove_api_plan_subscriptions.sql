-- API access is now included with the main Pro subscription only.
-- Keep api_usage for dashboard metrics, but remove the separate API plan billing layer.

do $$
begin
  if to_regclass('public.api_subscriptions') is not null then
    drop trigger if exists trg_api_subs_updated_at on api_subscriptions;
  end if;
end $$;

drop table if exists api_subscriptions;
drop table if exists api_plans;
