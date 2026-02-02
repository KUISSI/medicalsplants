# Script pour mettre à jour les en-têtes des fichiers CSV selon le nouveau schéma mp_
# Exécuter ce script depuis le dossier data_import

$DataImportPath = "c:\Users\Utilisateur\Documents\Simplon_pc\Dossier Projets\Projet certification\medicalsplants\data_import"

# Fonction pour remplacer les en-têtes dans un fichier CSV
function Update-CsvHeader {
    param (
        [string]$FilePath,
        [hashtable]$HeaderMappings
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "Fichier non trouvé: $FilePath" -ForegroundColor Red
        return
    }
    
    # Lire le contenu du fichier avec l'encodage approprié
    $content = Get-Content -Path $FilePath -Encoding UTF8
    
    if ($content.Count -eq 0) {
        Write-Host "Fichier vide: $FilePath" -ForegroundColor Yellow
        return
    }
    
    # Récupérer la première ligne (en-têtes)
    $header = $content[0]
    $originalHeader = $header
    
    # Appliquer les remplacements
    foreach ($mapping in $HeaderMappings.GetEnumerator()) {
        $header = $header -replace $mapping.Key, $mapping.Value
    }
    
    # Si l'en-tête a changé, mettre à jour le fichier
    if ($header -ne $originalHeader) {
        $content[0] = $header
        $content | Set-Content -Path $FilePath -Encoding UTF8
        Write-Host "Mis à jour: $FilePath" -ForegroundColor Green
        Write-Host "  Avant: $originalHeader" -ForegroundColor Gray
        Write-Host "  Après: $header" -ForegroundColor Cyan
    } else {
        Write-Host "Aucun changement nécessaire: $FilePath" -ForegroundColor Yellow
    }
}

# 1. Mettre à jour mp_symptom.csv
# symptom_family → family, symptom_detail → description
Update-CsvHeader -FilePath "$DataImportPath\mp_symptom.csv" -HeaderMappings @{
    'symptom_family' = 'family'
    'symptom_detail' = 'description'
}

# 2. Mettre à jour mp_property.csv
# property_family → family, property_detail → description
Update-CsvHeader -FilePath "$DataImportPath\mp_property.csv" -HeaderMappings @{
    'property_family' = 'family'
    'property_detail' = 'description'
}

# 3. Mettre à jour mp_plant.csv
# short_history → history
Update-CsvHeader -FilePath "$DataImportPath\mp_plant.csv" -HeaderMappings @{
    'short_history' = 'history'
}

# 4. Renommer mp_receipt.csv en mp_recipe.csv et mettre à jour les en-têtes
$receiptPath = "$DataImportPath\mp_receipt.csv"
$recipePath = "$DataImportPath\mp_recipe.csv"

if (Test-Path $receiptPath) {
    # Lire le contenu
    $content = Get-Content -Path $receiptPath -Encoding UTF8
    
    if ($content.Count -gt 0) {
        # Mettre à jour l'en-tête
        $header = $content[0]
        # preparation_time → preparation_time_minutes, difficulte → difficulty
        # ingredient → ingredients, author_id reste author_id
        $header = $header -replace 'preparation_time', 'preparation_time_minutes'
        $header = $header -replace 'difficulte', 'difficulty'
        $header = $header -replace ';ingredient;', ';ingredients;'
        $content[0] = $header
        
        # Sauvegarder avec le nouveau nom
        $content | Set-Content -Path $recipePath -Encoding UTF8
        
        # Supprimer l'ancien fichier
        Remove-Item -Path $receiptPath -Force
        
        Write-Host "Renommé et mis à jour: mp_receipt.csv -> mp_recipe.csv" -ForegroundColor Green
    }
} elseif (Test-Path $recipePath) {
    # Le fichier a déjà été renommé, juste mettre à jour les en-têtes
    Update-CsvHeader -FilePath $recipePath -HeaderMappings @{
        'preparation_time' = 'preparation_time_minutes'
        'difficulte' = 'difficulty'
    }
}

# 5. Mettre à jour mp_review.csv
# sender_id → author_id, receipt_id → recipe_id, parent_review_id → parent_id
# created_id/updated_id/deleted_id → created_at/updated_at/deleted_at (correction typo)
Update-CsvHeader -FilePath "$DataImportPath\mp_review.csv" -HeaderMappings @{
    'sender_id' = 'author_id'
    'receipt_id' = 'recipe_id'
    'parent_review_id' = 'parent_id'
    'created_id' = 'created_at'
    'updated_id' = 'updated_at'
    'deleted_id' = 'deleted_at'
}

# 6. Mettre à jour mp_interaction.csv
# review_id → recipe_id, supprimer value (sera fait manuellement si besoin)
Update-CsvHeader -FilePath "$DataImportPath\mp_interaction.csv" -HeaderMappings @{
    'review_id' = 'recipe_id'
}

# 7. Renommer mp_receipt_plant_title.csv en mp_recipe_plant_title.csv
$receiptPlantPath = "$DataImportPath\mp_receipt_plant_title.csv"
$recipePlantPath = "$DataImportPath\mp_recipe_plant_title.csv"

if (Test-Path $receiptPlantPath) {
    # Lire le contenu
    $content = Get-Content -Path $receiptPlantPath -Encoding UTF8
    
    if ($content.Count -gt 0) {
        # Mettre à jour l'en-tête
        $header = $content[0]
        $header = $header -replace 'receipt', 'recipe'
        $content[0] = $header
        
        # Sauvegarder avec le nouveau nom
        $content | Set-Content -Path $recipePlantPath -Encoding UTF8
        
        # Supprimer l'ancien fichier
        Remove-Item -Path $receiptPlantPath -Force
        
        Write-Host "Renommé et mis à jour: mp_receipt_plant_title.csv -> mp_recipe_plant_title.csv" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Mise à jour des fichiers CSV terminée ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "Résumé des changements d'en-têtes:" -ForegroundColor White
Write-Host "  mp_symptom.csv: symptom_family → family, symptom_detail → description" -ForegroundColor Gray
Write-Host "  mp_property.csv: property_family → family, property_detail → description" -ForegroundColor Gray
Write-Host "  mp_plant.csv: short_history → history" -ForegroundColor Gray
Write-Host "  mp_receipt.csv → mp_recipe.csv: preparation_time → preparation_time_minutes, difficulte → difficulty" -ForegroundColor Gray
Write-Host "  mp_review.csv: sender_id → author_id, receipt_id → recipe_id, parent_review_id → parent_id" -ForegroundColor Gray
Write-Host "  mp_interaction.csv: review_id → recipe_id (value column removed from schema)" -ForegroundColor Gray
Write-Host "  mp_receipt_plant_title.csv → mp_recipe_plant_title.csv" -ForegroundColor Gray
