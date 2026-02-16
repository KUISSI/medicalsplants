# 🌿 Medicals Plants

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/KUISSI/medicalsplants)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-blue)](https://openjdk.org/)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io/)

## 📋 Description

**Medicals Plants** est une application web permettant de découvrir les plantes médicinales et leurs propriétés thérapeutiques. Les utilisateurs peuvent rechercher des symptômes, trouver les plantes adaptées, consulter des recettes et partager leurs avis.

### 🎯 Fonctionnalités principales

- 🔍 Recherche de symptômes par catégorie
- 🌿 Catalogue de plantes médicinales
- 📖 Recettes à base de plantes
- ⭐ Système d'avis et de réactions
- 👑 Contenu Premium exclusif
- 🔐 Authentification sécurisée (JWT)

## 🏗️ Architecture


┌─────────────────┐ ┌─────────────────┐
│ Frontend App │ │Frontend Backoff │
│ (Angular 19) │ │ (Angular 19) │
│ Bootstrap 5 │ │ Bootstrap 5 │
└────────┬────────┘ └────────┬────────┘
│ │
└───────────┬───────────┘
│
┌──────▼──────┐
│ Nginx │
│ Reverse │
│ Proxy │
└──────┬──────┘
│
┌──────▼──────┐
│ Spring Boot │
│ REST API │
│ Java 21 │
└──────┬──────┘
│
┌──────▼──────┐
│ PostgreSQL │
│ Database │
└─────────────┘


## 🛠️ Technologies utilisées

### Backend

- **Java 21** - Langage de programmation
- **Spring Boot 3.2** - Framework backend
- **Spring Security** - Authentification & autorisation
- **Spring Data JPA** - Accès aux données
- **PostgreSQL 16** - Base de données
- **JWT** - Tokens d'authentification
- **Maven** - Gestion des dépendances

### Frontend

- **Angular 19** - Framework frontend
- **TypeScript** - Langage typé
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programmation réactive

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy

## 📁 Structure du projet


medicalsplants/
├── backend/ # API Spring Boot
│ ├── src/main/java/ # Code source Java
│ └── src/test/ # Tests unitaires
├── frontend-app/ # Application Angular (utilisateurs)
├── frontend-backoffice/ # Application Angular (admin)
├── database/ # Scripts SQL
├── docs/ # Documentation
└── scripts/ # Scripts utilitaires


## 🚀 Installation

### Prérequis

- Java 21 (JDK)
- Node.js 20+
- Docker & Docker Compose
- Maven 3.9+
- PostgreSQL 16 (ou via Docker)

### Démarrage rapide

```bash
# Cloner le projet
git clone https://github.com/KUISSI/medicalsplants.git
cd medicalsplants

# Copier la configuration
cp .env.example .env

💻 Commandes principales
Backend (API Spring Boot)
# Compiler le backend
cd backend && mvn package -DskipTests

# Démarrer le backend
cd backend && mvn spring-boot:run

# Lancer les tests
cd backend && mvn test

Frontend App (utilisateurs)
# Installer les dépendances
cd frontend-app && npm install

# Démarrer en développement
cd frontend-app && npm start

Frontend Backoffice (admin)
# Installer les dépendances
cd frontend-backoffice && npm install

# Démarrer en développement
cd frontend-backoffice && npm start

# Installer les dépendances
cd frontend-backoffice && npm install

Docker (environnement complet)
# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up -d

# Démarrer en mode production
docker-compose -f docker-compose.prod.yml up -d

# Arrêter les services
docker-compose down

🌐 URLs de développement
Service	URL
Frontend App	http://localhost:4200
Frontend Backoffice	http://localhost:4201
Backend API	http://localhost:8080
Swagger UI	http://localhost:8080/swagger-ui.html
MailHog	http://localhost:8025

🧪 Tests
# Tests backend
cd backend && mvn test

# Tests frontend
cd frontend-app && npm test

🔧 Configuration des environnements
# Activer l'environnement de développement (Windows)
.\switch-env.ps1 dev

# Activer l'environnement de production (Windows)
.\switch-env.ps1 prod

# Linux/Mac
./switch-env.sh dev
./switch-env.sh prod

👤 Auteur
KUISSI - Projet de certification

📄 License
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

⚠️ Avertissement médical : Les informations fournies dans cette application sont à titre informatif uniquement et ne remplacent pas l'avis d'un professionnel de santé.

