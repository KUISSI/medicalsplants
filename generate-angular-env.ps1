param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("frontend-app", "frontend-backoffice")]
    [string]$appDir
)

$envFile = Join-Path $PSScriptRoot ".env"
$angularEnvFile = Join-Path $PSScriptRoot "$appDir\src\environments\environment.ts"

if (!(Test-Path $envFile)) {
    Write-Host ".env introuvable à la racine du projet !" -ForegroundColor Red
    exit 1
}

# Lecture des variables utiles
$appName = $null
$appUrl = $null
$apiUrl = $null

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^APP_NAME=(.*)') { $appName = $Matches[1] }
    if ($_ -match '^APP_URL=(.*)') { $appUrl = $Matches[1] }
    if ($_ -match '^(API_URL|apiUrl)=(.*)') { $apiUrl = $Matches[2] }
}

$content = @()
$content += 'export const environment = {'
$content += '  production: false,'
if ($appName) { $content += "  appName: '$appName'," }
if ($appUrl) { $content += "  appUrl: '$appUrl'," }
if ($apiUrl) { $content += "  apiUrl: '$apiUrl'," }
$content += '};'

Set-Content -Path $angularEnvFile -Value $content -Encoding UTF8
Write-Host "Fichier $angularEnvFile généré à partir de $envFile." -ForegroundColor Green
