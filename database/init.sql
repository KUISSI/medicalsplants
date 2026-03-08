-- ============================================
-- MEDICALS PLANTS - Database Initialization
-- ============================================

-- Activer l'extension UUID (pour les UUID natifs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optionnel : Activer l'extension pour la recherche textuelle avancée
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database medicalsplants_dev initialized successfully!';
END $$;