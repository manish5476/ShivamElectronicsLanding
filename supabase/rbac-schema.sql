-- ============================================
-- MIMIKO STUDIO - RBAC SYSTEM
-- ============================================
-- Run this AFTER cms-schema.sql
-- ============================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- e.g., 'designs.create', 'users.delete'
  description TEXT,
  module TEXT NOT NULL, -- e.g., 'designs', 'users', 'homepage'
  action TEXT NOT NULL, -- e.g., 'create', 'edit', 'delete', 'view'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROLE_PERMISSIONS TABLE (many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. USERS TABLE (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, INVITED, SUSPENDED, DISABLED
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_email TEXT,
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, LOGIN, etc.
  module TEXT NOT NULL,
  object_type TEXT, -- 'design', 'collection', 'user', etc.
  object_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SESSIONS TABLE (for tracking active sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- RLS Policies
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public read for roles and permissions (needed for UI)
CREATE POLICY "Authenticated can view roles" ON roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view permissions" ON permissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view role_permissions" ON role_permissions FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only view their own profile, admins can view all
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

-- Audit logs: users can view their own, admins can view all
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

-- Sessions: users can only manage their own
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can delete own sessions" ON sessions FOR DELETE USING (user_id = auth.uid());

-- Admin management (only super admins)
CREATE POLICY "Super admins can manage roles" ON roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Super admins can manage permissions" ON permissions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Super admins can manage role_permissions" ON role_permissions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Super admins can manage users" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Super admins can view all audit logs" ON audit_logs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'SUPER_ADMIN'
  )
);

-- ============================================
-- SEED DATA: ROLES
-- ============================================
INSERT INTO roles (id, name, description, is_system) VALUES
  ('00000000-0000-0000-0000-000000000010', 'SUPER_ADMIN', 'Full control over the entire platform', true),
  ('00000000-0000-0000-0000-000000000011', 'CONTENT_ADMIN', 'Manage website content and homepage', true),
  ('00000000-0000-0000-0000-000000000012', 'EDITOR', 'Manage visual presentation and brand content', true),
  ('00000000-0000-0000-0000-000000000013', 'BOOKING_MANAGER', 'Handle customer enquiries and bookings', true),
  ('00000000-0000-0000-0000-000000000014', 'MEDIA_MANAGER', 'Manage photography and visual assets', true),
  ('00000000-0000-0000-0000-000000000015', 'SEO_MANAGER', 'Manage search visibility and promotions', true),
  ('00000000-0000-0000-0000-000000000016', 'SUPPORT_VIEWER', 'Read-only access for staff visibility', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED DATA: PERMISSIONS
-- ============================================
INSERT INTO permissions (name, description, module, action) VALUES
  -- Dashboard
  ('dashboard.view', 'View dashboard', 'dashboard', 'view'),
  
  -- Homepage
  ('homepage.view', 'View homepage builder', 'homepage', 'view'),
  ('homepage.create', 'Create homepage sections', 'homepage', 'create'),
  ('homepage.edit', 'Edit homepage sections', 'homepage', 'edit'),
  ('homepage.delete', 'Delete homepage sections', 'homepage', 'delete'),
  ('homepage.reorder', 'Reorder homepage sections', 'homepage', 'reorder'),
  ('homepage.publish', 'Publish homepage changes', 'homepage', 'publish'),
  
  -- Designs
  ('designs.view', 'View designs', 'designs', 'view'),
  ('designs.create', 'Create designs', 'designs', 'create'),
  ('designs.edit', 'Edit designs', 'designs', 'edit'),
  ('designs.delete', 'Delete designs', 'designs', 'delete'),
  
  -- Collections
  ('collections.view', 'View collections', 'collections', 'view'),
  ('collections.create', 'Create collections', 'collections', 'create'),
  ('collections.edit', 'Edit collections', 'collections', 'edit'),
  ('collections.delete', 'Delete collections', 'collections', 'delete'),
  
  -- Media
  ('media.view', 'View media library', 'media', 'view'),
  ('media.upload', 'Upload media', 'media', 'upload'),
  ('media.edit', 'Edit media metadata', 'media', 'edit'),
  ('media.delete', 'Delete media', 'media', 'delete'),
  
  -- Bookings
  ('bookings.view', 'View bookings', 'bookings', 'view'),
  ('bookings.edit', 'Edit booking status', 'bookings', 'edit'),
  ('bookings.delete', 'Delete bookings', 'bookings', 'delete'),
  
  -- Appearance
  ('appearance.view', 'View appearance studio', 'appearance', 'view'),
  ('appearance.edit', 'Edit appearance settings', 'appearance', 'edit'),
  ('appearance.publish', 'Publish appearance changes', 'appearance', 'publish'),
  
  -- Users
  ('users.view', 'View users', 'users', 'view'),
  ('users.create', 'Create users', 'users', 'create'),
  ('users.edit', 'Edit users', 'users', 'edit'),
  ('users.delete', 'Delete users', 'users', 'delete'),
  ('users.assign_role', 'Assign user roles', 'users', 'assign_role'),
  
  -- Settings
  ('settings.view', 'View settings', 'settings', 'view'),
  ('settings.edit', 'Edit settings', 'settings', 'edit'),
  
  -- SEO
  ('seo.view', 'View SEO settings', 'seo', 'view'),
  ('seo.edit', 'Edit SEO settings', 'seo', 'edit'),
  
  -- Audit
  ('audit.view', 'View audit logs', 'audit', 'view')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ASSIGN PERMISSIONS TO ROLES
-- ============================================

-- SUPER_ADMIN: All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000010'::uuid,
  id
FROM permissions
ON CONFLICT DO NOTHING;

-- CONTENT_ADMIN: Homepage, Designs, Collections, Media (no publish)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000011'::uuid,
  id
FROM permissions
WHERE name IN (
  'dashboard.view',
  'homepage.view', 'homepage.create', 'homepage.edit', 'homepage.delete', 'homepage.reorder',
  'designs.view', 'designs.create', 'designs.edit', 'designs.delete',
  'collections.view', 'collections.create', 'collections.edit', 'collections.delete',
  'media.view', 'media.upload', 'media.edit', 'media.delete',
  'bookings.view'
)
ON CONFLICT DO NOTHING;

-- EDITOR: Appearance, Homepage (edit only), Media, Designs (edit only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000012'::uuid,
  id
FROM permissions
WHERE name IN (
  'dashboard.view',
  'homepage.view', 'homepage.edit', 'homepage.reorder',
  'designs.view', 'designs.edit',
  'collections.view', 'collections.edit',
  'media.view', 'media.upload', 'media.edit',
  'appearance.view', 'appearance.edit'
)
ON CONFLICT DO NOTHING;

-- BOOKING_MANAGER: Bookings (full), Designs/Collections (view only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000013'::uuid,
  id
FROM permissions
WHERE name IN (
  'dashboard.view',
  'bookings.view', 'bookings.edit',
  'designs.view',
  'collections.view'
)
ON CONFLICT DO NOTHING;

-- MEDIA_MANAGER: Media (full), Designs/Collections (view only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000014'::uuid,
  id
FROM permissions
WHERE name IN (
  'dashboard.view',
  'media.view', 'media.upload', 'media.edit', 'media.delete',
  'designs.view',
  'collections.view'
)
ON CONFLICT DO NOTHING;

-- SEO_MANAGER: SEO, Homepage (view/edit limited)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000015'::uuid,
  id
FROM permissions
WHERE name IN (
  'dashboard.view',
  'seo.view', 'seo.edit',
  'homepage.view', 'homepage.edit'
)
ON CONFLICT DO NOTHING;

-- SUPPORT_VIEWER: View only
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '00000000-0000-0000-0000-000000000016'::uuid,
  id
FROM permissions
WHERE action = 'view'
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users u
    JOIN role_permissions rp ON u.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = user_id AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS TEXT[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT p.name
    FROM users u
    JOIN role_permissions rp ON u.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_module TEXT,
  p_object_type TEXT DEFAULT NULL,
  p_object_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM users WHERE id = p_user_id;
  
  INSERT INTO audit_logs (user_id, user_email, action, module, object_type, object_id, details)
  VALUES (p_user_id, v_email, p_action, p_module, p_object_type, p_object_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update users.updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ASSIGN FIRST USER AS SUPER ADMIN
-- ============================================
-- This will be done manually after creating the first admin user
-- UPDATE users SET role_id = '00000000-0000-0000-0000-000000000010' WHERE email = 'your-email@example.com';
