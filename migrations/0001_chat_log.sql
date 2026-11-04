-- Every question asked to the portfolio assistant, with its answer.
-- The visitor is identified only by a salted hash of their IP, for rate limiting.
CREATE TABLE IF NOT EXISTS chat_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  visitor TEXT NOT NULL,
  country TEXT,
  page TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  model TEXT,
  status TEXT NOT NULL DEFAULT 'ok'
);
CREATE INDEX IF NOT EXISTS chat_log_at ON chat_log (at);
CREATE INDEX IF NOT EXISTS chat_log_visitor_at ON chat_log (visitor, at);
