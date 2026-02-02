-- ============================================================
-- MEDICALS PLANTS - Database Schema (PostgreSQL)
-- Version: 2.0.0
-- ============================================================

-- Extension pour UUID natif PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS & AUTHENTICATION
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
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_token VARCHAR(64),
    password_reset_token VARCHAR(64),
    password_reset_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    
    CONSTRAINT chk_user_role CHECK (role IN ('USER', 'MODERATOR', 'ADMIN')),
    CONSTRAINT chk_user_status CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED'))
);

CREATE INDEX IF NOT EXISTS idx_mp_user_email ON mp_user(email);
CREATE INDEX IF NOT EXISTS idx_mp_user_pseudo ON mp_user(pseudo);
CREATE INDEX IF NOT EXISTS idx_mp_user_status ON mp_user(status);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_refresh_token (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mp_refresh_token_token ON mp_refresh_token(token);
CREATE INDEX IF NOT EXISTS idx_mp_refresh_token_user ON mp_refresh_token(user_id);

-- ============================================================
-- SYMPTOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_symptom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    family VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mp_symptom_title ON mp_symptom(title);
CREATE INDEX IF NOT EXISTS idx_mp_symptom_family ON mp_symptom(family);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_property (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    family VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mp_property_title ON mp_property(title);
CREATE INDEX IF NOT EXISTS idx_mp_property_family ON mp_property(family);

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
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    history TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mp_plant_title ON mp_plant(title);

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
    description TEXT,
    image_url TEXT,
    type VARCHAR(20) NOT NULL,
    preparation_time_minutes SMALLINT,
    difficulty SMALLINT,
    servings SMALLINT DEFAULT 1,
    ingredients JSONB,
    instructions JSONB,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    author_id UUID REFERENCES mp_user(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    
    CONSTRAINT chk_recipe_type CHECK (type IN ('HOT_DRINK', 'COLD_DRINK', 'DISH', 'LOTION', 'OTHER')),
    CONSTRAINT chk_recipe_status CHECK (status IN ('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT chk_recipe_difficulty CHECK (difficulty IS NULL OR (difficulty >= 1 AND difficulty <= 5))
);

CREATE INDEX IF NOT EXISTS idx_mp_recipe_title ON mp_recipe(title);
CREATE INDEX IF NOT EXISTS idx_mp_recipe_type ON mp_recipe(type);
CREATE INDEX IF NOT EXISTS idx_mp_recipe_status ON mp_recipe(status);
CREATE INDEX IF NOT EXISTS idx_mp_recipe_author ON mp_recipe(author_id);

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
    rating SMALLINT,
    author_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mp_recipe(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES mp_review(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT chk_review_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

CREATE INDEX IF NOT EXISTS idx_mp_review_author ON mp_review(author_id);
CREATE INDEX IF NOT EXISTS idx_mp_review_recipe ON mp_review(recipe_id);
CREATE INDEX IF NOT EXISTS idx_mp_review_parent ON mp_review(parent_id);

-- ============================================================
-- INTERACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS mp_interaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    user_id UUID NOT NULL REFERENCES mp_user(id) ON DELETE CASCADE,
    review_id UUID NOT NULL REFERENCES mp_review(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_interaction_type CHECK (type IN ('LIKE', 'DISLIKE', 'BOOKMARK', 'REPORT')),
    CONSTRAINT uq_interaction_user_review_type UNIQUE (user_id, review_id, type)
);

CREATE INDEX IF NOT EXISTS idx_mp_interaction_review ON mp_interaction(review_id);
