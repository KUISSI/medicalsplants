
# Libérer le port 8080 si occupé (ignore l'erreur si rien n'écoute)
$tcp = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($tcp) {
    $pid = $tcp.OwningProcess
    Write-Host "Arrêt du processus sur le port 8080 (PID $pid)" -ForegroundColor Yellow
    Stop-Process -Id $pid -Force
}
else {
    Write-Host "Aucun processus n'utilise le port 8080" -ForegroundColor Green
}

# Gestion de l'environnement
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "prod")]
    [string]$envName
)

$projectRoot = $PSScriptRoot
$target = Join-Path $projectRoot ".env"
$source = Join-Path $projectRoot ".env.$envName"

if (!(Test-Path $source)) {
    Write-Host ".env.$envName introuvable !" -ForegroundColor Red
    exit 1
}

Copy-Item $source $target -Force
Write-Host "Environnement actif : $envName (.env ← .env.$envName)" -ForegroundColor Green

# Aller à la racine du projet
Set-Location $projectRoot

# Aller dans le dossier backend et démarrer le backend
Set-Location backend
./start-backend.ps1
