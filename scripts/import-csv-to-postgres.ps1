# ============================================================
# MEDICALS PLANTS - Import CSV to PostgreSQL (PRO/DRY version)
# Version: 2.5.1 (corrigée dynamique)
# ============================================================

param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbName = "medicalsplants_dev",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "postgres"
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DataDir = Join-Path (Split-Path -Parent $ScriptDir) "data_import"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MEDICALS PLANTS - CSV Import v2.5 (PRO/DRY)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: $DbHost`:$DbPort/$DbName" -ForegroundColor Yellow

# --- Function to run SQL via Docker psql ---
function Invoke-Psql {
    param([string]$Sql)
    try {
        $result = docker run --rm -e PGPASSWORD=$DbPassword postgres:16-alpine psql -h host.docker.internal -p $DbPort -U $DbUser -d $DbName -c $Sql 2>&1
        $result = $result | Where-Object { $_ -notmatch "^NOTICE:" }
        return $result
    } catch {
        if ($_.Exception.Message -match "RemoteException" -and $_.Exception.Message -match "NOTICE:") {
            Write-Host "NOTICE ignoré : $($_.Exception.Message)" -ForegroundColor Yellow
        } else {
            throw
        }
    }
}

# --- Fonction utilitaire pour détecter dynamiquement le champ de titre ---
function Get-TitleColumn {
    param([string]$TableName)
    $colSql = "SELECT column_name FROM information_schema.columns WHERE table_name = '$TableName' AND column_name LIKE '%_title' LIMIT 1;"
    $titleCol = Invoke-Psql -Sql $colSql | Select-String -Pattern "_title" | ForEach-Object { $_.ToString().Trim() }
    if (-not $titleCol) { $titleCol = "title" }
    return $titleCol
}

# --- Clean tables and intermediate files ---
function Clean-DatabaseAndFiles {
    param(
        [string[]]$TablesToTruncate,
        [string[]]$FilesToDelete,
        [string]$DataDir
    )
    Write-Host "`n--- Nettoyage des tables ---" -ForegroundColor Cyan
    foreach ($table in $TablesToTruncate) {
        Invoke-Psql -Sql "TRUNCATE TABLE $table RESTART IDENTITY CASCADE;"
    }
    foreach ($f in $FilesToDelete) {
        $filePath = Join-Path $DataDir $f
        if (Test-Path $filePath) { Remove-Item $filePath }
    }
}

# --- Import CSV into table ---
function Import-CsvToTable {
    param(
        [string]$CsvFile,
        [string]$TableName,
        [hashtable]$ColumnMapping = @{}
    )
    Write-Host ""
    Write-Host "Importing $CsvFile -> $TableName..." -ForegroundColor Green
    $csvPath = Join-Path $DataDir $CsvFile
    if (-not (Test-Path $csvPath)) {
        Write-Host "  File not found: $csvPath" -ForegroundColor Red
        return
    }
    $data = Import-Csv -Path $csvPath -Delimiter ";" -Encoding UTF8
    if ($data.Count -eq 0) {
        Write-Host "  No data to import" -ForegroundColor Yellow
        return
    }
    $importedCount = 0
    $errorCount = 0
    foreach ($row in $data) {
    $columns = @()
    $values = @()
    foreach ($prop in $row.PSObject.Properties) {
        $colName = $prop.Name
        $colValue = $prop.Value
        if ($ColumnMapping.ContainsKey($colName)) {
            $colName = $ColumnMapping[$colName]
        }
        if ([string]::IsNullOrWhiteSpace($colValue)) { continue }
        if ($colName -in @("created_at", "updated_at")) { continue }
        $columns += $colName
        $escapedValue = $colValue -replace "'", "''"
        $values += "'$escapedValue'"
    }
    if ($columns.Count -eq 0) { continue }
    $columnList = $columns -join ", "
    $valueList = $values -join ", "
    $sql = "INSERT INTO $TableName ($columnList) VALUES ($valueList) ON CONFLICT DO NOTHING;"
    Write-Host "SQL: $sql" -ForegroundColor Yellow
    try {
        $result = Invoke-Psql -Sql $sql
        Write-Host "Résultat: $result" -ForegroundColor Gray
        if ($result -match "INSERT") { $importedCount++ }
    } catch {
        Write-Host "Erreur SQL: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Échec sur SQL: $sql" -ForegroundColor Red
        $errorCount++
    }
}    Write-Host "  Imported: $importedCount, Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Yellow" } else { "Green" })
}

