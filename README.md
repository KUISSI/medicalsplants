# 🌿 Medicals Plants

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/KUISSI/medicalsplants)
[![License:  MIT](https://img.shields.io/badge/License-MIT-yellow. svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-blue)](https://openjdk.org/)
[![Angular](https://img.shields.io/badge/Angular-17-red)](https://angular.io/)

## 📋 Description

**Medicals Plants** est une application web permettant de découvrir les plantes médicinales et leurs propriétés thérapeutiques. Les utilisateurs event rechercher des symptômes, trouver les plantes adaptées, consulter des recettes et partager leers avis.

### 🎯 Fonctionnalités principales

- 🔍 Recherche de symptômes par catégorie
- 🌿 Catalogue de plantes médicinales
- 📖 Recettes à base de plantes
- ⭐ Système d'avis et de réactions
- 👑 Contenu Premium exclusif
- 🔐 Authentification sécurisée (JWT)

## 🏗️ Architecture

┌─────────────────┐ ┌─────────────────┐ │ Frontend App │ │ Frontend Admin │ │ (Angular 17) │ │ (Angular 17) │ │ Bootstrap 5 │ │ Bootstrap 5 │ └────────┬────────┘ └────────┬────────┘ │ │ └───────────┬───────────┘ │ ┌──────▼──────┐ │ Nginx │ │ Reverse │ │ Proxy │ └──────┬──────┘ │ ┌──────▼──────┐ │ Spring Boot │ │ REST API │ │ Java 21 │ └──────┬──────┘ │ ┌──────▼──────┐ │ PostgreSQL │ │ Database │ └─────────────┘

Code

## 🛠️ Technologies utilisées

### Backend

- **Java 17** - Langage de programmation (obligatoire pour le build, Lombok/MapStruct)
- **Spring Boot 3.2** - Framework backend
- **Spring Security** - Authentification & autorisation
- **Spring Data JPA** - Accès aux données
- **PostgreSQL 16** - Base de données
- **JWT** - Tokens d'authentification
- **Maven** - Gestion des dépendances

### Frontend

- **Angular 17** - Framework frontend
- **TypeScript** - Langage typé
- **Bootstrap 5** - Framework CSS
- **ng-bootstrap** - Composants Angular
- **RxJS** - Programmation réactive

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy

## 📁 Structure du projet

medicalsplants/ ├── backend/ # API Spring Boot │ ├── src/main/java/ # Code source Java │ └── src/test/ # Tests unitaires ├── frontend-app/ # Application Angular (utilisateurs) ├── frontend-admin/ # Application Angular (admin) ├── database/ # Scripts SQL ├── docker/ # Configuration Docker ├── docs/ # Documentation └── e2e/ # Tests end-to-end

Code

## 🚀 Installation

### Prérequis

- Java 17 (requis pour le build; utilisez `scripts/check-java.sh` pour vérifier localement)
- Node.js 20+
- Docker & Docker Compose
- Maven 3.9+

### Démarrage rapide

```bash
# Cloner le projet
git clone https://github.com/KUISSI/medicalsplants.git
cd medicalsplants

# Copier la configuration
cp . env.example .env


# Démarrer les services en développement (PostgreSQL, MailHog, etc.)
docker-compose -f docker-compose.dev.yml up -d

# Démarrer les services en production (base de données, backend, etc.)
docker-compose -f docker-compose.prod.yml up -d




# Lancer le backend Spring Boot en développement (avec secret JWT automatique)
#
# Sous Linux/Mac :
cd backend
./start-backend.sh

# Sous Windows :
cd backend
REM Copiez le modèle si besoin :
copy start-backend.example.bat start-backend.bat
REM Modifiez start-backend.bat pour y mettre votre secret local
start-backend.bat
#
# ⚠️ Ne versionnez jamais backend/start-backend.bat (il est ignoré par git).
# Utilisez le modèle start-backend.example.bat pour partager la structure du script sans secret.
# En production, configurez JWT_SECRET via un .env ou la configuration de votre hébergeur/CI/CD.

# Lancer le frontend (dans un autre terminal)
cd frontend-app && npm install && npm start
URLs de développement
Service	URL
Frontend App	http://localhost:4200
Backend API	http://localhost:8080
Swagger UI	http://localhost:8080/swagger-ui.html
Adminer	http://localhost:8081
MailHog	http://localhost:8025
📚 Documentation
Documentation API
[Guide d'installation](docs/installation. md)
Architecture technique
Guide de contribution
🧪 Tests
bash
# Tests backend
cd backend && ./mvn test

# Tests frontend
cd frontend-app && npm test

# Tests E2E
cd e2e/cypress && npm run cy:run
👤 Auteur
KUISSI - Projet de fin d'études

📄 License
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

⚠️ Avertissement médical : Les informations fournies dans cette application sont à titre informatif uniquement et ne remplacent pas l'avis d'un professionnel de santé.

# Utilisation des scripts d'environnement et de lancement backend

1. Pour choisir l'environnement (dev ou prod) :
   - Ouvre un terminal à la racine du projet.
   - Lance la commande suivante :
     
     switch-env.bat dev   (pour activer le développement)
     switch-env.bat prod  (pour activer la production)

   Cela copie le bon fichier (.env.dev ou .env.prod) dans .env, qui sera utilisé par le backend.

2. Pour lancer le backend :
   - Place-toi dans le dossier backend (ou utilise le script start-backend.ps1 qui le fait automatiquement).
   - Lance le script :
     
     backend\start-backend.ps1
   
   ou, manuellement :
     
     cd backend
     mvn spring-boot:run

Le backend utilisera alors la configuration de l'environnement actif (défini par le .env courant).

Astuce :
- Tu peux changer d'environnement à tout moment en relançant switch-env.bat, puis en redémarrant le backend.

## 🔧 Scripts utilitaires & CI checks

- Scripts centralisés (DRY) : `scripts/common-env.sh` et `scripts/common-env.ps1` (chargent `.env` et vérifient/forcent Java 17 si possible).
- Smoke tests : `scripts/smoke-test.sh` (bash) et `scripts/smoke-test.ps1` (PowerShell) démarrent le jar et testent `/actuator/health`.
- Pre-commit : `scripts/pre-commit` vérifie localement Java 17 et exécute `mvn test-compile`. Installez-le avec `scripts/install-git-hooks.sh`.
- Makefile (racine) : commandes rapides — `make backend-build`, `make smoke-test`, `make install-hooks`, `make check-java`.

CI : le workflow GitHub Actions exécute un check Java, package backend, smoke tests, puis les tests d'intégration (Testcontainers) avant de builder et pousser l'image backend.

---
