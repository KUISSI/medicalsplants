<#
Installe Maven localement dans .maven/apache-maven-3.9.4 si mvn absent.
Utilisation :
    .\scripts\install-maven.ps1
Retourne le chemin du binaire mvn (process scope) ou lève une erreur.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$mavenRoot = Join-Path $root ".maven"
$mavenVersion = '3.9.4'
$mavenDir = Join-Path $mavenRoot "apache-maven-$mavenVersion"
$mvnExe = Join-Path $mavenDir 'bin\mvn.cmd'

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "Maven already available on PATH" -ForegroundColor Green
    return (Get-Command mvn).Source
}

if (Test-Path $mvnExe) {
    Write-Host "Maven already installed locally: $mvnExe" -ForegroundColor Green
    $env:Path = "$($mavenDir)\bin;$env:Path"
    return $mvnExe
}

# Download Maven binary
$zipUrl = "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$zipTmp = Join-Path $env:TEMP "apache-maven-$mavenVersion-bin.zip"

Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Cyan
if (Test-Path $zipTmp) { Remove-Item $zipTmp -Force }
Invoke-WebRequest -Uri $zipUrl -OutFile $zipTmp -UseBasicParsing

# Create target dir
if (!(Test-Path $mavenRoot)) { New-Item -ItemType Directory -Path $mavenRoot | Out-Null }

Write-Host "Extracting Maven to $mavenRoot" -ForegroundColor Cyan
Expand-Archive -Path $zipTmp -DestinationPath $mavenRoot -Force
Remove-Item $zipTmp -Force

if (!(Test-Path $mvnExe)) { throw "Maven extraction failed: $mvnExe not found" }

# Add to PATH for this process
$env:Path = "$($mavenDir)\bin;$env:Path"
Write-Host "Maven installed at $mavenDir and added to PATH" -ForegroundColor Green

# Print version
& "$mavenDir\bin\mvn.cmd" -v

return "$mavenDir\bin\mvn.cmd"