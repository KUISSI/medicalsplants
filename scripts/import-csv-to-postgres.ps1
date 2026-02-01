<#
.SYNOPSIS
    Import CSV files into PostgreSQL database
.DESCRIPTION
    This script imports data from CSV files into PostgreSQL.
    It handles UTF-8 encoding and maintains referential integrity.
.USAGE
    .\import-csv-to-postgres.ps1
    .\import-csv-to-postgres.ps1 -Reset  # Clear existing data first
#>

param(
    [switch]$Reset = $false,
    [string]$DbHost = "localhost",
    [string]$DbPort = "5433",
    [string]$DbName = "medicalsplants_dev",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "postgres"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$DataDir = Join-Path $ProjectRoot "data_import"

# Set PostgreSQL password for psql
$env:PGPASSWORD = $DbPassword

Write-Host "=== CSV to PostgreSQL Import ===" -ForegroundColor Cyan
Write-Host "Database: $DbHost:$DbPort/$DbName"
Write-Host "Data directory: $DataDir"
Write-Host ""

# Check if psql is available
if (-not (Get-Command "psql" -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: psql not found. Using Docker instead..." -ForegroundColor Yellow
    $UseDocker = $true
} else {
    $UseDocker = $false
}

function Run-SQL {
    param([string]$SQL)
    if ($UseDocker) {
        docker exec -i medicalsplants-db psql -U $DbUser -d $DbName -c $SQL
    } else {
        psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -c $SQL
    }
}

function Run-SQLFile {
    param([string]$FilePath)
    if ($UseDocker) {
        Get-Content $FilePath -Raw -Encoding UTF8 | docker exec -i medicalsplants-db psql -U $DbUser -d $DbName
    } else {
        psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $FilePath
    }
}

# Generate SQL import script
$TempSQL = Join-Path $env:TEMP "import_data.sql"

$SqlContent = @"
-- ============================================================
-- MEDICALS PLANTS - CSV Data Import
-- Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
-- ============================================================

SET client_encoding TO 'UTF8';

-- Create temporary tables for CSV import
CREATE TEMP TABLE tmp_symptom (
    title TEXT,
    symptom_family TEXT,
    symptom_detail TEXT,
    created_at TEXT
);

CREATE TEMP TABLE tmp_property (
    title TEXT,
    property_family TEXT,
    property_detail TEXT,
    created_at TEXT
);

CREATE TEMP TABLE tmp_plant (
    title TEXT,
    description TEXT,
    administration_mode TEXT,
    consumed_part TEXT,
    created_at TEXT
);

CREATE TEMP TABLE tmp_plant_property (
    plant TEXT,
    property TEXT
);

CREATE TEMP TABLE tmp_property_symptom (
    property TEXT,
    symptom TEXT
);

"@

if ($Reset) {
    $SqlContent += @"

-- Reset existing data (in correct order for foreign keys)
DELETE FROM ms_receipt_plant;
DELETE FROM ms_plant_property;
DELETE FROM ms_property_symptom;
DELETE FROM ms_review;
DELETE FROM ms_receipt;
DELETE FROM ms_plant;
DELETE FROM ms_property;
DELETE FROM ms_symptom;

"@
}

# Write SQL file
$SqlContent | Out-File -FilePath $TempSQL -Encoding UTF8

Write-Host "Step 1: Preparing import..." -ForegroundColor Green

# Copy CSV files to Docker container and import
if ($UseDocker) {
    # Copy files to container
    $files = @("symptom.csv", "property.csv", "plant.csv", "plant_property_title.csv", "property_symptom_title.csv")
    foreach ($file in $files) {
        $srcPath = Join-Path $DataDir $file
        if (Test-Path $srcPath) {
            # Convert to UTF-8 if needed
            $content = Get-Content $srcPath -Raw -Encoding Default
            $utf8Path = Join-Path $env:TEMP $file
            $content | Out-File -FilePath $utf8Path -Encoding UTF8
            docker cp $utf8Path "medicalsplants-db:/tmp/$file"
            Write-Host "  Copied $file to container" -ForegroundColor Gray
        }
    }
    
    # Generate COPY commands for Docker
    $ImportSQL = @"
SET client_encoding TO 'UTF8';

-- Create temp tables
CREATE TEMP TABLE tmp_symptom (title TEXT, symptom_family TEXT, symptom_detail TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_property (title TEXT, property_family TEXT, property_detail TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_plant (title TEXT, description TEXT, administration_mode TEXT, consumed_part TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_plant_property (plant TEXT, property TEXT);
CREATE TEMP TABLE tmp_property_symptom (property TEXT, symptom TEXT);

$(if ($Reset) { "DELETE FROM ms_receipt_plant; DELETE FROM ms_plant_property; DELETE FROM ms_property_symptom; DELETE FROM ms_review; DELETE FROM ms_receipt; DELETE FROM ms_plant; DELETE FROM ms_property; DELETE FROM ms_symptom;" })

-- Import CSVs
\copy tmp_symptom FROM '/tmp/symptom.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_property FROM '/tmp/property.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_plant FROM '/tmp/plant.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_plant_property FROM '/tmp/plant_property_title.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_property_symptom FROM '/tmp/property_symptom_title.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');

-- Insert into main tables
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at)
SELECT uuid_generate_v4(), title, symptom_family, symptom_detail, NOW()
FROM tmp_symptom
ON CONFLICT (title) DO UPDATE SET
    symptom_family = EXCLUDED.symptom_family,
    symptom_detail = EXCLUDED.symptom_detail,
    updated_at = NOW();

INSERT INTO ms_property (id, title, property_family, property_detail, created_at)
SELECT uuid_generate_v4(), title, property_family, property_detail, NOW()
FROM tmp_property
ON CONFLICT (title) DO UPDATE SET
    property_family = EXCLUDED.property_family,
    property_detail = EXCLUDED.property_detail,
    updated_at = NOW();

INSERT INTO ms_plant (id, title, description, created_at)
SELECT uuid_generate_v4(), title, description, NOW()
FROM tmp_plant
ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert junction table: plant_property
INSERT INTO ms_plant_property (plant_id, property_id)
SELECT p.id, pr.id
FROM tmp_plant_property t
JOIN ms_plant p ON p.title = t.plant
JOIN ms_property pr ON pr.title = TRIM(t.property)
ON CONFLICT DO NOTHING;

-- Insert junction table: property_symptom
INSERT INTO ms_property_symptom (property_id, symptom_id)
SELECT p.id, s.id
FROM tmp_property_symptom t
JOIN ms_property p ON p.title = TRIM(t.property)
JOIN ms_symptom s ON s.title = t.symptom
ON CONFLICT DO NOTHING;

-- Summary
SELECT 'Symptoms: ' || COUNT(*) FROM ms_symptom;
SELECT 'Properties: ' || COUNT(*) FROM ms_property;
SELECT 'Plants: ' || COUNT(*) FROM ms_plant;
SELECT 'Plant-Property links: ' || COUNT(*) FROM ms_plant_property;
SELECT 'Property-Symptom links: ' || COUNT(*) FROM ms_property_symptom;
"@

    $ImportSQLPath = Join-Path $env:TEMP "import_full.sql"
    $ImportSQL | Out-File -FilePath $ImportSQLPath -Encoding UTF8
    docker cp $ImportSQLPath "medicalsplants-db:/tmp/import_full.sql"
    
    Write-Host "Step 2: Importing data..." -ForegroundColor Green
    docker exec -i medicalsplants-db psql -U $DbUser -d $DbName -f /tmp/import_full.sql
    
} else {
    Write-Host "Direct psql import not implemented yet. Use Docker." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Import Complete ===" -ForegroundColor Green
