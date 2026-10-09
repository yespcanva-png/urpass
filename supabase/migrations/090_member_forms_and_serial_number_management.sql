-- ============================================================================
-- Migration 090: Member Registration Forms & Serial Number Management (M03 & M04)
-- Description:
-- 1. Creates event_member_form_configs for category-wise custom registration forms.
-- 2. Creates event_serial_sequences for atomic monotonic sequence generation under concurrent load.
-- 3. Creates event_serial_whitelists for pre-uploaded approved member rosters.
-- 4. Creates attendee_member_submissions for full member profile audit and review.
-- 5. Adds database function get_next_atomic_serial_sequence() with atomic row locking.
-- ============================================================================

-- 1. Member Registration Form Configurations
CREATE TABLE IF NOT EXISTS public.event_member_form_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    allow_update_after_claim BOOLEAN NOT NULL DEFAULT true,
    retroactive_policy TEXT NOT NULL DEFAULT 'preserve_validity' CHECK (retroactive_policy IN ('preserve_validity', 'require_completion')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_member_form_configs_event ON public.event_member_form_configs (event_id);
CREATE INDEX IF NOT EXISTS idx_event_member_form_configs_ticket_type ON public.event_member_form_configs (ticket_type_id);

-- 2. Event Serial Sequences (Atomic sequence generation without row-counting race conditions)
CREATE TABLE IF NOT EXISTS public.event_serial_sequences (
    scope TEXT NOT NULL CHECK (scope IN ('event', 'organization', 'global')),
    scope_id TEXT NOT NULL,
    current_sequence BIGINT NOT NULL DEFAULT 0,
    prefix TEXT NOT NULL DEFAULT 'URP-REG-',
    suffix TEXT NOT NULL DEFAULT '',
    digit_padding INT NOT NULL DEFAULT 6 CHECK (digit_padding >= 1 AND digit_padding <= 12),
    start_number BIGINT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (scope, scope_id)
);

CREATE INDEX IF NOT EXISTS idx_event_serial_sequences_lookup ON public.event_serial_sequences (scope, scope_id);

-- 3. Approved Member Serial Whitelist
CREATE TABLE IF NOT EXISTS public.event_serial_whitelists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    serial_number TEXT NOT NULL,
    assigned_attendee_id UUID REFERENCES public.attendees(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'revoked')),
    assigned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_event_serial_whitelist UNIQUE (event_id, serial_number)
);

CREATE INDEX IF NOT EXISTS idx_event_serial_whitelists_event ON public.event_serial_whitelists (event_id, status);
CREATE INDEX IF NOT EXISTS idx_event_serial_whitelists_serial ON public.event_serial_whitelists (event_id, serial_number);

-- 4. Attendee Member Submissions
CREATE TABLE IF NOT EXISTS public.attendee_member_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
    pass_id UUID REFERENCES public.passes(id) ON DELETE SET NULL,
    ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college_org TEXT,
    department TEXT,
    course TEXT,
    year_or_designation TEXT,
    roll_or_employee_id TEXT,
    serial_number TEXT,
    custom_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    declarations JSONB NOT NULL DEFAULT '{}'::jsonb,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'corrected')),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    correction_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_attendee_member_submission UNIQUE (event_id, attendee_id)
);

CREATE INDEX IF NOT EXISTS idx_attendee_member_submissions_event ON public.attendee_member_submissions (event_id);
CREATE INDEX IF NOT EXISTS idx_attendee_member_submissions_serial ON public.attendee_member_submissions (event_id, serial_number);
CREATE INDEX IF NOT EXISTS idx_attendee_member_submissions_email ON public.attendee_member_submissions (event_id, email);

-- 5. Atomic Serial Number Increment Function
CREATE OR REPLACE FUNCTION public.get_next_atomic_serial_sequence(
    p_scope TEXT,
    p_scope_id TEXT,
    p_prefix TEXT DEFAULT 'URP-REG-',
    p_padding INT DEFAULT 6,
    p_start_number BIGINT DEFAULT 1
) RETURNS TEXT AS $$
DECLARE
    v_next_val BIGINT;
    v_formatted TEXT;
BEGIN
    -- Upsert and atomically increment using row-level write lock
    INSERT INTO public.event_serial_sequences (
        scope,
        scope_id,
        current_sequence,
        prefix,
        digit_padding,
        start_number,
        updated_at
    ) VALUES (
        p_scope,
        p_scope_id,
        p_start_number,
        p_prefix,
        p_padding,
        p_start_number,
        now()
    )
    ON CONFLICT (scope, scope_id) DO UPDATE
    SET current_sequence = public.event_serial_sequences.current_sequence + 1,
        updated_at = now()
    RETURNING current_sequence INTO v_next_val;

    -- Format padded monotonic serial string
    v_formatted := p_prefix || LPAD(v_next_val::TEXT, p_padding, '0');
    RETURN v_formatted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.event_member_form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_serial_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_serial_whitelists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_member_submissions ENABLE ROW LEVEL SECURITY;

-- Form Configs: Public read for event registration, organizer write
DROP POLICY IF EXISTS "Public read form configs" ON public.event_member_form_configs;
CREATE POLICY "Public read form configs" ON public.event_member_form_configs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers manage form configs" ON public.event_member_form_configs;
CREATE POLICY "Organizers manage form configs" ON public.event_member_form_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_member_form_configs.event_id
            AND events.organizer_id = auth.uid()
        )
    );

-- Whitelist: Organizer full access, service role public validation
DROP POLICY IF EXISTS "Organizers manage whitelists" ON public.event_serial_whitelists;
CREATE POLICY "Organizers manage whitelists" ON public.event_serial_whitelists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_serial_whitelists.event_id
            AND events.organizer_id = auth.uid()
        )
    );

-- Submissions: Organizers full access, attendees read own
DROP POLICY IF EXISTS "Organizers view member submissions" ON public.attendee_member_submissions;
CREATE POLICY "Organizers view member submissions" ON public.attendee_member_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = attendee_member_submissions.event_id
            AND events.organizer_id = auth.uid()
        )
    );
