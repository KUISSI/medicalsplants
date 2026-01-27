
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "prod")]
    [string]$envName
)

# Libérer le port 8080 si occupé (ignore l'erreur si rien n'écoute)
$tcp = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($tcp) {
    $processId = $tcp.OwningProcess
    Write-Host "Arrêt du processus sur le port 8080 (PID $processId)" -ForegroundColor Yellow
    Stop-Process -Id $processId -Force
}
else {
    Write-Host "Aucun processus n'utilise le port 8080" -ForegroundColor Green
}

$projectRoot = $PSScriptRoot
$target = Join-Path $projectRoot ".env"
$source = Join-Path $projectRoot ".env.$envName"

if (!(Test-Path $source)) {
    Write-Host ".env.$envName introuvable !" -ForegroundColor Red
    exit 1
}

# Ne copie pas si source et target sont identiques
if ((Get-Item $source).FullName -eq (Get-Item $target).FullName) {
    Write-Host "L'environnement $envName est déjà actif (.env ← .env.$envName)" -ForegroundColor Yellow
}
else {
    Copy-Item $source $target -Force
    Write-Host "Environnement actif : $envName (.env ← .env.$envName)" -ForegroundColor Green
}

# Aller à la racine du projet
Set-Location $projectRoot

# Aller dans le dossier backend et démarrer le backend
Set-Location backend
./start-backend.ps1
