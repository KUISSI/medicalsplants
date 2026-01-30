# Makefile for common dev tasks
.PHONY: backend-build smoke-test install-hooks start-backend check-java

backend-build:
	cd backend && mvn -B -DskipTests package

smoke-test:
	bash scripts/smoke-test.sh

install-hooks:
	bash scripts/install-git-hooks.sh

start-backend:
	# Use PowerShell on Windows or direct jar on *nix
	bash -c "source scripts/common-env.sh && load_dotenv backend && ensure_java17 && java -jar backend/target/medicalsplants-api-1.0.0-SNAPSHOT.jar"

check-java:
	bash scripts/check-java.sh
