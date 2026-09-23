-- Migration 042: Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_name TEXT,
  attachment_size INTEGER,
  attachment_type TEXT,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_id ON support_tickets(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON support_tickets(email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous or authenticated) can submit a ticket
CREATE POLICY "Anyone can submit support tickets"
  ON support_tickets
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view their own tickets
CREATE POLICY "Users can read own support tickets"
  ON support_tickets
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email') = email
  );
