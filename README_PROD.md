Résumé - workflow prod & dev

Choix : pro & DRY (hybride, accessible pour expliquer)

- Prod : build front (Angular) en images via `Dockerfile.prod` (multi-stage) -> servir via nginx.
- Backend : build Maven -> image Docker via `backend/Dockerfile` -> run.
- DB : Postgres (conteneur ou service managé selon déploiement).
- Dev : approche hybride recommandée : DB + backend + outils via `docker-compose.dev.yml`. Frontends lancés localement via `ng serve` pour hot-reload.

Commandes utiles

# Build & image pour frontend-app
cd frontend-app
npm ci
npm run build -- --configuration production
docker build -t medicalsplants-frontend-app:latest -f Dockerfile.prod .

# Build & image pour frontend-backoffice
cd ../frontend-backoffice
npm ci
npm run build -- --configuration production
docker build -t medicalsplants-frontend-backoffice:latest -f Dockerfile.prod .

# Backend build & image
cd ../backend
mvn -DskipTests package
docker build -t medicalsplants-backend:latest .

# Démarrer la stack de production (local test)
docker compose -f .\docker-compose.prod.yml up -d --build

# Démarrer la stack de développement hybride (db + backend + outils)
docker compose -f .\docker-compose.dev.yml up -d --build db backend adminer mailhog
# Puis exécuter les frontends localement via ng serve
cd .\frontend-app
npm ci
npm run start

Notes
- Ne jamais exposer Adminer / MailHog en production.
- Gérer les secrets (JWT_SECRET) via variables d'environnement en prod.
