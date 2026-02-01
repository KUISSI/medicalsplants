-- ============================================================
-- MEDICALS PLANTS - Database Schema
-- Version:  1.0.0
-- ============================================================

-- Extensions not needed for H2

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_user (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_email ON ms_user(email);
CREATE INDEX IF NOT EXISTS idx_user_pseudo ON ms_user(pseudo);
CREATE INDEX IF NOT EXISTS idx_user_status ON ms_user(status);
CREATE INDEX IF NOT EXISTS idx_user_role ON ms_user(role);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    token VARCHAR(500) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES ms_user(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_token ON ms_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_token_user ON ms_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expires ON ms_refresh_tokens(expires_at);

-- ============================================================
-- SYMPTOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_symptom (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    title VARCHAR(100) NOT NULL UNIQUE,
    symptom_family VARCHAR(100) NOT NULL,
    symptom_detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_symptom_title ON ms_symptom(title);
CREATE INDEX IF NOT EXISTS idx_symptom_family ON ms_symptom(symptom_family);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_property (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    title VARCHAR(100) NOT NULL UNIQUE,
    property_family VARCHAR(100) NOT NULL,
    property_detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_property_title ON ms_property(title);
CREATE INDEX IF NOT EXISTS idx_property_family ON ms_property(property_family);

-- ============================================================
-- PROPERTY - SYMPTOM (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_property_symptom (
    property_id UUID NOT NULL REFERENCES ms_property(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES ms_symptom(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, symptom_id)
);

-- ============================================================
-- PLANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_plant (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    administration_mode VARCHAR(30) NOT NULL,
    consumed_part VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plant_title ON ms_plant(title);
CREATE INDEX IF NOT EXISTS idx_plant_admin_mode ON ms_plant(administration_mode);

-- ============================================================
-- PLANT - PROPERTY (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_plant_property (
    plant_id UUID NOT NULL REFERENCES ms_plant(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES ms_property(id) ON DELETE CASCADE,
    PRIMARY KEY (plant_id, property_id)
);

-- ============================================================
-- RECEIPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_receipt (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    author_id UUID REFERENCES ms_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_receipt_title ON ms_receipt(title);
CREATE INDEX IF NOT EXISTS idx_receipt_type ON ms_receipt(type);
CREATE INDEX IF NOT EXISTS idx_receipt_status ON ms_receipt(status);
CREATE INDEX IF NOT EXISTS idx_receipt_is_premium ON ms_receipt(is_premium);
CREATE INDEX IF NOT EXISTS idx_receipt_author ON ms_receipt(author_id);

-- ============================================================
-- RECEIPT - PLANT (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_receipt_plant (
    receipt_id UUID NOT NULL REFERENCES ms_receipt(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES ms_plant(id) ON DELETE CASCADE,
    PRIMARY KEY (receipt_id, plant_id)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_review (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    content TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES ms_user(id) ON DELETE CASCADE,
    receipt_id UUID NOT NULL REFERENCES ms_receipt(id) ON DELETE CASCADE,
    parent_review_id UUID REFERENCES ms_review(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_receipt ON ms_review(receipt_id);
CREATE INDEX IF NOT EXISTS idx_review_sender ON ms_review(sender_id);
CREATE INDEX IF NOT EXISTS idx_review_parent ON ms_review(parent_review_id);
CREATE INDEX IF NOT EXISTS idx_review_deleted ON ms_review(deleted_at);

-- ============================================================
-- INTERACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS ms_interaction (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    type VARCHAR(20) NOT NULL,
    value VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL REFERENCES ms_user(id) ON DELETE CASCADE,
    review_id UUID NOT NULL REFERENCES ms_review(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (user_id, review_id, type, value)
);

CREATE INDEX IF NOT EXISTS idx_interaction_review ON ms_interaction(review_id);
CREATE INDEX IF NOT EXISTS idx_interaction_user ON ms_interaction(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_type ON ms_interaction(type);

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- Schema created successfully for H2!