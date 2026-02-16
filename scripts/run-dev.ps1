<#
Simple dev launcher (Windows PowerShell)
Usage: Open PowerShell at repo root and run:
  ./scripts/run-dev.ps1
What it does (simple and safe):
- Copies .env.dev -> .env if .env missing
- Tries to use JDK 17 if installed (common paths)
- Builds backend (packages jar) and runs the jar
- Streams logs to console
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Write-Host "Project root: $projRoot" -ForegroundColor Cyan

# Ensure .env exists
$envRoot = Join-Path $projRoot '.env'
$envDev = Join-Path $projRoot '.env.dev'
if (!(Test-Path $envRoot) -and (Test-Path $envDev)) {
    Copy-Item $envDev $envRoot -Force
    Write-Host "Copied .env.dev -> .env" -ForegroundColor Green
}
elseif (Test-Path $envRoot) {
    Write-Host ".env already present" -ForegroundColor Green
}
else {
    Write-Host "No .env or .env.dev found — continuing without .env" -ForegroundColor Yellow
}

# Find JDK 17
$jdkCandidates = @(
    'C:\\Program Files\\Java\\jdk-17',
    'C:\\Program Files (x86)\\Java\\jdk-17',
    "$env:ProgramFiles\\Java\\jdk-17"
)
$found = $null
foreach ($c in $jdkCandidates) {
    if (Test-Path $c) { $found = $c; break }
}
if ($found) {
    Write-Host "Using JDK17 at $found" -ForegroundColor Cyan
    $env:JAVA_HOME = $found
    $env:Path = "$($env:JAVA_HOME)\bin;$env:Path"
}
else {
    # Use plain ASCII hyphen and normal double quotes to avoid encoding issues
    Write-Host "JDK17 not found on standard paths - will try system java (may fail enforcer)" -ForegroundColor Yellow
}

# Ensure mvn is available (install locally if missing)
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $installer = Join-Path $PSScriptRoot 'install-maven.ps1'
    if (Test-Path $installer) {
        Write-Host "Maven introuvable — installation locale en cours..." -ForegroundColor Cyan
        try { . $installer } catch { Write-Host "Échec de l'installation locale de Maven : $_" -ForegroundColor Red; throw }
    }
    else {
        Write-Host "Maven introuvable et install-maven.ps1 absent. Installez Maven globalement ou utilisez un package manager (choco/scoop)." -ForegroundColor Red
        throw "Maven not found"
    }
}

# Build backend jar (skip tests for speed). If enforcer blocks, retry skipping it to produce jar.
Push-Location (Join-Path $projRoot 'backend')
try {
    Write-Host "Running mvn -DskipTests package" -ForegroundColor Cyan
    & mvn -B -DskipTests package
}
catch {
    Write-Host "Build failed (trying to bypass enforcer to produce jar)..." -ForegroundColor Yellow
    & mvn -B '-Denforcer.skip=true' -DskipTests package
}

# Find jar
$jar = Get-ChildItem -Path 'target' -Filter '*-SNAPSHOT.jar' | Where-Object { $_.Name -notlike '*.original' } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $jar) {
    Write-Error "Jar not found in backend/target. Build failed."
    Pop-Location; exit 1
}
Write-Host "Starting jar: $($jar.Name)" -ForegroundColor Green

# Run jar
$javaExe = if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { Join-Path $env:JAVA_HOME 'bin\java.exe' } else { 'java' }
$logPath = Join-Path $env:TEMP 'medicalsplants.log'
# Ensure log file exists
if (Test-Path $logPath) { Remove-Item $logPath -Force }

$proc = Start-Process -FilePath $javaExe -ArgumentList ('-jar', $jar.FullName) -NoNewWindow -PassThru -RedirectStandardOutput $logPath -RedirectStandardError $logPath
Write-Host "PID: $($proc.Id) - streaming logs (Ctrl+C to stop)" -ForegroundColor Cyan

# Tail logs
try {
    while (-not $proc.HasExited) {
        Get-Content -Path $logPath -Tail 200 -Wait
        Start-Sleep -Seconds 1
    }
    Write-Host "Process exited with code $($proc.ExitCode)" -ForegroundColor Yellow
    Get-Content -Path $logPath -Tail 200
}
finally {
    if ($proc -and -not $proc.HasExited) { $proc.Kill() | Out-Null }
    Pop-Location
}
