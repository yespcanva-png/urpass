-- ============================================================
-- Migration 051: URPASS Campus Organizational Layer
--
-- 1. institutions (Academic institutions: colleges, universities)
-- 2. campus_departments (Academic departments: CSE, ECE, Mech, etc.)
-- 3. campus_clubs (Clubs, societies, and institution-level cells/committees)
-- 4. campus_members (Hierarchical role mapping: INSTITUTION_ADMIN, DEPARTMENT_ADMIN, CLUB_ADMIN, ORGANIZER, SCANNER)
-- 5. campus_students (Lightweight campus student directory for roll number & attendance history)
-- 6. events extension (Optional institution_id, department_id, club_id, academic_year, and approval workflow fields)
-- 7. RLS policies and security definer helper functions
-- ============================================================

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. institutions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.institutions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id         UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  institution_code        TEXT NOT NULL UNIQUE,
  logo_url                TEXT,
  website                 TEXT,
  email_domain            TEXT,
  address                 TEXT,
  current_academic_year   TEXT NOT NULL DEFAULT '2026-27',
  primary_admin_id        UUID NOT NULL REFERENCES auth.users(id),
  subscription_tier       TEXT NOT NULL DEFAULT 'campus',
  require_event_approval  BOOLEAN NOT NULL DEFAULT true,
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institutions_code ON public.institutions(institution_code);
CREATE INDEX IF NOT EXISTS idx_institutions_org ON public.institutions(organization_id);
CREATE INDEX IF NOT EXISTS idx_institutions_admin ON public.institutions(primary_admin_id);

