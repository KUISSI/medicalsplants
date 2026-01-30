# PowerShell smoke test: start jar and poll /actuator/health
Set-StrictMode -Version Latest
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$common = Join-Path $projectRoot 'scripts\common-env.ps1'
if (Test-Path $common) { . $common } else { Write-Host "common-env.ps1 introuvable" -ForegroundColor Yellow }
if (Get-Command Load-DotEnv -ErrorAction SilentlyContinue) { Load-DotEnv -Scope 'backend' }
if (Get-Command Ensure-Java17 -ErrorAction SilentlyContinue) { Ensure-Java17 }

$jar = Join-Path $projectRoot 'backend\target\medicalsplants-api-1.0.0-SNAPSHOT.jar'
if (!(Test-Path $jar)) { Write-Error "Jar introuvable: $jar"; exit 1 }

$javaExe = if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { Join-Path $env:JAVA_HOME 'bin\java.exe' } else { 'java' }

Write-Host "Starting backend jar with $javaExe"
$proc = Start-Process -FilePath $javaExe -ArgumentList "-jar", "$jar" -PassThru -NoNewWindow -RedirectStandardOutput "$env:TEMP\medicalsplants-smoke.log" -RedirectStandardError "$env:TEMP\medicalsplants-smoke.log"

try {
    $url = 'http://localhost:8080/actuator/health'
    $timeout = 60
    for ($i = 0; $i -lt $timeout; $i++) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) {
                Write-Host 'Smoke test: health OK'
                exit 0
            }
        }
        catch { }
        Start-Sleep -Seconds 1
        Write-Host -NoNewline '.'
    }
    Write-Error "Smoke test failed: health endpoint didn't respond within ${timeout}s"
    Get-Content "$env:TEMP\medicalsplants-smoke.log" -Tail 200
    exit 2
}
finally {
    if ($proc -and -not $proc.HasExited) { $proc.Kill() | Out-Null }
}
