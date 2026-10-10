-- 099: M04 serial sequence suffix support
-- Extends atomic serial generation to include suffixes while preserving existing callers.

CREATE OR REPLACE FUNCTION public.get_next_atomic_serial_sequence(
    p_scope TEXT,
    p_scope_id TEXT,
    p_prefix TEXT DEFAULT 'URP-REG-',
    p_padding INT DEFAULT 6,
    p_start_number BIGINT DEFAULT 1,
    p_suffix TEXT DEFAULT ''
) RETURNS TEXT AS $$
DECLARE
    v_next_val BIGINT;
    v_formatted TEXT;
BEGIN
    INSERT INTO public.event_serial_sequences (
        scope,
        scope_id,
        current_sequence,
        prefix,
        suffix,
        digit_padding,
        start_number,
        updated_at
    ) VALUES (
        p_scope,
        p_scope_id,
        p_start_number,
        p_prefix,
        p_suffix,
        p_padding,
        p_start_number,
        now()
    )
    ON CONFLICT (scope, scope_id) DO UPDATE
    SET current_sequence = public.event_serial_sequences.current_sequence + 1,
        prefix = EXCLUDED.prefix,
        suffix = EXCLUDED.suffix,
        digit_padding = EXCLUDED.digit_padding,
        updated_at = now()
    RETURNING current_sequence INTO v_next_val;

    v_formatted := p_prefix || LPAD(v_next_val::TEXT, p_padding, '0') || p_suffix;
    RETURN v_formatted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