CREATE TRIGGER trg_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 2. campus_departments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campus_departments (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id          UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  code                    TEXT NOT NULL,
  slug                    TEXT NOT NULL,
  description             TEXT,
  color                   TEXT NOT NULL DEFAULT '#6D28D9',
  head_of_department_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT campus_departments_inst_code_key UNIQUE (institution_id, code),
  CONSTRAINT campus_departments_inst_slug_key UNIQUE (institution_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_campus_departments_inst ON public.campus_departments(institution_id);
CREATE INDEX IF NOT EXISTS idx_campus_departments_code ON public.campus_departments(code);

CREATE TRIGGER trg_campus_departments_updated_at
  BEFORE UPDATE ON public.campus_departments
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 3. campus_clubs (Clubs, societies, cells, and committees)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campus_clubs (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id          UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  department_id           UUID REFERENCES public.campus_departments(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  slug                    TEXT NOT NULL,
  category                TEXT NOT NULL DEFAULT 'department_club'
                            CHECK (category IN ('department_club', 'cell', 'committee', 'student_chapter', 'society')),
  description             TEXT,
  color                   TEXT NOT NULL DEFAULT '#8B5CF6',
  faculty_advisor_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_student_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT campus_clubs_inst_slug_key UNIQUE (institution_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_campus_clubs_inst ON public.campus_clubs(institution_id);
CREATE INDEX IF NOT EXISTS idx_campus_clubs_dept ON public.campus_clubs(department_id);

CREATE TRIGGER trg_campus_clubs_updated_at
  BEFORE UPDATE ON public.campus_clubs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 4. campus_members
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campus_members (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id          UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id           UUID REFERENCES public.campus_departments(id) ON DELETE CASCADE,
  club_id                 UUID REFERENCES public.campus_clubs(id) ON DELETE CASCADE,
  role                    TEXT NOT NULL CHECK (role IN ('INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN', 'CLUB_ADMIN', 'ORGANIZER', 'SCANNER')),
  invited_email           TEXT NOT NULL,
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  invite_token            TEXT UNIQUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campus_members_inst ON public.campus_members(institution_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_user ON public.campus_members(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_dept ON public.campus_members(department_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_club ON public.campus_members(club_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_email ON public.campus_members(invited_email);

CREATE TRIGGER trg_campus_members_updated_at
  BEFORE UPDATE ON public.campus_members
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 5. campus_students (Campus Student Directory)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campus_students (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id          UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id              TEXT,
  roll_number             TEXT NOT NULL,
  name                    TEXT NOT NULL,
  email                   TEXT NOT NULL,
  phone                   TEXT,
  department_id           UUID REFERENCES public.campus_departments(id) ON DELETE SET NULL,
  year                    INTEGER CHECK (year BETWEEN 1 AND 5),
  section                 TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT campus_students_inst_roll_key UNIQUE (institution_id, roll_number)
);

CREATE INDEX IF NOT EXISTS idx_campus_students_inst ON public.campus_students(institution_id);
CREATE INDEX IF NOT EXISTS idx_campus_students_email ON public.campus_students(email);
CREATE INDEX IF NOT EXISTS idx_campus_students_roll ON public.campus_students(roll_number);
CREATE INDEX IF NOT EXISTS idx_campus_students_dept ON public.campus_students(department_id);

CREATE TRIGGER trg_campus_students_updated_at
  BEFORE UPDATE ON public.campus_students
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 6. Extend events Table with Optional Campus & Approval Fields
-- ============================================================
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.campus_departments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS club_id UUID REFERENCES public.campus_clubs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS academic_year TEXT,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'not_required'
    CHECK (approval_status IN ('not_required', 'draft', 'pending_approval', 'approved', 'rejected', 'changes_requested')),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS submitted_for_approval_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_events_institution ON public.events(institution_id);
CREATE INDEX IF NOT EXISTS idx_events_department ON public.events(department_id);
CREATE INDEX IF NOT EXISTS idx_events_club ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_academic_year ON public.events(academic_year);
CREATE INDEX IF NOT EXISTS idx_events_approval_status ON public.events(approval_status);

-- ============================================================
-- 7. Security Definer Helper Functions
-- ============================================================

-- Check if current authenticated user has an active membership in institution
CREATE OR REPLACE FUNCTION public.is_campus_member(p_inst_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.institutions
    WHERE id = p_inst_id AND primary_admin_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.campus_members
    WHERE institution_id = p_inst_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

-- Get current authenticated user's highest role in an institution
CREATE OR REPLACE FUNCTION public.get_user_campus_role(p_inst_id UUID)
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN EXISTS (SELECT 1 FROM public.institutions WHERE id = p_inst_id AND primary_admin_id = auth.uid()) THEN 'INSTITUTION_ADMIN'
    ELSE (
      SELECT role FROM public.campus_members
      WHERE institution_id = p_inst_id
        AND user_id = auth.uid()
        AND status = 'active'
      ORDER BY CASE role
        WHEN 'INSTITUTION_ADMIN' THEN 1
        WHEN 'DEPARTMENT_ADMIN'  THEN 2
        WHEN 'CLUB_ADMIN'        THEN 3
        WHEN 'ORGANIZER'         THEN 4
        WHEN 'SCANNER'           THEN 5
        ELSE 6
      END ASC
      LIMIT 1
    )
  END;
$$;

-- ============================================================
-- 8. Row Level Security Policies
-- ============================================================

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_students ENABLE ROW LEVEL SECURITY;

-- institutions
CREATE POLICY "institutions_member_select" ON public.institutions
  FOR SELECT USING (
    primary_admin_id = auth.uid() OR is_campus_member(id)
  );

CREATE POLICY "institutions_admin_insert" ON public.institutions
  FOR INSERT WITH CHECK (
    auth.uid() = primary_admin_id
  );

CREATE POLICY "institutions_admin_update" ON public.institutions
  FOR UPDATE USING (
    primary_admin_id = auth.uid() OR get_user_campus_role(id) = 'INSTITUTION_ADMIN'
  );

-- campus_departments
CREATE POLICY "campus_departments_select" ON public.campus_departments
  FOR SELECT USING (
    is_campus_member(institution_id)
  );

CREATE POLICY "campus_departments_admin_manage" ON public.campus_departments
  FOR ALL USING (
    get_user_campus_role(institution_id) = 'INSTITUTION_ADMIN'
  );

-- campus_clubs
CREATE POLICY "campus_clubs_select" ON public.campus_clubs
  FOR SELECT USING (
    is_campus_member(institution_id)
  );

CREATE POLICY "campus_clubs_admin_manage" ON public.campus_clubs
  FOR ALL USING (
    get_user_campus_role(institution_id) IN ('INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN')
  );

-- campus_members
CREATE POLICY "campus_members_select" ON public.campus_members
  FOR SELECT USING (
    user_id = auth.uid() OR is_campus_member(institution_id)
  );

CREATE POLICY "campus_members_admin_manage" ON public.campus_members
  FOR ALL USING (
    get_user_campus_role(institution_id) IN ('INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN', 'CLUB_ADMIN')
  );

-- campus_students
CREATE POLICY "campus_students_select" ON public.campus_students
  FOR SELECT USING (
    is_campus_member(institution_id)
  );

CREATE POLICY "campus_students_admin_manage" ON public.campus_students
  FOR ALL USING (
    get_user_campus_role(institution_id) IN ('INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN')
  );
