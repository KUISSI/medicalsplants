# Database - Medicals Plants

## Architecture

Les migrations SQL sont gérées par **Flyway** et se trouvent dans :
```
backend/src/main/resources/db/migration/
├── V1__init_schema.sql    # Schéma de base (tables, index)
└── V2__seed_data.sql      # Données de test (optionnel)
```

## Fichiers CSV (data_import/)

Les fichiers CSV dans `data_import/` sont les **données source de référence** :

| Fichier | Contenu |
|---------|---------|
| `symptom.csv` | Liste des symptômes |
| `property.csv` | Liste des propriétés médicinales |
| `plant.csv` | Liste des plantes |
| `plant_property_title.csv` | Liaisons plante ↔ propriété |
| `property_symptom_title.csv` | Liaisons propriété ↔ symptôme |

## Importer les données CSV dans PostgreSQL

### Windows (PowerShell)
```powershell
# Import/mise à jour des données
.\scripts\import-csv-to-postgres.ps1

# Réinitialiser et réimporter (supprime les données existantes)
.\scripts\import-csv-to-postgres.ps1 -Reset
```

### Linux/Mac (Bash)
```bash
# Import/mise à jour des données
./scripts/import-csv-to-postgres.sh

# Réinitialiser et réimporter
./scripts/import-csv-to-postgres.sh --reset
```

### Ce que fait le script d'import :
1. Copie les fichiers CSV dans le container Docker
2. Convertit l'encodage en UTF-8
3. Importe dans des tables temporaires
4. Insère ou met à jour les données principales
5. Crée les liaisons (tables de jonction)

## Démarrage en développement

1. **Lancer PostgreSQL via Docker** :
   ```bash
   docker-compose -f docker-compose.dev.yml up -d db
   ```

2. **Lancer le backend** (Flyway exécute automatiquement les migrations) :
   ```bash
   cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

3. **(Optionnel) Importer les données CSV** :
   ```bash
   ./scripts/import-csv-to-postgres.sh
   ```

## Accès à la base

| Paramètre | Valeur |
|-----------|--------|
| Host | localhost |
| Port | 5433 |
| Database | medicalsplants_dev |
| User | postgres |
| Password | postgres |

### Via Adminer (UI web)
```bash
docker-compose -f docker-compose.dev.yml up -d adminer
```
Accès : http://localhost:8081

## Réinitialiser complètement la base

```bash
# Supprimer le volume Docker (perte de toutes les données)
docker-compose -f docker-compose.dev.yml down -v

# Relancer PostgreSQL
docker-compose -f docker-compose.dev.yml up -d db

# Réimporter les CSV
./scripts/import-csv-to-postgres.sh
```

## Modifier les données

1. Édite les fichiers CSV dans `data_import/`
2. Assure-toi qu'ils sont encodés en **UTF-8** (ou Windows-1252, le script convertit)
3. Lance le script d'import :
   ```bash
   ./scripts/import-csv-to-postgres.sh
   ```
4. Les données existantes seront mises à jour (UPSERT sur le titre)
