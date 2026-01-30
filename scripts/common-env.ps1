<#
Common helpers for project scripting (PowerShell)
Provides:
 - Load-DotEnv [-Scope 'root'|'backend'] : loads .env into process environment
 - Ensure-Java17 : tries to ensure JAVA_HOME points to a JDK 17 for the process
 - Get-ProjectRoot : returns project root path
#>

function Get-ProjectRoot {
    return (Resolve-Path (Join-Path $PSScriptRoot ".."))
}

function Load-DotEnv {
    param(
        [ValidateSet('root','backend')]
        [string]$Scope = 'root'
    )
    $proj = Get-ProjectRoot
    $candidates = @()
    if ($Scope -eq 'backend') {
        $candidates += Join-Path $proj 'backend\.env'
        $candidates += Join-Path $proj 'backend\src\main\resources\.env'
    } else {
        $candidates += Join-Path $proj '.env'
        $candidates += Join-Path $proj '.env.dev'
        $candidates += Join-Path $proj '.env.prod'
    }

    foreach ($f in $candidates) {
        if (Test-Path $f) {
            Write-Host "Chargement des variables depuis: $f" -ForegroundColor Cyan
            Get-Content $f | ForEach-Object {
                if ($_ -match '^(\s*#|\s*$)') { return }
                if ($_ -match '^(.*?)=(.*)$') {
                    $k = $matches[1].Trim()
                    $v = $matches[2].Trim()
                    $v = $v -replace '"',''
                    [System.Environment]::SetEnvironmentVariable($k, $v, 'Process')
                }
            }
            return $true
        }
    }
    return $false
}

function Test-JavaMajor {
    try {
        $out = & java -version 2>&1
        $major = ($out -join "`n") -replace '.*version "([0-9]+)\..*', '$1'
        if ($major -match '^\d+$') { return [int]$major }
    } catch { }
    return $null
}

function Ensure-Java17 {
    # If Java is already 17, do nothing. Otherwise, try to find JDK 17 and set JAVA_HOME for this process.
    $major = Test-JavaMajor
    if ($major -eq 17) {
        Write-Host "Java 17 détecté." -ForegroundColor Green
        return $true
    }

    # If JAVA_HOME already points to a 17 JDK, accept it
    if ($env:JAVA_HOME) {
        $candidate = $env:JAVA_HOME
        if (Test-Path (Join-Path $candidate 'bin\java.exe')) {
            try {
                $out = & (Join-Path $candidate 'bin\java.exe') -version 2>&1
                $m = ($out -join "`n") -replace '.*version "([0-9]+)\..*', '$1'
                if ($m -eq '17') { Write-Host "JAVA_HOME déjà défini sur JDK 17 : $candidate" -ForegroundColor Green; return $true }
            } catch { }
        }
    }

    # Search common install locations (Windows)
    $candidates = @(
        'C:\\Program Files\\Java\\jdk-17',
        'C:\\Program Files (x86)\\Java\\jdk-17',
        "$env:ProgramFiles\\Java\\jdk-17",
        "$env:ProgramFiles(x86)\\Java\\jdk-17"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) {
            Write-Host "Configuration temporaire de JAVA_HOME vers $c" -ForegroundColor Cyan
            $env:JAVA_HOME = $c
            $env:Path = "$($env:JAVA_HOME)\bin;$env:Path"
            return $true
        }
    }

    # Not found: notify and leave as-is
    Write-Host "JDK 17 introuvable. Si le build échoue, installez JDK 17 et définissez JAVA_HOME." -ForegroundColor Yellow
    return $false
}

Export-ModuleMember -Function Load-DotEnv, Ensure-Java17, Get-ProjectRoot, Test-JavaMajor
