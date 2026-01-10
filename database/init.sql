-- ============================================
-- MEDICALS PLANTS - Database Initialization
-- ============================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database medicalsplants_dev initialized successfully!';
END $$;