-- Import complexe pour la table de jointure ms_plant_property
-- 1. Table temporaire pour l'import brut
CREATE TEMP TABLE tmp_plant_property (
  plant_title TEXT,
  property_title TEXT
);

-- 2. Import du CSV (utiliser \copy si lancé depuis psql en local)
\copy tmp_plant_property FROM '../data_import/plant_property_title.csv' DELIMITER ',' CSV HEADER;

-- 3. Insertion dans la table de jointure avec résolution des UUID
INSERT INTO ms_plant_property(plant_id, property_id)
SELECT
  p.id,
  pr.id
FROM tmp_plant_property t
JOIN ms_plant p ON p.title = t.plant_title
JOIN ms_property pr ON pr.title = t.property_title;

-- 4. Nettoyage
DROP TABLE tmp_plant_property;