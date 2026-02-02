# ============================================================
# MEDICALS PLANTS - Import CSV to PostgreSQL
# Version: 2.0.0
# ============================================================

param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbName = "medicalsplants_dev",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "postgres"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DataDir = Join-Path (Split-Path -Parent $ScriptDir) "data_import"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MEDICALS PLANTS - CSV Import v2.0" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: $DbHost`:$DbPort/$DbName" -ForegroundColor Yellow

# Function to run SQL via Docker psql
function Invoke-Psql {
    param([string]$Sql)
    $result = docker run --rm -e PGPASSWORD=$DbPassword postgres:16-alpine psql -h host.docker.internal -p $DbPort -U $DbUser -d $DbName -c $Sql 2>&1
    return $result
}

# Function to import CSV
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
    
    # Read CSV with semicolon delimiter and UTF-8
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
            
            # Apply column mapping
            if ($ColumnMapping.ContainsKey($colName)) {
                $colName = $ColumnMapping[$colName]
            }
            
            # Skip empty values
            if ([string]::IsNullOrWhiteSpace($colValue)) { continue }
            
            # Skip timestamp columns (let DB handle)
            if ($colName -in @("created_at", "updated_at")) { continue }
            
            $columns += $colName
            $escapedValue = $colValue -replace "'", "''"
            $values += "'$escapedValue'"
        }
        
        if ($columns.Count -eq 0) { continue }
        
        $columnList = $columns -join ", "
        $valueList = $values -join ", "
        
        $sql = "INSERT INTO $TableName ($columnList) VALUES ($valueList) ON CONFLICT DO NOTHING;"
        
        try {
            $result = Invoke-Psql -Sql $sql
            if ($result -match "INSERT") { $importedCount++ }
        } catch {
            $errorCount++
        }
    }
    
    Write-Host "  Imported: $importedCount, Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Yellow" } else { "Green" })
}

# Function to import junction table by title
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
    
    foreach ($row in $data) {
        $title1 = ($row.PSObject.Properties | Select-Object -First 1).Value -replace "'", "''"
        $title2 = ($row.PSObject.Properties | Select-Object -Skip 1 -First 1).Value -replace "'", "''"
        
        $sql = "INSERT INTO $JunctionTable ($Col1, $Col2) SELECT t1.id, t2.id FROM $Table1 t1, $Table2 t2 WHERE t1.title = '$title1' AND t2.title = '$title2' ON CONFLICT DO NOTHING;"
        
        try {
            $result = Invoke-Psql -Sql $sql
            if ($result -match "INSERT") { $importedCount++ }
        } catch {}
    }
    
    Write-Host "  Imported: $importedCount" -ForegroundColor Green
}

# ============================================
# Main Import Process
# ============================================

Write-Host "`nStarting import..." -ForegroundColor Cyan

# 1. Symptoms
Import-CsvToTable -CsvFile "mp_symptom.csv" -TableName "mp_symptom"

# 2. Properties
Import-CsvToTable -CsvFile "mp_property.csv" -TableName "mp_property"

# 3. Plants
Import-CsvToTable -CsvFile "mp_plant.csv" -TableName "mp_plant"

# 4. Property-Symptom junction
Import-JunctionByTitle -CsvFile "mp_property_symptom_title.csv" -JunctionTable "mp_property_symptom" `
    -Table1 "mp_property" -Col1 "property_id" -Table2 "mp_symptom" -Col2 "symptom_id"

# 5. Plant-Property junction
Import-JunctionByTitle -CsvFile "mp_plant_property_title.csv" -JunctionTable "mp_plant_property" `
    -Table1 "mp_plant" -Col1 "plant_id" -Table2 "mp_property" -Col2 "property_id"

# 6. Recipes (requires author_id - use first admin user)
Write-Host ""
Write-Host "Importing mp_recipe.csv -> mp_recipe..." -ForegroundColor Green
$recipeCsvPath = Join-Path $DataDir "mp_recipe.csv"
if (Test-Path $recipeCsvPath) {
    $recipeData = Import-Csv -Path $recipeCsvPath -Delimiter ";" -Encoding UTF8
    $importedCount = 0
    
    foreach ($row in $recipeData) {
        $title = $row.title -replace "'", "''"
        $description = $row.description -replace "'", "''"
        $type = $row.type
        $difficulty = if ($row.difficulty) { $row.difficulty } else { "Medium" }
        $isPremium = if ($row.is_premium -eq "true") { "true" } else { "false" }
        $status = if ($row.status) { $row.status } else { "PUBLISHED" }
        $authorId = $row.author_id
        
        # Parse preparation time (e.g., "30 minutes" -> 30)
        $prepTime = "NULL"
        if ($row.preparation_time_minutes -match "(\d+)") {
            $prepTime = $Matches[1]
        }
        
        # Convert ingredients and instructions to JSONB
        $ingredients = "NULL"
        if ($row.ingredients) {
            $ingredientList = ($row.ingredients -replace "'", "''") -split ", " | ForEach-Object { "`"$_`"" }
            $ingredients = "'[" + ($ingredientList -join ", ") + "]'"
        }
        
        $instructions = "NULL"
        if ($row.instructions) {
            $instructionText = $row.instructions -replace "'", "''" -replace "`n", " " -replace "`r", ""
            $instructions = "'`"$instructionText`"'"
        }
        
        $sql = @"
INSERT INTO mp_recipe (title, type, description, preparation_time_minutes, difficulty, ingredients, instructions, is_premium, status, author_id)
VALUES ('$title', '$type', '$description', $prepTime, '$difficulty', $ingredients, $instructions, $isPremium, '$status', '$authorId')
ON CONFLICT DO NOTHING;
"@
        
        try {
            $result = Invoke-Psql -Sql $sql
            if ($result -match "INSERT") { $importedCount++ }
        } catch {}
    }
    Write-Host "  Imported: $importedCount" -ForegroundColor Green
}

# 7. Recipe-Plant junction
Import-JunctionByTitle -CsvFile "mp_recipe_plant_title.csv" -JunctionTable "mp_recipe_plant" `
    -Table1 "mp_recipe" -Col1 "recipe_id" -Table2 "mp_plant" -Col2 "plant_id"

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Import completed!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# Show counts
Write-Host "`nTable counts:" -ForegroundColor Yellow
$countSql = "SELECT 'mp_symptom' as t, count(*) as c FROM mp_symptom UNION ALL SELECT 'mp_property', count(*) FROM mp_property UNION ALL SELECT 'mp_plant', count(*) FROM mp_plant UNION ALL SELECT 'mp_recipe', count(*) FROM mp_recipe UNION ALL SELECT 'mp_property_symptom', count(*) FROM mp_property_symptom UNION ALL SELECT 'mp_plant_property', count(*) FROM mp_plant_property UNION ALL SELECT 'mp_recipe_plant', count(*) FROM mp_recipe_plant ORDER BY t;"
Invoke-Psql -Sql $countSql
