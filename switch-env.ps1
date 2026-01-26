# Switch d'environnement pour le backend (Windows, PowerShell)
# Usage : ./switch-env.ps1 dev|prod

param(
    [Parameter(Mandatory=$true)]
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
