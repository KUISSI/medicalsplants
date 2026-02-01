-- ============================================================
-- MEDICALS PLANTS - Seed Data (H2 compatible)
-- Version: 1.0.0
-- ============================================================

-- ============================================================
-- SYMPTOMS (UUID fixes pour les liaisons)
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
('11111111-1111-1111-1111-111111111101', 'Flatulences', 'Digestif', 'Accumulation de gaz', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111102', 'Nausées', 'Digestif', 'Envie de vomir', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111103', 'Maux de tête', 'Nerveux', 'Douleur au niveau de la tête', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111104', 'Insomnie', 'Nerveux', 'Difficulté à dormir', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111105', 'Anxiété', 'Nerveux', 'État de nervosité', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111106', 'Eczéma', 'Cutané', 'Inflammation de la peau', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111107', 'Brûlures légères', 'Cutané', 'Affection de la peau', CURRENT_TIMESTAMP);

-- ============================================================
-- PROPERTIES (UUID fixes pour les liaisons)
-- ============================================================
INSERT INTO ms_property (id, title, property_family, property_detail, created_at) VALUES
('22222222-2222-2222-2222-222222222201', 'Anti-inflammatoire', 'Anti-inflammatoire', 'Réduit l''inflammation', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222202', 'Antispasmodique', 'Antispasmodique', 'Soulage les spasmes', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222203', 'Sédatif', 'Calmant', 'Favorise le calme', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222204', 'Anxiolytique', 'Calmant', 'Réduit l''anxiété', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222205', 'Digestif', 'Digestif', 'Facilite la digestion', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222206', 'Cicatrisant', 'Cutané', 'Aide à la cicatrisation', CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222207', 'Antiseptique', 'Antimicrobien', 'Combat les infections', CURRENT_TIMESTAMP);

-- ============================================================
-- PLANTS (UUID fixes pour les liaisons)
-- ============================================================
INSERT INTO ms_plant (id, title, description, created_at) VALUES
('33333333-3333-3333-3333-333333333301', 'Lavande', 'La lavande est une plante aux multiples vertus. Elle est connue pour ses propriétés apaisantes et relaxantes.', CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333302', 'Camomille', 'La camomille est une plante douce, idéale pour les peaux sensibles et irritées.', CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333303', 'Aloe Vera', 'Plante succulente aux propriétés apaisantes et hydratantes.', CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333304', 'Menthe', 'Plante aromatique rafraîchissante aux vertus digestives.', CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333305', 'Thym', 'Plante aromatique aux propriétés antiseptiques et expectorantes.', CURRENT_TIMESTAMP);

-- ============================================================
-- PROPERTY - SYMPTOM (liaisons)
-- ============================================================
INSERT INTO ms_property_symptom (property_id, symptom_id) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111106'),
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111107'),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111104'),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111105'),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111102'),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111106'),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111107'),
('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111106');

-- ============================================================
-- PLANT - PROPERTY (liaisons)
-- ============================================================
INSERT INTO ms_plant_property (plant_id, property_id) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203'),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204'),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222203'),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201'),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222206'),
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202'),
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222205'),
('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222207');

-- ============================================================
-- USERS (pour les receipts)
-- ============================================================
INSERT INTO ms_user (id, email, password_hash, pseudo, firstname, lastname, role, is_active, is_email_verified, created_at) VALUES
('44444444-4444-4444-4444-444444444401', 'admin@medicalsplants.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'System', 'ADMIN', TRUE, TRUE, CURRENT_TIMESTAMP),
('44444444-4444-4444-4444-444444444402', 'user@medicalsplants.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'testuser', 'Test', 'User', 'USER', TRUE, TRUE, CURRENT_TIMESTAMP);

-- ============================================================
-- RECEIPTS
-- ============================================================
INSERT INTO ms_receipt (id, title, type, description, is_premium, status, author_id, created_at) VALUES
('55555555-5555-5555-5555-555555555501', 'Tisane relaxante', 'HOT_DRINK', 'Mélange de plantes pour favoriser la détente et le sommeil.', FALSE, 'PUBLISHED', '44444444-4444-4444-4444-444444444402', CURRENT_TIMESTAMP),
('55555555-5555-5555-5555-555555555502', 'Baume apaisant', 'LOTION', 'Préparation à base de plantes pour application cutanée.', FALSE, 'PUBLISHED', '44444444-4444-4444-4444-444444444402', CURRENT_TIMESTAMP),
('55555555-5555-5555-5555-555555555503', 'Infusion digestive', 'HOT_DRINK', 'Infusion pour faciliter la digestion après les repas.', FALSE, 'PUBLISHED', '44444444-4444-4444-4444-444444444401', CURRENT_TIMESTAMP);

-- ============================================================
-- RECEIPT - PLANT (liaisons)
-- ============================================================
INSERT INTO ms_receipt_plant (receipt_id, plant_id) VALUES
('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301'),
('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333302'),
('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333303'),
('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333304'),
('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333302');
