
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS designs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  story TEXT NOT NULL DEFAULT '',
  tier TEXT NOT NULL,
  base_kg_paise INTEGER NOT NULL,
  lead_hours INTEGER NOT NULL DEFAULT 48,
  capacity_points INTEGER NOT NULL DEFAULT 1,
  rush_allowed INTEGER NOT NULL DEFAULT 1,
  style_tags TEXT NOT NULL DEFAULT '[]',
  occasion_tags TEXT NOT NULL DEFAULT '[]',
  color_tags TEXT NOT NULL DEFAULT '[]',
  personalise_extras TEXT NOT NULL DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS design_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  design_id INTEGER NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  photo TEXT NOT NULL,
  card TEXT NOT NULL,
  card_avif TEXT,
  card_sm TEXT NOT NULL,
  full TEXT NOT NULL,
  full_avif TEXT,
  role TEXT NOT NULL DEFAULT 'gallery',
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS flavours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  adjustment_paise INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS addons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_paise INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_code TEXT UNIQUE NOT NULL,
  tracking_token_hash TEXT UNIQUE NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'direct',
  design_id INTEGER REFERENCES designs(id),
  quote_id INTEGER,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_date TEXT NOT NULL,
  fulfilment TEXT NOT NULL,
  address_json TEXT,
  spec_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_payment',
  capacity_points INTEGER NOT NULL DEFAULT 1,
  subtotal_paise INTEGER NOT NULL,
  delivery_paise INTEGER NOT NULL DEFAULT 0,
  discount_paise INTEGER NOT NULL DEFAULT 0,
  total_paise INTEGER NOT NULL,
  amount_paid_paise INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  actor TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  method TEXT NOT NULL,
  provider_order_id TEXT,
  provider_payment_id TEXT,
  amount_paise INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  utr TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payment_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  event_id TEXT UNIQUE NOT NULL,
  payload_hash TEXT NOT NULL,
  signature_valid INTEGER NOT NULL DEFAULT 0,
  processed_at TEXT,
  raw TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS capacity_days (
  date TEXT PRIMARY KEY,
  max_points INTEGER,
  blocked INTEGER NOT NULL DEFAULT 0,
  note TEXT
);

CREATE TABLE IF NOT EXISTS delivery_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pincodes TEXT NOT NULL DEFAULT '',
  fee_paise INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS custom_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_code TEXT UNIQUE NOT NULL,
  tracking_token_hash TEXT UNIQUE NOT NULL,
  design_id INTEGER REFERENCES designs(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  occasion TEXT,
  event_date TEXT,
  servings TEXT,
  flavour TEXT,
  eggless INTEGER,
  must_keep TEXT,
  avoid TEXT,
  color_notes TEXT,
  budget_band TEXT,
  fulfilment TEXT,
  address_json TEXT,
  message_text TEXT,
  refs_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES custom_requests(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  spec_json TEXT NOT NULL,
  subtotal_paise INTEGER NOT NULL,
  delivery_paise INTEGER NOT NULL DEFAULT 0,
  total_paise INTEGER NOT NULL,
  deposit_paise INTEGER NOT NULL,
  expires_at TEXT,
  token_hash TEXT UNIQUE,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_design_images ON design_images(design_id);

CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'percent',
  value INTEGER NOT NULL,
  min_spend_paise INTEGER NOT NULL DEFAULT 0,
  max_discount_paise INTEGER,
  starts_at TEXT,
  ends_at TEXT,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
