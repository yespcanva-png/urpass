-- Migration 130: 24-Hour VIP Concierge Setup Service
-- Allows organizers to request done-for-you event creation (Free for 1st-timers, ₹999 for VIP setup).

create table if not exists concierge_setup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  event_name text not null,
  event_date text,
  city text,
  attendee_count text,
  organizer_name text not null,
  organizer_email text not null,
  whatsapp_number text not null,
  notes text,
  poster_url text,
  is_first_time boolean default false,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  payment_status text not null default 'free' check (payment_status in ('free', 'paid', 'unpaid', 'refunded')),
  amount_inr numeric(10, 2) default 0,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_concierge_user on concierge_setup_requests(user_id);
create index if not exists idx_concierge_status on concierge_setup_requests(status);

alter table concierge_setup_requests enable row level security;

create policy "Users can read own concierge requests"
  on concierge_setup_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own concierge requests"
  on concierge_setup_requests for insert
  with check (auth.uid() = user_id or auth.uid() is null);