# --- Export mapping UUID <-> title (dynamique) ---
function Export-Mapping {
    param(
        [string]$TableName,
        [string]$MappingFile
    )
    Write-Host "Export mapping $TableName -> $MappingFile" -ForegroundColor Cyan
    $titleCol = Get-TitleColumn $TableName
    $sql = "\copy (SELECT id, $titleCol FROM $TableName) TO '/data/$MappingFile' DELIMITER ',' CSV HEADER;"
    docker run --rm -e PGPASSWORD=$DbPassword -v "${DataDir}:/data" postgres:16-alpine psql -h host.docker.internal -p $DbPort -U $DbUser -d $DbName -c $sql
}

# --- Import junction table by title (SQL dynamique) ---
function Import-JunctionByTitle {
    param(
        [string]$CsvFile,
        [string]$JunctionTable,
        [string]$Table1, [string]$Col1,
        [string]$Table2, [string]$Col2
    )
    Write-Host ""
    Write-Host "Importing $CsvFile -> $JunctionTable..." -ForegroundColor Green
    $csvPath = Join-Path $DataDir $CsvFile
    if (-not (Test-Path $csvPath)) {
        Write-Host "  File not found: $csvPath" -ForegroundColor Red
        return
    }
    $data = Import-Csv -Path $csvPath -Delimiter ";" -Encoding UTF8
    $importedCount = 0
    $titleCol1 = Get-TitleColumn $Table1
    $titleCol2 = Get-TitleColumn $Table2
    foreach ($row in $data) {
        $title1 = ($row.PSObject.Properties | Select-Object -First 1).Value -replace "'", "''"
        $title2 = ($row.PSObject.Properties | Select-Object -Skip 1 -First 1).Value -replace "'", "''"
        $sql = "INSERT INTO $JunctionTable ($Col1, $Col2) SELECT t1.id, t2.id FROM $Table1 t1, $Table2 t2 WHERE t1.$titleCol1 = '$title1' AND t2.$titleCol2 = '$title2' ON CONFLICT DO NOTHING;"
        try {
            $result = Invoke-Psql -Sql $sql
            Write-Host "Résultat: $result" -ForegroundColor Gray
            if ($result -match "INSERT") { $importedCount++ }
        } catch {
            Write-Host "Erreur SQL: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Échec sur SQL: $sql" -ForegroundColor Red
        }
    }
    Write-Host "  Imported: $importedCount" -ForegroundColor Green
}

# ============================================
# Main Import Process
# ============================================

# --- Nettoyage DRY ---
$tablesToTruncate = @(
    "mp_recipe_plant", "mp_plant_property", "mp_property_symptom",
    "mp_recipe", "mp_plant", "mp_property", "mp_symptom"
)
$intermediateFiles = @(
    "mapping_mp_plant.csv", "mapping_mp_property.csv", "mapping_mp_symptom.csv", "mapping_mp_recipe.csv"
)
Clean-DatabaseAndFiles -TablesToTruncate $tablesToTruncate -FilesToDelete $intermediateFiles -DataDir $DataDir

Write-Host "`nStarting import..." -ForegroundColor Cyan

