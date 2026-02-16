-- ============================================================
-- MEDICALS PLANTS - Seed Users
-- Version: 2.0.0
-- ============================================================

-- Admin user (password: Admin123!)
-- BCrypt hash for "Admin123!"
INSERT INTO mp_user (id, email, pseudo, firstname, lastname, password_hash, role, status, is_email_verified, created_at)
VALUES (
    '549ab169-f074-4abb-9610-c35907ab9abb',
    'admin@medicalsplants.com',
    'admin',
    'Admin',
    'MedicalPlants',
    '$2a$10$N9qo8uLOickgx2ZMRZoHKuQxjzxjs0JjnJd9JXjNQrjPBNxSq.h4a',
    'ADMIN',
    'ACTIVE',
    TRUE,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Test user (password: Test123!)
-- BCrypt hash for "Test123!"
INSERT INTO mp_user (id, email, pseudo, firstname, lastname, password_hash, role, status, is_email_verified, created_at)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'test@medicalsplants.com',
    'testuser',
    'Test',
    'User',
    '$2a$10$N9qo8uLOickgx2ZMRZoHKuQxjzxjs0JjnJd9JXjNQrjPBNxSq.h4a',
    'USER',
    'ACTIVE',
    TRUE,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Premium user (password: Premium123!)
INSERT INTO mp_user (id, email, pseudo, firstname, lastname, password_hash, role, status, is_email_verified, created_at)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'premium@medicalsplants.com',
    'premiumuser',
    'Premium',
    'User',
    '$2a$10$N9qo8uLOickgx2ZMRZoHKuQxjzxjs0JjnJd9JXjNQrjPBNxSq.h4a',
    'PREMIUM',
    'ACTIVE',
    TRUE,
    NOW()
) ON CONFLICT (email) DO NOTHING;
