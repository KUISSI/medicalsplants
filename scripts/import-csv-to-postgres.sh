#!/bin/bash
# ============================================================
# MEDICALS PLANTS - CSV to PostgreSQL Import Script
# ============================================================
# Usage:
#   ./import-csv-to-postgres.sh          # Import/update data
#   ./import-csv-to-postgres.sh --reset  # Clear and reimport
# ============================================================

set -e

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5433}"
DB_NAME="${DB_NAME:-medicalsplants_dev}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
CONTAINER_NAME="medicalsplants-db"

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_ROOT/data_import"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== CSV to PostgreSQL Import ===${NC}"
echo "Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "Data directory: $DATA_DIR"
echo ""

# Check for reset flag
RESET_DATA=""
if [[ "$1" == "--reset" ]]; then
    echo -e "${YELLOW}WARNING: This will delete all existing data!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        RESET_DATA="true"
    else
        echo "Aborted."
        exit 0
    fi
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}Container $CONTAINER_NAME not running. Starting...${NC}"
    docker-compose -f "$PROJECT_ROOT/docker-compose.dev.yml" up -d db
    sleep 5
fi

echo -e "${GREEN}Step 1: Copying CSV files to container...${NC}"

# Copy CSV files with UTF-8 conversion
for file in symptom.csv property.csv plant.csv plant_property_title.csv property_symptom_title.csv; do
    if [[ -f "$DATA_DIR/$file" ]]; then
        # Convert to UTF-8 and copy
        iconv -f WINDOWS-1252 -t UTF-8 "$DATA_DIR/$file" 2>/dev/null | \
            docker exec -i $CONTAINER_NAME tee "/tmp/$file" > /dev/null || \
            docker cp "$DATA_DIR/$file" "$CONTAINER_NAME:/tmp/$file"
        echo "  Copied $file"
    else
        echo "  WARNING: $file not found"
    fi
done

echo -e "${GREEN}Step 2: Generating import SQL...${NC}"

# Generate SQL script
cat > /tmp/import_data.sql << 'EOSQL'
SET client_encoding TO 'UTF8';

-- Create temporary tables
CREATE TEMP TABLE tmp_symptom (title TEXT, symptom_family TEXT, symptom_detail TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_property (title TEXT, property_family TEXT, property_detail TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_plant (title TEXT, description TEXT, administration_mode TEXT, consumed_part TEXT, created_at TEXT);
CREATE TEMP TABLE tmp_plant_property (plant TEXT, property TEXT);
CREATE TEMP TABLE tmp_property_symptom (property TEXT, symptom TEXT);

EOSQL

# Add reset commands if needed
if [[ "$RESET_DATA" == "true" ]]; then
    cat >> /tmp/import_data.sql << 'EOSQL'
-- Reset existing data
DELETE FROM ms_receipt_plant;
DELETE FROM ms_plant_property;
DELETE FROM ms_property_symptom;
DELETE FROM ms_review;
DELETE FROM ms_receipt;
DELETE FROM ms_plant;
DELETE FROM ms_property;
DELETE FROM ms_symptom;

EOSQL
fi

# Add import commands
cat >> /tmp/import_data.sql << 'EOSQL'
-- Import CSV data
\copy tmp_symptom FROM '/tmp/symptom.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_property FROM '/tmp/property.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_plant FROM '/tmp/plant.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_plant_property FROM '/tmp/plant_property_title.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');
\copy tmp_property_symptom FROM '/tmp/property_symptom_title.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');

-- Insert symptoms
INSERT INTO ms_symptom (id, title, symptom_family, symptom_detail, created_at)
SELECT uuid_generate_v4(), title, symptom_family, symptom_detail, NOW()
FROM tmp_symptom
ON CONFLICT (title) DO UPDATE SET
    symptom_family = EXCLUDED.symptom_family,
    symptom_detail = EXCLUDED.symptom_detail,
    updated_at = NOW();

-- Insert properties
INSERT INTO ms_property (id, title, property_family, property_detail, created_at)
SELECT uuid_generate_v4(), title, property_family, property_detail, NOW()
FROM tmp_property
ON CONFLICT (title) DO UPDATE SET
    property_family = EXCLUDED.property_family,
    property_detail = EXCLUDED.property_detail,
    updated_at = NOW();

-- Insert plants
INSERT INTO ms_plant (id, title, description, created_at)
SELECT uuid_generate_v4(), title, description, NOW()
FROM tmp_plant
ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert plant-property relationships
INSERT INTO ms_plant_property (plant_id, property_id)
SELECT p.id, pr.id
FROM tmp_plant_property t
JOIN ms_plant p ON p.title = t.plant
JOIN ms_property pr ON pr.title = TRIM(t.property)
ON CONFLICT DO NOTHING;

-- Insert property-symptom relationships
INSERT INTO ms_property_symptom (property_id, symptom_id)
SELECT p.id, s.id
FROM tmp_property_symptom t
JOIN ms_property p ON p.title = TRIM(t.property)
JOIN ms_symptom s ON s.title = t.symptom
ON CONFLICT DO NOTHING;

-- Display summary
SELECT 'Symptoms: ' || COUNT(*) FROM ms_symptom;
SELECT 'Properties: ' || COUNT(*) FROM ms_property;
SELECT 'Plants: ' || COUNT(*) FROM ms_plant;
SELECT 'Plant-Property links: ' || COUNT(*) FROM ms_plant_property;
SELECT 'Property-Symptom links: ' || COUNT(*) FROM ms_property_symptom;
EOSQL

# Copy and execute SQL
docker cp /tmp/import_data.sql "$CONTAINER_NAME:/tmp/import_data.sql"

echo -e "${GREEN}Step 3: Executing import...${NC}"
docker exec -i $CONTAINER_NAME psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/import_data.sql

echo ""
echo -e "${GREEN}=== Import Complete ===${NC}"