# --- Import et export des entités principales (DRY) ---
$mainImports = @(
    @{ Csv="mp_symptom.csv"; Table="mp_symptom" },
    @{ Csv="mp_property.csv"; Table="mp_property" },
    @{ Csv="mp_plant.csv"; Table="mp_plant" },
    @{ Csv="mp_recipe.csv"; Table="mp_recipe" }
)
foreach ($import in $mainImports) {
    Import-CsvToTable -CsvFile $import.Csv -TableName $import.Table
    $mappingFile = "mapping_$($import.Table).csv"
    Export-Mapping -TableName $import.Table -MappingFile $mappingFile
}

# --- Import avancé des recettes (DRY et dynamique) ---
Write-Host ""
Write-Host "Importing mp_recipe.csv -> mp_recipe..." -ForegroundColor Green
$recipeCsvPath = Join-Path $DataDir "mp_recipe.csv"
if (Test-Path $recipeCsvPath) {
    $recipeData = Import-Csv -Path $recipeCsvPath -Delimiter ";" -Encoding UTF8
    $importedCount = 0

    # Récupère dynamiquement toutes les colonnes de la table mp_recipe
    function Get-RecipeColumns {
        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'mp_recipe';"
        $cols = Invoke-Psql -Sql $sql | Select-String -Pattern "^[a-zA-Z0-9_]+$" | ForEach-Object { $_.ToString().Trim() }
        return $cols
    }
    $recipeColumns = Get-RecipeColumns

    foreach ($row in $recipeData) {
        $columns = @()
        $values = @()
        foreach ($col in $recipeColumns) {
            if ($col -in @("created_at", "updated_at")) { continue }
            $val = $row.$col
            if ($null -eq $val -or $val -eq "") { $values += "NULL"; $columns += $col; continue }
            $escaped = $val -replace "'", "''"
            $columns += $col
            $values += "'$escaped'"
        }
        if ($columns.Count -eq 0) { continue }
        $columnList = $columns -join ", "
        $valueList = $values -join ", "
        $sql = "INSERT INTO mp_recipe ($columnList) VALUES ($valueList) ON CONFLICT DO NOTHING;"
        Write-Host "SQL: $sql" -ForegroundColor Yellow
        try {
            $result = Invoke-Psql -Sql $sql
            Write-Host "Résultat: $result" -ForegroundColor Gray
            if ($result -match "INSERT") { $importedCount++ }
        } catch {
            Write-Host "Erreur SQL: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Échec sur SQL: $sql" -ForegroundColor Red
        }
    }
    Write-Host "  Imported: $importedCount" -ForegroundColor Green
    Export-Mapping -TableName "mp_recipe" -MappingFile "mapping_mp_recipe.csv"
}

# --- Import des tables de jonction (DRY) ---
$junctions = @(
    @{ Csv="mp_property_symptom_title.csv"; Table="mp_property_symptom"; T1="mp_property"; C1="property_id"; T2="mp_symptom"; C2="symptom_id" },
    @{ Csv="mp_plant_property_title.csv"; Table="mp_plant_property"; T1="mp_plant"; C1="plant_id"; T2="mp_property"; C2="property_id" },
    @{ Csv="mp_recipe_plant_title.csv"; Table="mp_recipe_plant"; T1="mp_recipe"; C1="recipe_id"; T2="mp_plant"; C2="plant_id" }
)
foreach ($j in $junctions) {
    Import-JunctionByTitle -CsvFile $j.Csv -JunctionTable $j.Table -Table1 $j.T1 -Col1 $j.C1 -Table2 $j.T2 -Col2 $j.C2
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Import completed!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# --- Log final DRY ---
Write-Host "`nTable counts:" -ForegroundColor Yellow
$tables = @("mp_symptom", "mp_property", "mp_plant", "mp_recipe", "mp_property_symptom", "mp_plant_property", "mp_recipe_plant")
$countSql = ($tables | ForEach-Object { "SELECT '$_' as t, count(*) as c FROM $_" }) -join " UNION ALL "
Invoke-Psql -Sql "$countSql ORDER BY t;"