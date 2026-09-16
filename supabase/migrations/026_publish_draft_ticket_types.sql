-- Publish all draft ticket types so they appear on public apply pages.
-- Draft was the previous default; on_sale is now the default for new tickets.
UPDATE ticket_types
SET status = 'on_sale', updated_at = now()
WHERE status = 'draft';
