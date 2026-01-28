#!/bin/bash
# Switch d'environnement pour le backend (Linux/Mac, bash)
# Usage : ./switch-env.sh dev|prod

if [ $# -ne 1 ]; then
  echo "Usage : $0 dev|prod"
  exit 1
fi

ENV_NAME="$1"
PROJECT_ROOT="$(dirname "$0")"
TARGET="$PROJECT_ROOT/.env"
SOURCE="$PROJECT_ROOT/.env.$ENV_NAME"

if [ ! -f "$SOURCE" ]; then
  echo ".env.$ENV_NAME introuvable !"
  exit 1
fi

cp "$SOURCE" "$TARGET"
echo "Environnement actif : $ENV_NAME (.env ← .env.$ENV_NAME)"
