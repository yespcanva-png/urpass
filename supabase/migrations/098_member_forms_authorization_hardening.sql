-- 098: M03 Member Registration Forms authorization hardening
-- Lets organization owners/admins/event managers manage form configuration and review submissions.

DROP POLICY IF EXISTS "Organizers manage form configs" ON public.event_member_form_configs;
CREATE POLICY "Organizers manage form configs" ON public.event_member_form_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_member_form_configs.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_member_form_configs.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    );

DROP POLICY IF EXISTS "Organizers manage whitelists" ON public.event_serial_whitelists;
CREATE POLICY "Organizers manage whitelists" ON public.event_serial_whitelists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_serial_whitelists.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_serial_whitelists.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    );

DROP POLICY IF EXISTS "Organizers view member submissions" ON public.attendee_member_submissions;
CREATE POLICY "Organizers view member submissions" ON public.attendee_member_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = attendee_member_submissions.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = attendee_member_submissions.event_id
            AND (
                events.organizer_id = auth.uid()
                OR (
                    events.organization_id IS NOT NULL
                    AND public.get_user_org_role(events.organization_id) IN ('owner', 'admin', 'event_manager')
                )
            )
        )
    );
