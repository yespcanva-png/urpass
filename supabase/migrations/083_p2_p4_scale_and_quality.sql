-- ============================================================================
-- Migration 083: P2 & P4 Scalability, Quality, and Background Infrastructure
-- ============================================================================
-- 1. Case-insensitive Attendee Uniqueness Index
-- 2. Performance & Check-In Composite Indexes
-- 3. Asynchronous System Background Jobs & Dead Letter Queue (system_jobs)
-- 4. Campus Department & Club Aggregation Stored Procedures (N+1 Elimination)
-- ============================================================================

-- 1. Case-insensitive duplicate prevention
-- Prevent duplicate attendees registered with different case (e.g. John@co.com vs john@co.com)
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendees_event_lower_email
  ON public.attendees (event_id, lower(email));

-- 2. Missing Check-in Composite Indexes
-- Accelerate high-volume check-ins, telemetry, gate stats, and timeline queries
CREATE INDEX IF NOT EXISTS idx_check_ins_event_timestamp 
  ON public.check_ins (event_id, checked_in_at DESC);

CREATE INDEX IF NOT EXISTS idx_check_ins_event_pass 
  ON public.check_ins (event_id, pass_id);

CREATE INDEX IF NOT EXISTS idx_check_ins_event_gate_time 
  ON public.check_ins (event_id, gate_id, checked_in_at DESC);

CREATE INDEX IF NOT EXISTS idx_check_ins_event_attendee 
  ON public.check_ins (event_id, attendee_id);

CREATE INDEX IF NOT EXISTS idx_check_ins_event_method 
  ON public.check_ins (event_id, check_in_method);

-- 3. Asynchronous System Jobs & Dead-Letter Queue
CREATE TABLE IF NOT EXISTS public.system_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_id        UUID REFERENCES public.events(id) ON DELETE CASCADE,
  job_type        TEXT NOT NULL CHECK (job_type IN (
                    'SEND_EMAIL',
                    'SEND_WHATSAPP',
                    'SEND_SMS',
                    'GENERATE_PASS',
                    'GENERATE_INVOICE',
                    'PROCESS_REFUND',
                    'PROCESS_WEBHOOK',
                    'RECONCILE_OFFLINE_SCANS'
                  )),
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  status          TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN (
                    'QUEUED',
                    'PROCESSING',
                    'SUCCESS',
                    'FAILED',
                    'RETRYING',
                    'DEAD_LETTER'
                  )),
  attempt_count   INT NOT NULL DEFAULT 0,
  max_attempts    INT NOT NULL DEFAULT 5,
  last_error      TEXT,
  next_retry_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_system_jobs_queue 
  ON public.system_jobs (status, next_retry_at) 
  WHERE status IN ('QUEUED', 'RETRYING');

CREATE INDEX IF NOT EXISTS idx_system_jobs_dead_letter 
  ON public.system_jobs (status, created_at DESC) 
  WHERE status = 'DEAD_LETTER';

CREATE INDEX IF NOT EXISTS idx_system_jobs_event 
  ON public.system_jobs (event_id, job_type);

CREATE INDEX IF NOT EXISTS idx_system_jobs_org 
  ON public.system_jobs (organization_id);

ALTER TABLE public.system_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_jobs_service_role_all" ON public.system_jobs;
CREATE POLICY "system_jobs_service_role_all" ON public.system_jobs
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "system_jobs_org_admin_select" ON public.system_jobs;
CREATE POLICY "system_jobs_org_admin_select" ON public.system_jobs
  FOR SELECT USING (
    organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = system_jobs.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  );

-- 4. Campus Metrics Aggregation Function (Eliminates N+1 Queries)
CREATE OR REPLACE FUNCTION public.get_campus_department_metrics(p_institution_id UUID)
RETURNS TABLE (
  department_id     UUID,
  clubs_count       BIGINT,
  events_count      BIGINT,
  students_count    BIGINT,
  organizers_count  BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH depts AS (
    SELECT d.id FROM public.campus_departments d WHERE d.institution_id = p_institution_id
  ),
  clubs AS (
    SELECT c.department_id, COUNT(*)::BIGINT AS count
    FROM public.campus_clubs c
    WHERE c.department_id IN (SELECT id FROM depts)
    GROUP BY c.department_id
  ),
  evts AS (
    SELECT e.department_id, COUNT(*)::BIGINT AS count
    FROM public.events e
    WHERE e.department_id IN (SELECT id FROM depts)
    GROUP BY e.department_id
  ),
  stds AS (
    SELECT s.department_id, COUNT(*)::BIGINT AS count
    FROM public.campus_students s
    WHERE s.department_id IN (SELECT id FROM depts)
    GROUP BY s.department_id
  ),
  orgs AS (
    SELECT m.department_id, COUNT(*)::BIGINT AS count
    FROM public.campus_members m
    WHERE m.department_id IN (SELECT id FROM depts)
    GROUP BY m.department_id
  )
  SELECT 
    d.id AS department_id,
    COALESCE(c.count, 0) AS clubs_count,
    COALESCE(e.count, 0) AS events_count,
    COALESCE(s.count, 0) AS students_count,
    COALESCE(o.count, 0) AS organizers_count
  FROM depts d
  LEFT JOIN clubs c ON c.department_id = d.id
  LEFT JOIN evts e ON e.department_id = d.id
  LEFT JOIN stds s ON s.department_id = d.id
  LEFT JOIN orgs o ON o.department_id = d.id;
END;
$$;
