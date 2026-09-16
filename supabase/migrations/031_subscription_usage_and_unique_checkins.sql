-- 031: Subscription usage counters and duplicate check-in prevention

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS billing_cycle text CHECK (billing_cycle IN ('monthly','annual')),
  ADD COLUMN IF NOT EXISTS registrations_used integer NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'check_ins_pass_id_unique'
      AND conrelid = 'public.check_ins'::regclass
  ) THEN
    ALTER TABLE public.check_ins
      ADD CONSTRAINT check_ins_pass_id_unique UNIQUE (pass_id);
  END IF;
END;
$$;
