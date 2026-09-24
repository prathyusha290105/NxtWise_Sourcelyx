CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  manager_id TEXT,
  manager_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  gst_number TEXT NOT NULL UNIQUE,
  pan_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING_VERIFICATION','VERIFIED','PENDING_APPROVAL','ACTIVE','REJECTED','INACTIVE')),
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  category TEXT,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  performance JSONB
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('ADMIN','PROCUREMENT','PROCUREMENT_MANAGER','FINANCE','DEPARTMENT_MANAGER','VENDOR','AUDITOR')),
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  title TEXT,
  avatar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_vendor_id ON users(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

CREATE TABLE IF NOT EXISTS purchase_requests (
  id TEXT PRIMARY KEY,
  request_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  justification TEXT NOT NULL,
  department_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  requested_by_id TEXT NOT NULL,
  requested_by_name TEXT NOT NULL,
  priority TEXT NOT NULL,
  required_date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(15,2) NOT NULL,
  status TEXT NOT NULL,
  current_approval_level INTEGER NOT NULL DEFAULT 1,
  total_approval_levels INTEGER NOT NULL DEFAULT 1,
  approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rfq_id TEXT,
  po_id TEXT
);

CREATE TABLE IF NOT EXISTS rfqs (
  id TEXT PRIMARY KEY,
  rfq_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  purchase_request_id TEXT NOT NULL,
  purchase_request_number TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  delivery_requirements TEXT NOT NULL,
  payment_terms TEXT NOT NULL,
  status TEXT NOT NULL,
  invited_vendors JSONB NOT NULL DEFAULT '[]'::jsonb,
  quotation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quotations (
  id TEXT PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  rfq_id TEXT NOT NULL,
  rfq_number TEXT NOT NULL,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  vendor_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  unit_price NUMERIC(15,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC(15,2) NOT NULL,
  tax NUMERIC(15,2) NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,
  delivery_days INTEGER NOT NULL,
  payment_terms TEXT NOT NULL,
  valid_until DATE NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  selection_notes TEXT
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  purchase_request_id TEXT NOT NULL,
  purchase_request_number TEXT NOT NULL,
  rfq_id TEXT NOT NULL,
  rfq_number TEXT NOT NULL,
  quotation_id TEXT NOT NULL,
  quotation_number TEXT NOT NULL,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  vendor_name TEXT NOT NULL,
  vendor_address TEXT NOT NULL,
  vendor_gst TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(15,2) NOT NULL,
  tax_rate NUMERIC(8,4) NOT NULL,
  tax_amount NUMERIC(15,2) NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_terms TEXT NOT NULL,
  created_by_id TEXT NOT NULL,
  created_by_name TEXT NOT NULL,
  order_date DATE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  allocated_budget NUMERIC(15,2) NOT NULL,
  utilized_budget NUMERIC(15,2) NOT NULL DEFAULT 0,
  committed_spend NUMERIC(15,2) NOT NULL DEFAULT 0,
  available_budget NUMERIC(15,2) NOT NULL DEFAULT 0,
  utilization_percentage NUMERIC(8,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  target_role TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  description TEXT NOT NULL,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
