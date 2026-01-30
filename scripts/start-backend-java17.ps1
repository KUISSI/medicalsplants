# Start backend jar using JDK 17 and load backend/.env (DRY via scripts/common-env.ps1)
$common = Join-Path $PSScriptRoot 'common-env.ps1'
if (Test-Path $common) { . $common } else {
    # fallback - try loading from project scripts dir
    $common = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')) 'scripts\common-env.ps1'
    if (Test-Path $common) { . $common } else { Write-Host "common-env.ps1 introuvable; le script va quand même tenter de démarrer le jar." -ForegroundColor Yellow }
}

# Load env and ensure Java 17
if (Get-Command Load-DotEnv -ErrorAction SilentlyContinue) { Load-DotEnv -Scope 'backend' }
if (Get-Command Ensure-Java17 -ErrorAction SilentlyContinue) { Ensure-Java17 }

$proj = Get-ProjectRoot
$jar = Join-Path $proj 'backend\target\medicalsplants-api-1.0.0-SNAPSHOT.jar'
if (!(Test-Path $jar)) {
    Write-Host "Jar introuvable : $jar" -ForegroundColor Red
    exit 1
}

# Run with the java from JAVA_HOME if available
if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    & "$env:JAVA_HOME\bin\java" -jar $jar
}
else {
    & java -jar $jar
}
