CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  app TEXT NOT NULL,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  client_id TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'open'
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
