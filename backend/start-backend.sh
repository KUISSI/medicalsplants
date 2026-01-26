
#!/bin/bash
# Lancer le backend Spring Boot (Linux/Mac, bash)
# Charge automatiquement toutes les variables du .env puis lance le backend

# Aller dans le dossier du script (backend)
cd "$(dirname "$0")"

# Chemin du .env (racine backend ou src/main/resources)
if [ -f .env ]; then
	ENV_FILE=".env"
elif [ -f src/main/resources/.env ]; then
	ENV_FILE="src/main/resources/.env"
else
	ENV_FILE=""
fi

if [ -n "$ENV_FILE" ]; then
	echo "Chargement des variables du $ENV_FILE"
	# Exporter chaque variable du .env
	set -a
	# Ignore les lignes vides et les commentaires
	grep -v -e '^#' -e '^$' "$ENV_FILE" | while IFS= read -r line; do
		export "$line"
	done
	set +a
else
	echo ".env introuvable, seules les variables système seront utilisées."
fi

mvn spring-boot:run
