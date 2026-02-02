-- ============================================================
-- MEDICALS PLANTS - Database Schema (PostgreSQL)
-- Version: 2.0.0 - Préfixe mp_ (medicalsplants)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(254) NOT NULL UNIQUE,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    phone VARCHAR(20),
    avatar TEXT,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'PREMIUM', 'MODERATOR', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED')),
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_token VARCHAR(64),
    password_reset_token VARCHAR(64),
    password_reset_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_user_email ON mp_user(email);
CREATE INDEX idx_mp_user_pseudo ON mp_user(pseudo);
CREATE INDEX idx_mp_user_status ON mp_user(status);
CREATE INDEX idx_mp_user_role ON mp_user(role);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_refresh_token (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(512) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_refresh_token_token ON mp_refresh_token(token);
CREATE INDEX idx_mp_refresh_token_user ON mp_refresh_token(user_id);
CREATE INDEX idx_mp_refresh_token_expires ON mp_refresh_token(expires_at);

-- ============================================================
-- SYMPTOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_symptom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    family VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_symptom_title ON mp_symptom(title);
CREATE INDEX idx_mp_symptom_family ON mp_symptom(family);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_property (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    family VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_property_title ON mp_property(title);
CREATE INDEX idx_mp_property_family ON mp_property(family);

-- ============================================================
-- PROPERTY - SYMPTOM (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_property_symptom (
    property_id UUID NOT NULL REFERENCES mp_property(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES mp_symptom(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, symptom_id)
);

-- ============================================================
-- PLANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_plant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    history TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_plant_title ON mp_plant(title);

-- ============================================================
-- PLANT - PROPERTY (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_plant_property (
    plant_id UUID NOT NULL REFERENCES mp_plant(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES mp_property(id) ON DELETE CASCADE,
    PRIMARY KEY (plant_id, property_id)
);

-- ============================================================
-- RECIPES
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_recipe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('HOT_DRINK', 'COLD_DRINK', 'DISH', 'LOTION', 'OTHER')),
    description TEXT NOT NULL,
    preparation_time_minutes SMALLINT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    servings SMALLINT,
    ingredients JSONB,
    instructions JSONB,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED')),
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_recipe_title ON mp_recipe(title);
CREATE INDEX idx_mp_recipe_author ON mp_recipe(author_id);
CREATE INDEX idx_mp_recipe_status ON mp_recipe(status);
CREATE INDEX idx_mp_recipe_type ON mp_recipe(type);

-- ============================================================
-- RECIPE - PLANT (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_recipe_plant (
    recipe_id UUID NOT NULL REFERENCES mp_recipe(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES mp_plant(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, plant_id)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_review (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    author_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mp_recipe(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES mp_review(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mp_review_author ON mp_review(author_id);
CREATE INDEX idx_mp_review_recipe ON mp_review(recipe_id);
CREATE INDEX idx_mp_review_parent ON mp_review(parent_id);

-- ============================================================
-- INTERACTIONS (User <-> Recipe)
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_interaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('LIKE', 'DISLIKE', 'BOOKMARK', 'REPORT')),
    user_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mp_recipe(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE (user_id, recipe_id, type)
);

CREATE INDEX idx_mp_interaction_user ON mp_interaction(user_id);
CREATE INDEX idx_mp_interaction_recipe ON mp_interaction(recipe_id);
CREATE INDEX idx_mp_interaction_type ON mp_interaction(type);

-- ============================================================
-- TRIGGERS pour updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mp_user_updated_at BEFORE UPDATE ON mp_user 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_refresh_token_updated_at BEFORE UPDATE ON mp_refresh_token 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_symptom_updated_at BEFORE UPDATE ON mp_symptom 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_property_updated_at BEFORE UPDATE ON mp_property 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_plant_updated_at BEFORE UPDATE ON mp_plant 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_recipe_updated_at BEFORE UPDATE ON mp_recipe 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_review_updated_at BEFORE UPDATE ON mp_review 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mp_interaction_updated_at BEFORE UPDATE ON mp_interaction 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
