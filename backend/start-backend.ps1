
# Lancer le backend Spring Boot (Windows, PowerShell)
# Charge automatiquement toutes les variables du .env
# puis lance le backend avec Maven

# Aller dans le dossier du script (backend)
Set-Location -Path $PSScriptRoot

# Chemin du .env (racine backend ou src/main/resources)
$envFile = Join-Path $PSScriptRoot ".env"
if (!(Test-Path $envFile)) {
	$envFile = Join-Path $PSScriptRoot "src/main/resources/.env"
}

if (Test-Path $envFile) {
	Write-Host "Chargement des variables du .env : $envFile" -ForegroundColor Cyan
	Get-Content $envFile | ForEach-Object {
		if ($_ -match '^(\s*#|\s*$)') { return } # Ignore commentaires/lignes vides
		if ($_ -match '^(.*?)=(.*)$') {
			$key = $matches[1].Trim()
			$val = $matches[2].Trim()
			$val = $val -replace '"','' # retire les guillemets éventuels
			[System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
			${env:$key} = $val
		}
	}
} else {
	Write-Host ".env introuvable, seules les variables système seront utilisées." -ForegroundColor Yellow
}

mvn spring-boot:run

