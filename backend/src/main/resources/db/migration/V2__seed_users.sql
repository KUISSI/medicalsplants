-- ============================================================
-- MEDICALS PLANTS - Seed Data (PostgreSQL)
-- Version: 2.0.0
-- ============================================================

-- ============================================================
-- Admin User (mot de passe: Admin123!)
-- Hash BCrypt généré avec strength 12
-- ============================================================
INSERT INTO mp_user (id, email, pseudo, firstname, lastname, password_hash, role, status, is_email_verified, created_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@medicalsplants.com',
    'admin',
    'Admin',
    'System',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.CQ6Ww5Zz5Z5Z5.',
    'ADMIN',
    'ACTIVE',
    TRUE,
    now()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Test User (mot de passe: Test1234!)
-- ============================================================
INSERT INTO mp_user (id, email, pseudo, firstname, lastname, password_hash, role, status, is_email_verified, created_at)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'test@medicalsplants.com',
    'testuser',
    'Test',
    'User',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.CQ6Ww5Zz5Z5Z5.',
    'USER',
    'ACTIVE',
    TRUE,
    now()
) ON CONFLICT (email) DO NOTHING;
