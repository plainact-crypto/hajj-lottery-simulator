CREATE TABLE IF NOT EXISTS funnel_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  level_id TEXT,
  marketing_opt_in INTEGER,
  persisted_remotely INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_name_created
  ON funnel_events (event_name, created_at);

CREATE INDEX IF NOT EXISTS idx_funnel_events_session_created
  ON funnel_events (session_id, created_at);
