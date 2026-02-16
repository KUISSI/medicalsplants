#!/bin/bash
# Script de vérification de la structure du projet

echo "��� Vérification de la structure du projet..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗ MANQUANT:  $1${NC}"
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗ MANQUANT: $1/${NC}"
    fi
}

echo "=== Fichiers racine ==="
check_file "README.md"
check_file ". gitignore"
check_file ". env.example"
check_file "docker-compose.dev. yml"
check_file "Makefile"
check_file "backend/pom.xml"
check_file "backend/src/main/resources/application. yml"

echo ""
echo "=== Dossiers principaux ==="
check_dir "backend/src/main/java/com/medicalsplants"
check_dir "backend/src/test/java/com/medicalsplants"
check_dir "backend/src/test/resources"
check_dir "database/migrations"
check_dir "docs"

echo ""
echo "=== Config ==="
check_file "backend/src/main/java/com/medicalsplants/config/SecurityConfig.java"
check_file "backend/src/main/java/com/medicalsplants/config/JwtProperties.java"
check_file "backend/src/main/java/com/medicalsplants/config/CorsConfig.java"

echo ""
echo "=== Entities ==="
check_file "backend/src/main/java/com/medicalsplants/model/entity/User.java"
check_file "backend/src/main/java/com/medicalsplants/model/entity/Symptom.java"
check_file "backend/src/main/java/com/medicalsplants/model/entity/Plant. java"
check_file "backend/src/main/java/com/medicalsplants/model/entity/recipe.java"
check_file "backend/src/main/java/com/medicalsplants/model/entity/Review.java"

echo ""
echo "=== Security ==="
check_file "backend/src/main/java/com/medicalsplants/security/JwtTokenProvider.java"
check_file "backend/src/main/java/com/medicalsplants/security/CustomUserDetails.java"
check_file "backend/src/main/java/com/medicalsplants/security/JwtAuthenticationFilter.java"

echo ""
echo "=== Auth ==="
check_file "backend/src/main/java/com/medicalsplants/service/AuthService.java"
check_file "backend/src/main/java/com/medicalsplants/controller/AuthController.java"

echo ""
echo "=== Application ==="
check_file "backend/src/main/java/com/medicalsplants/MedicalsPlantsApplication.java"

echo ""
echo "✅ Vérification terminée!"
