CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  tags TEXT NOT NULL,
  recency TEXT NOT NULL DEFAULT 'old',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  agrees INTEGER NOT NULL DEFAULT 0,
  disputes INTEGER NOT NULL DEFAULT 0,
  client_id TEXT NOT NULL DEFAULT '',
  place_name TEXT NOT NULL DEFAULT '',
  place_area TEXT NOT NULL DEFAULT '',
  name_ko TEXT NOT NULL DEFAULT '',
  area_ko TEXT NOT NULL DEFAULT '',
  name_ja TEXT NOT NULL DEFAULT '',
  area_ja TEXT NOT NULL DEFAULT '',
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'custom',
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_reports_updated_at ON reports(updated_at);
CREATE INDEX IF NOT EXISTS idx_reports_place_id ON reports(place_id);
CREATE INDEX IF NOT EXISTS idx_reports_deleted_at ON reports(deleted_at);

CREATE TABLE IF NOT EXISTS report_votes (
  report_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (report_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_report_votes_report_id ON report_votes(report_id);
