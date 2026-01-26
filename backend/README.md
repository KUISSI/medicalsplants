# Lancer le backend avec gestion d'environnement centralisée

## 1. Depuis la racine du projet, choisir l'environnement (dev ou prod)

**Windows PowerShell**
```
cd "C:\Users\Utilisateur\Documents\Simplon_pc\Dossier Projets\Projet certification\medicalsplants"
./switch-env.ps1 dev  # ou prod
cd backend
./start-backend.ps1
```

**Linux/Mac**
```
cd "/chemin/vers/medicalsplants"
./switch-env.sh dev  # ou prod
cd backend
./start-backend.sh
```

## 2. Depuis le dossier backend directement (Windows)

```
cd "C:\Users\Utilisateur\Documents\Simplon_pc\Dossier Projets\Projet certification\medicalsplants\backend"
../switch-env.ps1 dev
./start-backend.ps1
```

> **Remarque :**
> - Le script `switch-env.ps1` doit rester à la racine du projet pour centraliser la gestion des environnements.
> - Le script `start-backend.ps1` doit rester dans le dossier backend.
> - Ne pas dupliquer les scripts.
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

2. **Configurer vos variables dans `.env`** (voir exemple fourni). Toutes les variables nécessaires (DB, JWT, mail, etc.) sont centralisées dans ce fichier.


### Lancement du backend (DRY & Pro)

#### 1. Choisir l'environnement (dev/prod)

À la racine du projet, activez l'environnement voulu :

```powershell
# Windows PowerShell
./switch-env.ps1 dev   # ou prod
```
```bash
# Linux/Mac
./switch-env.sh dev   # ou prod
```

Cela copie le bon fichier (.env.dev ou .env.prod) vers .env, utilisé par tous les scripts et Docker.

#### 2. Lancer le backend en local (hors Docker)

Dans le dossier `backend` :

**Windows (PowerShell)**
```powershell
./start-backend.ps1
```
**Linux/Mac**
```bash
./start-backend.sh
```
Ces scripts chargent automatiquement toutes les variables du `.env` avant de lancer le backend avec Maven. Plus besoin de modifier le script à chaque changement de variable ou de JWT.

#### 3. Lancer le backend avec Docker Compose

À la racine du projet :
```bash
docker-compose -f docker-compose.dev.yml up --build
```
Le service backend lit automatiquement le `.env` (et le JWT_SECRET) grâce à la directive `env_file` dans le compose. Les variables sont injectées dans le conteneur.

> **Astuce** : Pour un environnement reproductible, versionnez un `.env.example` et ne commitez jamais votre `.env` personnel.

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

## Documentation API & Swagger

L'API Medicals Plants est entièrement documentée et testable via Swagger UI.

### Accès à Swagger

Après avoir démarré le backend (voir section Installation), ouvrez votre navigateur à l'une des adresses suivantes :

- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Utilisation

- Tous les endpoints REST sont listés et documentés dans l'interface Swagger.
- Vous pouvez tester les requêtes directement depuis Swagger (GET, POST, PUT, DELETE, etc.).
- Les schémas de données, paramètres et réponses sont affichés pour chaque endpoint.
- Si certains endpoints nécessitent une authentification, utilisez le bouton "Authorize" pour renseigner votre token JWT.

### Dépendance utilisée

La documentation est générée automatiquement grâce à la librairie [springdoc-openapi](https://springdoc.org/) :
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### Configuration personnalisée

La configuration Swagger peut être ajustée dans le fichier `application.properties` :
```
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.tags-sorter=alpha
springdoc.swagger-ui.operations-sorter=alpha
```

---