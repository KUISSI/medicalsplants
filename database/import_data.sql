-- Import complexe pour la table de jointure ms_plant_property
-- 1. Table temporaire pour l'import brut
CREATE TEMP TABLE tmp_plant_property (
  plant_title TEXT,
  property_title TEXT
);

-- 2. Import du CSV (utiliser \copy si lancé depuis psql en local)
\copy tmp_plant_property FROM '../data_import/plant_property_title.csv' DELIMITER ';' CSV HEADER;

-- 3. Insertion dans la table de jointure avec résolution des UUID
INSERT INTO ms_plant_property(plant_id, property_id)
SELECT
  p.id,
  pr.id
FROM tmp_plant_property t
JOIN ms_plant p ON p.title = t.plant_title
JOIN ms_property pr ON pr.title = t.property_title
ON CONFLICT DO NOTHING;

-- 4. Nettoyage
DROP TABLE tmp_plant_property;

-- Import complexe pour la table de jointure ms_property_symptom
-- 1. Table temporaire pour l'import brut
CREATE TEMP TABLE tmp_property_symptom (
  property_title TEXT,
  symptom_title TEXT
);

-- 2. Import du CSV (utiliser \copy si lancé depuis psql en local)
\copy tmp_property_symptom FROM '../data_import/property_symptom_title.csv' DELIMITER ';' CSV HEADER;

-- 3. Insertion dans la table de jointure avec résolution des UUID
INSERT INTO ms_property_symptom(property_id, symptom_id)
SELECT
  p.id,
  s.id
FROM tmp_property_symptom t
JOIN ms_property p ON p.title = t.property_title
JOIN ms_symptom s ON s.title = t.symptom_title
ON CONFLICT DO NOTHING;

-- 4. Nettoyage
DROP TABLE tmp_property_symptom;