# Medicals Plants API

API REST pour l'application Medicals Plants. 

## Technologies

- Java 21
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven

## Installation

### Prérequis

- Java 21+
- Maven 3.9+
- PostgreSQL 16+
- Docker (optionnel)

### Configuration

1. Copier le fichier d'environnement : 
```bash
cp ../.env.example ../.env
```

## Import de données relationnelles (jointures)

Pour importer les associations (jointures) à partir des fichiers CSV, procédez ainsi :

### Préparation
- Placez vos fichiers CSV dans le dossier `data_import/` à la racine du projet.
- Les fichiers doivent être encodés en UTF-8 et utiliser le point-virgule `;` comme séparateur.
- Exemples de fichiers :
  - `plant_property_title.csv` (colonnes : plant_title;property_title)
  - `property_symptom_title.csv` (colonnes : property_title;symptom_title)

### Import manuel via psql

1. Ouvrez un terminal dans le dossier racine du projet.
2. Lancez psql en mode interactif :
   ```bash
   psql -U postgres -d medicalsplants_dev
   ```
3. Dans la console psql, copiez-collez les blocs suivants :

#### Pour ms_plant_property
```sql
CREATE TEMP TABLE tmp_plant_property (
  plant_title TEXT,
  property_title TEXT
);

\copy tmp_plant_property FROM 'data_import/plant_property_title.csv' DELIMITER ';' CSV HEADER;

INSERT INTO ms_plant_property(plant_id, property_id)
SELECT
  p.id,
  pr.id
FROM tmp_plant_property t
JOIN ms_plant p ON p.title = t.plant_title
JOIN ms_property pr ON pr.title = t.property_title
ON CONFLICT DO NOTHING;

DROP TABLE tmp_plant_property;
```

#### Pour ms_property_symptom
```sql
CREATE TEMP TABLE tmp_property_symptom (
  property_title TEXT,
  symptom_title TEXT
);

\copy tmp_property_symptom FROM 'data_import/property_symptom_title.csv' DELIMITER ';' CSV HEADER;

INSERT INTO ms_property_symptom(property_id, symptom_id)
SELECT
  p.id,
  s.id
FROM tmp_property_symptom t
JOIN ms_property p ON p.title = t.property_title
JOIN ms_symptom s ON s.title = t.symptom_title
ON CONFLICT DO NOTHING;

DROP TABLE tmp_property_symptom;
```

- Les doublons sont ignorés automatiquement.
- Vous pouvez relancer ces commandes sans risque.

---