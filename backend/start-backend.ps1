
# Lancer le backend Spring Boot (Windows, PowerShell)
# Charge automatiquement toutes les variables du .env
# puis lance le backend avec Maven
# ------------------------------------------------------------------
# Améliorations :
# - Si .env introuvable, tente d'appeler ../switch-env.ps1 dev automatiquement.
# - Détecte JDK 17 sur Windows et configure JAVA_HOME pour Maven si nécessaire (utile pour Lombok).
# ------------------------------------------------------------------

Set-Location -Path $PSScriptRoot

# Dot-source the common helper script
$common = Join-Path $PSScriptRoot "..\scripts\common-env.ps1"
if (Test-Path $common) {
	. $common
}
else {
	Write-Host "Attention: scripts\common-env.ps1 introuvable. Le script continuera mais certaines garanties (JAVA 17) ne seront pas appliquées." -ForegroundColor Yellow
}

# Load backend .env (tries backend/.env and src/main/resources/.env)
if (-not (Get-Command Load-DotEnv -ErrorAction SilentlyContinue)) {
	Write-Host "Fonction Load-DotEnv non disponible. Vérifiez que scripts/common-env.ps1 est présent." -ForegroundColor Yellow
}
else {
	if (-not (Load-DotEnv -Scope 'backend')) {
		Write-Host ".env introuvable après tentative Load-DotEnv. Le script va poursuivre en utilisant les variables système." -ForegroundColor Yellow
	}
}

# Ensure Java 17 is available for this process (use local JDK if found)
if (Get-Command Ensure-Java17 -ErrorAction SilentlyContinue) { Ensure-Java17 }

# Ensure mvn is available (install locally if missing)
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
	$installer = Join-Path $PSScriptRoot "..\scripts\install-maven.ps1"
	if (Test-Path $installer) {
		Write-Host "Maven introuvable — installation locale en cours..." -ForegroundColor Cyan
		try { . $installer } catch { Write-Host "Échec de l'installation locale de Maven : $_" -ForegroundColor Red; throw }
	}
 else {
		Write-Host "Maven introuvable et $installer absent. Installez Maven globalement ou utilisez scripts/run-dev.ps1" -ForegroundColor Red
		throw "Maven not found"
	}
}

# Lancer Spring Boot
mvn spring-boot:run

