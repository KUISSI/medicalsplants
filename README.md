# 🌿 Medicals Plants

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/KUISSI/medicalsplants)
[![License:  MIT](https://img.shields.io/badge/License-MIT-yellow. svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/)
[![Angular](https://img.shields.io/badge/Angular-17-red)](https://angular.io/)

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

┌─────────────────┐ ┌─────────────────┐ │ Frontend App │ │ Frontend Admin │ │ (Angular 17) │ │ (Angular 17) │ │ Bootstrap 5 │ │ Bootstrap 5 │ └────────┬────────┘ └────────┬────────┘ │ │ └───────────┬───────────┘ │ ┌──────▼──────┐ │ Nginx │ │ Reverse │ │ Proxy │ └──────┬──────┘ │ ┌──────▼──────┐ │ Spring Boot │ │ REST API │ │ Java 21 │ └──────┬──────┘ │ ┌──────▼──────┐ │ PostgreSQL │ │ Database │ └─────────────┘

Code

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

- Java 21+
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

# Démarrer les services (PostgreSQL, MailHog)
docker-compose -f docker-compose.yml up -d

# Lancer le backend
cd backend && ./mvn spring-boot:run

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
cd backend && ./mvnw test

# Tests frontend
cd frontend-app && npm test

# Tests E2E
cd e2e/cypress && npm run cy:run
👤 Auteur
KUISSI - Projet de fin d'études

📄 License
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

⚠️ Avertissement médical : Les informations fournies dans cette application sont à titre informatif uniquement et ne remplacent pas l'avis d'un professionnel de santé.
```
