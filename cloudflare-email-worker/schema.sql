DROP TABLE IF EXISTS email_queue;
CREATE TABLE email_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_name TEXT NOT NULL,
    template_data TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    attempts INTEGER DEFAULT 0,
    error TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_status ON email_queue(status);
