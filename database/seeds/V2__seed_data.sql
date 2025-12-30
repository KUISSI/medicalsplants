-- ============================================================
-- MEDICALS PLANTS - Seed Data
-- Version: 1.0.0
-- ============================================================

-- ============================================================
-- ADMIN USER (password: Admin123!)
-- ============================================================
INSERT INTO ms_user (id, email, password_hash, pseudo, firstname, lastname, role, status, is_active, is_email_verified, created_at)
VALUES (
    '01HX0000000000000000000001',
    'admin@medicalsplants.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4tC1rPvZj1IfqW1K',
    'Admin',
    'System',
    'Administrator',
    'ADMIN',
    'ACTIVE',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SAMPLE SYMPTOMS
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000010', 'Maux de tête', 'Neurologique', 'Douleurs au niveau de la tête, pouvant être légères à sévères. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000011', 'Migraine', 'Neurologique', 'Céphalée intense, souvent unilatérale, avec nausées possibles.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000012', 'Insomnie', 'Sommeil', 'Difficulté à s''endormir ou à rester endormi. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000013', 'Stress', 'Psychologique', 'État de tension nerveuse et d''anxiété. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000014', 'Anxiété', 'Psychologique', 'Sentiment d''inquiétude et de peur excessive.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000015', 'Fatigue', 'Général', 'Sensation d''épuisement physique ou mental.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000016', 'Rhume', 'Respiratoire', 'Infection virale des voies respiratoires supérieures.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000017', 'Toux', 'Respiratoire', 'Expulsion d''air des poumons avec un bruit caractéristique.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000018', 'Maux de gorge', 'Respiratoire', 'Douleur ou irritation de la gorge.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000019', 'Digestion difficile', 'Digestif', 'Troubles de la digestion après les repas.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000020', 'Nausées', 'Digestif', 'Sensation de malaise avec envie de vomir. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000021', 'Ballonnements', 'Digestif', 'Sensation de gonflement abdominal.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SAMPLE PROPERTIES
-- ============================================================
INSERT INTO ms_property (id, title, property_family, property_detail, created_at) VALUES
    ('01HX0000000000000000000030', 'Antalgique', 'Analgésique', 'Propriété de soulager la douleur.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000031', 'Anti-inflammatoire', 'Anti-inflammatoire', 'Réduit l''inflammation et le gonflement.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000032', 'Sédatif', 'Calmant', 'Favorise le calme et la relaxation.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000033', 'Anxiolytique', 'Calmant', 'Réduit l''anxiété et le stress.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000034', 'Digestif', 'Digestif', 'Facilite la digestion. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000035', 'Antiseptique', 'Antimicrobien', 'Combat les infections.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000036', 'Expectorant', 'Respiratoire', 'Facilite l''expulsion des sécrétions bronchiques.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000037', 'Tonique', 'Stimulant', 'Renforce et stimule l''organisme.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- PROPERTY - SYMPTOM LINKS
-- ============================================================
INSERT INTO ms_property_symptom (property_id, symptom_id) VALUES
    ('01HX0000000000000000000030', '01HX0000000000000000000010'),
    ('01HX0000000000000000000030', '01HX0000000000000000000011'),
    ('01HX0000000000000000000032', '01HX0000000000000000000012'),
    ('01HX0000000000000000000033', '01HX0000000000000000000013'),
    ('01HX0000000000000000000033', '01HX0000000000000000000014'),
    ('01HX0000000000000000000037', '01HX0000000000000000000015'),
    ('01HX0000000000000000000035', '01HX0000000000000000000016'),
    ('01HX0000000000000000000036', '01HX0000000000000000000017'),
    ('01HX0000000000000000000035', '01HX0000000000000000000018'),
    ('01HX0000000000000000000034', '01HX0000000000000000000019'),
    ('01HX0000000000000000000034', '01HX0000000000000000000020'),
    ('01HX0000000000000000000034', '01HX0000000000000000000021')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE PLANTS
-- ============================================================
INSERT INTO ms_plant (id, title, description, administration_mode, consumed_part, created_at) VALUES
    ('01HX0000000000000000000050', 'Camomille', 'Plante aux propriétés apaisantes et digestives, utilisée depuis l''Antiquité.', 'ORAL_ROUTE', 'Fleurs', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000051', 'Menthe poivrée', 'Plante rafraîchissante aux vertus digestives et antalgiques.', 'ORAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000052', 'Lavande', 'Plante aromatique connue pour ses effets relaxants et apaisants.', 'NASAL_ROUTE', 'Fleurs', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000053', 'Thym', 'Plante antiseptique utilisée pour les affections respiratoires. ', 'ORAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000054', 'Gingembre', 'Rhizome aux propriétés anti-inflammatoires et digestives.', 'ORAL_ROUTE', 'Rhizome', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000055', 'Eucalyptus', 'Plante expectorante efficace contre les affections respiratoires. ', 'NASAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000056', 'Valériane', 'Plante sédative naturelle favorisant le sommeil.', 'ORAL_ROUTE', 'Racine', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000057', 'Aloe Vera', 'Plante aux propriétés cicatrisantes et hydratantes.', 'EPIDERMAL_ROUTE', 'Gel', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- PLANT - PROPERTY LINKS
-- ============================================================
INSERT INTO ms_plant_property (plant_id, property_id) VALUES
    ('01HX0000000000000000000050', '01HX0000000000000000000032'),
    ('01HX0000000000000000000050', '01HX0000000000000000000034'),
    ('01HX0000000000000000000051', '01HX0000000000000000000030'),
    ('01HX0000000000000000000051', '01HX0000000000000000000034'),
    ('01HX0000000000000000000052', '01HX0000000000000000000032'),
    ('01HX0000000000000000000052', '01HX0000000000000000000033'),
    ('01HX0000000000000000000053', '01HX0000000000000000000035'),
    ('01HX0000000000000000000053', '01HX0000000000000000000036'),
    ('01HX0000000000000000000054', '01HX0000000000000000000031'),
    ('01HX0000000000000000000054', '01HX0000000000000000000034'),
    ('01HX0000000000000000000055', '01HX0000000000000000000031'),
    ('01HX0000000000000000000055', '01HX0000000000000000000036'),
    ('01HX0000000000000000000056', '01HX0000000000000000000032'),
    ('01HX0000000000000000000057', '01HX0000000000000000000035')
ON CONFLICT DO NOTHING;


-- ============================================================
-- MEDICALS PLANTS - Seed Data (Données de test)
-- Version: 1.0.0
-- Author: KUISSI
-- ============================================================

-- ============================================================
-- ADMIN USER
-- Email: admin@medicalsplants.com
-- Password: Admin123!
-- ============================================================
INSERT INTO ms_user (id, email, password_hash, pseudo, firstname, lastname, role, status, is_active, is_email_verified, created_at)
VALUES (
    '01HX0000000000000000000001',
    'admin@medicalsplants. com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4tC1rPvZj1IfqW1K',
    'Admin',
    'System',
    'Administrator',
    'ADMIN',
    'ACTIVE',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- TEST USER
-- Email: user@medicalsplants.com
-- Password: User123! 
-- ============================================================
INSERT INTO ms_user (id, email, password_hash, pseudo, firstname, lastname, role, status, is_active, is_email_verified, created_at)
VALUES (
    '01HX0000000000000000000002',
    'user@medicalsplants.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi. Ye4oKoEa3Ro9llC/. og/at2.uheWG/igi',
    'TestUser',
    'Test',
    'User',
    'USER',
    'ACTIVE',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- PREMIUM USER
-- Email:  premium@medicalsplants.com
-- Password: Premium123! 
-- ============================================================
INSERT INTO ms_user (id, email, password_hash, pseudo, firstname, lastname, role, status, is_active, is_email_verified, created_at)
VALUES (
    '01HX0000000000000000000003',
    'premium@medicalsplants.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'PremiumUser',
    'Premium',
    'User',
    'PREMIUM',
    'ACTIVE',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille Neurologique
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000010', 'Maux de tete', 'Neurologique', 'Douleurs localisees au niveau de la tete, pouvant etre legeres a severes.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000011', 'Migraine', 'Neurologique', 'Cephalee intense, souvent unilaterale, accompagnee de nausees. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000012', 'Vertiges', 'Neurologique', 'Sensation de tournis ou de perte d equilibre. ', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille Sommeil
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000013', 'Insomnie', 'Sommeil', 'Difficulte a s endormir ou a maintenir le sommeil.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000014', 'Troubles du sommeil', 'Sommeil', 'Perturbations de la qualite ou de la duree du sommeil. ', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille Psychologique
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000015', 'Stress', 'Psychologique', 'Etat de tension nerveuse et d anxiete.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000016', 'Anxiete', 'Psychologique', 'Sentiment d inquietude excessive et de peur.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000017', 'Depression legere', 'Psychologique', 'Baisse de moral et de motivation.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille Respiratoire
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000018', 'Rhume', 'Respiratoire', 'Infection virale des voies respiratoires superieures.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000019', 'Toux', 'Respiratoire', 'Expulsion d air des poumons avec un bruit caracteristique.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000020', 'Maux de gorge', 'Respiratoire', 'Douleur ou irritation de la gorge.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000021', 'Congestion nasale', 'Respiratoire', 'Obstruction des voies nasales.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille Digestif
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000022', 'Digestion difficile', 'Digestif', 'Troubles de la digestion apres les repas.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000023', 'Nausees', 'Digestif', 'Sensation de malaise avec envie de vomir. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000024', 'Ballonnements', 'Digestif', 'Sensation de gonflement abdominal.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000025', 'Constipation', 'Digestif', 'Difficulte a evacuer les selles. ', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- SYMPTOMS - Famille General
-- ============================================================
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at) VALUES
    ('01HX0000000000000000000026', 'Fatigue', 'General', 'Sensation d epuisement physique ou mental.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000027', 'Fievre', 'General', 'Elevation de la temperature corporelle.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- PROPERTIES (Proprietes medicinales)
-- ============================================================
INSERT INTO ms_property (id, title, property_family, property_detail, created_at) VALUES
    ('01HX0000000000000000000030', 'Antalgique', 'Analgesique', 'Propriete de soulager la douleur.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000031', 'Anti-inflammatoire', 'Anti-inflammatoire', 'Reduit l inflammation et le gonflement.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000032', 'Sedatif', 'Calmant', 'Favorise le calme et la relaxation.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000033', 'Anxiolytique', 'Calmant', 'Reduit l anxiete et le stress.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000034', 'Digestif', 'Digestif', 'Facilite la digestion. ', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000035', 'Carminatif', 'Digestif', 'Aide a expulser les gaz intestinaux.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000036', 'Antiseptique', 'Antimicrobien', 'Combat les infections.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000037', 'Antibacterien', 'Antimicrobien', 'Detruit ou inhibe les bacteries.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000038', 'Expectorant', 'Respiratoire', 'Facilite l expulsion des secretions bronchiques.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000039', 'Decongestionnant', 'Respiratoire', 'Degage les voies respiratoires.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000040', 'Tonique', 'Stimulant', 'Renforce et stimule l organisme.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000041', 'Immunostimulant', 'Stimulant', 'Renforce le systeme immunitaire.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000042', 'Antioxydant', 'Protecteur', 'Protege contre les radicaux libres.', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000043', 'Cicatrisant', 'Cutane', 'Favorise la cicatrisation des plaies.', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- PROPERTY - SYMPTOM LINKS
-- ============================================================
INSERT INTO ms_property_symptom (property_id, symptom_id) VALUES
    -- Antalgique -> Maux de tete, Migraine
    ('01HX0000000000000000000030', '01HX0000000000000000000010'),
    ('01HX0000000000000000000030', '01HX0000000000000000000011'),
    -- Anti-inflammatoire -> Maux de gorge
    ('01HX0000000000000000000031', '01HX0000000000000000000020'),
    -- Sedatif -> Insomnie, Troubles du sommeil
    ('01HX0000000000000000000032', '01HX0000000000000000000013'),
    ('01HX0000000000000000000032', '01HX0000000000000000000014'),
    -- Anxiolytique -> Stress, Anxiete
    ('01HX0000000000000000000033', '01HX0000000000000000000015'),
    ('01HX0000000000000000000033', '01HX0000000000000000000016'),
    -- Digestif -> Digestion difficile, Nausees
    ('01HX0000000000000000000034', '01HX0000000000000000000022'),
    ('01HX0000000000000000000034', '01HX0000000000000000000023'),
    -- Carminatif -> Ballonnements
    ('01HX0000000000000000000035', '01HX0000000000000000000024'),
    -- Antiseptique -> Rhume, Maux de gorge
    ('01HX0000000000000000000036', '01HX0000000000000000000018'),
    ('01HX0000000000000000000036', '01HX0000000000000000000020'),
    -- Expectorant -> Toux, Congestion nasale
    ('01HX0000000000000000000038', '01HX0000000000000000000019'),
    ('01HX0000000000000000000038', '01HX0000000000000000000021'),
    -- Decongestionnant -> Congestion nasale, Rhume
    ('01HX0000000000000000000039', '01HX0000000000000000000021'),
    ('01HX0000000000000000000039', '01HX0000000000000000000018'),
    -- Tonique -> Fatigue
    ('01HX0000000000000000000040', '01HX0000000000000000000026'),
    -- Immunostimulant -> Fievre, Rhume
    ('01HX0000000000000000000041', '01HX0000000000000000000027'),
    ('01HX0000000000000000000041', '01HX0000000000000000000018')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PLANTS (Plantes medicinales)
-- ============================================================
INSERT INTO ms_plant (id, title, description, administration_mode, consumed_part, created_at) VALUES
    ('01HX0000000000000000000050', 'Camomille', 'Plante aux proprietes apaisantes et digestives, utilisee depuis l Antiquite pour calmer les nerfs et faciliter la digestion. ', 'ORAL_ROUTE', 'Fleurs', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000051', 'Menthe poivree', 'Plante rafraichissante aux vertus digestives et antalgiques, ideale pour les troubles digestifs.', 'ORAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000052', 'Lavande', 'Plante aromatique connue pour ses effets relaxants et apaisants, utilisee en aromatherapie. ', 'NASAL_ROUTE', 'Fleurs', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000053', 'Thym', 'Plante antiseptique puissante utilisee pour les affections respiratoires et le renforcement immunitaire.', 'ORAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000054', 'Gingembre', 'Rhizome aux proprietes anti-inflammatoires et digestives, excellent contre les nausees. ', 'ORAL_ROUTE', 'Rhizome', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000055', 'Eucalyptus', 'Plante expectorante efficace contre les affections respiratoires et la congestion.', 'NASAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000056', 'Valeriane', 'Plante sedative naturelle favorisant le sommeil et reduisant l anxiete.', 'ORAL_ROUTE', 'Racine', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000057', 'Aloe Vera', 'Plante aux proprietes cicatrisantes et hydratantes, utilisee pour les soins de la peau.', 'EPIDERMAL_ROUTE', 'Gel', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000058', 'Tilleul', 'Plante calmante utilisee pour favoriser le sommeil et reduire le stress.', 'ORAL_ROUTE', 'Fleurs', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000059', 'Romarin', 'Plante tonique et stimulante, excellente pour la digestion et la memoire.', 'ORAL_ROUTE', 'Feuilles', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000060', 'Echinacee', 'Plante immunostimulante utilisee pour prevenir et traiter les infections.', 'ORAL_ROUTE', 'Racine', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000061', 'Fenouil', 'Plante carminative excellente contre les ballonnements et les troubles digestifs.', 'ORAL_ROUTE', 'Graines', CURRENT_TIMESTAMP)
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- PLANT - PROPERTY LINKS
-- ============================================================
INSERT INTO ms_plant_property (plant_id, property_id) VALUES
    -- Camomille:  Sedatif, Digestif, Anxiolytique
    ('01HX0000000000000000000050', '01HX0000000000000000000032'),
    ('01HX0000000000000000000050', '01HX0000000000000000000034'),
    ('01HX0000000000000000000050', '01HX0000000000000000000033'),
    -- Menthe poivree: Antalgique, Digestif, Carminatif
    ('01HX0000000000000000000051', '01HX0000000000000000000030'),
    ('01HX0000000000000000000051', '01HX0000000000000000000034'),
    ('01HX0000000000000000000051', '01HX0000000000000000000035'),
    -- Lavande: Sedatif, Anxiolytique
    ('01HX0000000000000000000052', '01HX0000000000000000000032'),
    ('01HX0000000000000000000052', '01HX0000000000000000000033'),
    -- Thym:  Antiseptique, Antibacterien, Expectorant
    ('01HX0000000000000000000053', '01HX0000000000000000000036'),
    ('01HX0000000000000000000053', '01HX0000000000000000000037'),
    ('01HX0000000000000000000053', '01HX0000000000000000000038'),
    -- Gingembre: Anti-inflammatoire, Digestif
    ('01HX0000000000000000000054', '01HX0000000000000000000031'),
    ('01HX0000000000000000000054', '01HX0000000000000000000034'),
    -- Eucalyptus: Expectorant, Decongestionnant, Antiseptique
    ('01HX0000000000000000000055', '01HX0000000000000000000038'),
    ('01HX0000000000000000000055', '01HX0000000000000000000039'),
    ('01HX0000000000000000000055', '01HX0000000000000000000036'),
    -- Valeriane:  Sedatif, Anxiolytique
    ('01HX0000000000000000000056', '01HX0000000000000000000032'),
    ('01HX0000000000000000000056', '01HX0000000000000000000033'),
    -- Aloe Vera: Cicatrisant, Anti-inflammatoire
    ('01HX0000000000000000000057', '01HX0000000000000000000043'),
    ('01HX0000000000000000000057', '01HX0000000000000000000031'),
    -- Tilleul:  Sedatif, Anxiolytique
    ('01HX0000000000000000000058', '01HX0000000000000000000032'),
    ('01HX0000000000000000000058', '01HX0000000000000000000033'),
    -- Romarin: Tonique, Digestif
    ('01HX0000000000000000000059', '01HX0000000000000000000040'),
    ('01HX0000000000000000000059', '01HX0000000000000000000034'),
    -- Echinacee:  Immunostimulant, Antibacterien
    ('01HX0000000000000000000060', '01HX0000000000000000000041'),
    ('01HX0000000000000000000060', '01HX0000000000000000000037'),
    -- Fenouil:  Carminatif, Digestif
    ('01HX0000000000000000000061', '01HX0000000000000000000035'),
    ('01HX0000000000000000000061', '01HX0000000000000000000034')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE RECEIPTS (Recettes)
-- ============================================================
INSERT INTO ms_receipt (id, title, type, description, is_premium, status, author_id, created_at) VALUES
    ('01HX0000000000000000000070', 'Tisane relaxante du soir', 'HOT_DRINK', 'Une tisane apaisante a base de camomille et tilleul pour favoriser un sommeil reparateur.', FALSE, 'PUBLISHED', '01HX0000000000000000000001', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000071', 'Infusion digestive', 'HOT_DRINK', 'Melange de menthe et fenouil pour faciliter la digestion apres un repas copieux.', FALSE, 'PUBLISHED', '01HX0000000000000000000001', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000072', 'Potion anti-rhume', 'HOT_DRINK', 'Preparation a base de thym et eucalyptus pour combattre les symptomes du rhume.', FALSE, 'PUBLISHED', '01HX0000000000000000000001', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000073', 'Elixir tonique matinal', 'HOT_DRINK', 'Boisson energisante au gingembre et romarin pour bien commencer la journee.', TRUE, 'PUBLISHED', '01HX0000000000000000000001', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000074', 'Lotion apaisante Aloe', 'LOTION', 'Preparation topique a base d Aloe Vera pour apaiser les irritations cutanees.', TRUE, 'PUBLISHED', '01HX0000000000000000000001', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================================
-- RECEIPT - PLANT LINKS
-- ============================================================
INSERT INTO ms_receipt_plant (receipt_id, plant_id) VALUES
    -- Tisane relaxante:  Camomille, Tilleul
    ('01HX0000000000000000000070', '01HX0000000000000000000050'),
    ('01HX0000000000000000000070', '01HX0000000000000000000058'),
    -- Infusion digestive:  Menthe, Fenouil
    ('01HX0000000000000000000071', '01HX0000000000000000000051'),
    ('01HX0000000000000000000071', '01HX0000000000000000000061'),
    -- Potion anti-rhume: Thym, Eucalyptus
    ('01HX0000000000000000000072', '01HX0000000000000000000053'),
    ('01HX0000000000000000000072', '01HX0000000000000000000055'),
    -- Elixir tonique:  Gingembre, Romarin
    ('01HX0000000000000000000073', '01HX0000000000000000000054'),
    ('01HX0000000000000000000073', '01HX0000000000000000000059'),
    -- Lotion Aloe: Aloe Vera
    ('01HX0000000000000000000074', '01HX0000000000000000000057')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO ms_review (id, content, sender_id, receipt_id, created_at) VALUES
    ('01HX0000000000000000000080', 'Excellente tisane !  Je la prends tous les soirs et je dors beaucoup mieux. ', '01HX0000000000000000000002', '01HX0000000000000000000070', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000081', 'Tres efficace pour la digestion. Je recommande apres les repas de fete ! ', '01HX0000000000000000000003', '01HX0000000000000000000071', CURRENT_TIMESTAMP),
    ('01HX0000000000000000000082', 'Cette potion m a aide a me remettre rapidement de mon rhume. Merci ! ', '01HX0000000000000000000002', '01HX0000000000000000000072', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- Seed data inserted successfully! 