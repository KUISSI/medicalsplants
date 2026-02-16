#!/bin/bash
# Génère le fichier d'environnement Angular à partir du .env global
# Usage : ./generate-angular-env.sh frontend-app|frontend-backoffice

if [ $# -ne 1 ]; then
  echo "Usage : $0 frontend-app|frontend-backoffice"
  exit 1
fi

APP_DIR="$1"
ENV_FILE=".env"
ANGULAR_ENV_FILE="$APP_DIR/src/environments/environment.ts"

if [ ! -f "$ENV_FILE" ]; then
  echo ".env introuvable à la racine du projet !"
  exit 1
fi

# Extraction des variables utiles pour Angular
echo "export const environment = {" > "$ANGULAR_ENV_FILE"
echo "  production: false," >> "$ANGULAR_ENV_FILE"
grep -E 'APP_NAME|APP_URL' "$ENV_FILE" | while IFS='=' read -r key value; do
  jskey=$(echo "$key" | tr '[:upper:]' '[:lower:]')
  echo "  $jskey: '$value'," >> "$ANGULAR_ENV_FILE"
done
grep -E 'API_URL|apiUrl' "$ENV_FILE" | while IFS='=' read -r key value; do
  echo "  apiUrl: '$value'," >> "$ANGULAR_ENV_FILE"
done
echo "};" >> "$ANGULAR_ENV_FILE"
echo "Fichier $ANGULAR_ENV_FILE généré à partir de $ENV_FILE."
