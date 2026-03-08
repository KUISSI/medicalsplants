-- ============================================================
-- MEDICALS PLANTS - Database Schema (UUID natif, pro & DRY)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- USERS
CREATE TABLE ms_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_email ON ms_user(email);
CREATE INDEX IF NOT EXISTS idx_user_pseudo ON ms_user(pseudo);
CREATE INDEX IF NOT EXISTS idx_user_status ON ms_user(status);
CREATE INDEX IF NOT EXISTS idx_user_role ON ms_user(role);

-- SYMPTOMS
CREATE TABLE ms_symptom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL UNIQUE,
    symptom_family VARCHAR(100) NOT NULL,
    symptom_detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_symptom_title ON ms_symptom(title);

-- PROPERTIES
CREATE TABLE ms_property (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL UNIQUE,
    property_family VARCHAR(100) NOT NULL,
    property_detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_property_title ON ms_property(title);

-- PLANTS
CREATE TABLE ms_plant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    administration_mode VARCHAR(30) NOT NULL,
    consumed_part VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plant_title ON ms_plant(title);

-- RECEIPTS
CREATE TABLE ms_receipt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Many-to-Many tables
CREATE TABLE ms_property_symptom (
    property_id UUID NOT NULL REFERENCES ms_property(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES ms_symptom(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, symptom_id)
);

CREATE TABLE ms_plant_property (
    plant_id UUID NOT NULL REFERENCES ms_plant(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES ms_property(id) ON DELETE CASCADE,
    PRIMARY KEY (plant_id, property_id)
);

CREATE TABLE ms_receipt_plant (
    receipt_id UUID NOT NULL REFERENCES ms_receipt(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES ms_plant(id) ON DELETE CASCADE,
    PRIMARY KEY (receipt_id, plant_id)
);

-- REVIEWS
CREATE TABLE ms_review (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- INTERACTIONS
CREATE TABLE ms_interaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    value VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL REFERENCES ms_user(id) ON DELETE CASCADE,
    review_id UUID NOT NULL REFERENCES ms_review(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (user_id, review_id, type, value)
);

-- Optional success notice
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
END $$;