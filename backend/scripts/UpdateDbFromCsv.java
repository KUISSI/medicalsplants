package com.medicalsplants.scripts;

import java.io.*;
import java.nio.file.*;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

public class UpdateDbFromCsv {

    // Paramètres de connexion à la base de données
    private static final String DB_HOST = System.getenv().getOrDefault("DB_HOST", "localhost");
    private static final String DB_PORT = System.getenv().getOrDefault("DB_PORT", "5432");
    private static final String DB_NAME = System.getenv().getOrDefault("DB_NAME", "medicalsplants");
    private static final String DB_USER = System.getenv().getOrDefault("DB_USER", "postgres");
    private static final String DB_PASS = System.getenv().getOrDefault("DB_PASS", "postgres");

    // Dossier contenant les CSV
    private static final String CSV_DIR = Paths.get("data_import").toString();

    // Exemple de structure à adapter selon vos tables
    private static final Map<String, List<String>> TABLES = new HashMap<>();

    static {
        TABLES.put("plantes", Arrays.asList("id", "nom", "description", "famille"));
        TABLES.put("symptomes", Arrays.asList("id", "nom", "categorie"));
        // Ajouter d'autres tables ici
    }

    public static void main(String[] args) {
        try (Connection conn = connectDb()) {
            for (Map.Entry<String, List<String>> entry : TABLES.entrySet()) {
                String table = entry.getKey();
                List<String> columns = entry.getValue();
                Path csvPath = Paths.get(CSV_DIR, table + ".csv");
                if (!Files.exists(csvPath)) {
                    System.out.println("Fichier CSV manquant : " + csvPath);
                    continue;
                }
                System.out.println("Traitement de la table : " + table);
                createOrUpdateTable(conn, table, columns);
                importCsv(conn, table, columns, csvPath);
                System.out.println("Table " + table + " mise à jour.");
            }
            // Import des tables de jointure à partir des fichiers de correspondance
            importPlantPropertyJoin(conn);
            importPropertySymptomJoin(conn);
            System.out.println("Import terminé.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Import ms_plant_property à partir de plant_property_title.csv
    private static void importPlantPropertyJoin(Connection conn) throws IOException, SQLException {
        Path csvPath = Paths.get(CSV_DIR, "plant_property_title.csv");
        if (!Files.exists(csvPath)) {
            System.out.println("Fichier CSV manquant : " + csvPath);
            return;
        }
        try (BufferedReader reader = Files.newBufferedReader(csvPath)) {
            String header = reader.readLine(); // Ignore l'en-tête
            String line;
            String sql = "INSERT INTO ms_plant_property (plant_id, property_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                while ((line = reader.readLine()) != null) {
                    String[] values = line.split(";");
                    if (values.length < 2) {
                        continue;
                    }
                    String plantTitle = values[0].trim();
                    String propertyTitle = values[1].trim();
                    UUID plantId = getIdByTitle(conn, "ms_plant", "title", plantTitle);
                    UUID propertyId = getIdByTitle(conn, "ms_property", "title", propertyTitle);
                    if (plantId != null && propertyId != null) {
                        pstmt.setObject(1, plantId);
                        pstmt.setObject(2, propertyId);
                        pstmt.addBatch();
                    }
                }
                pstmt.executeBatch();
            }
        }
        System.out.println("Table ms_plant_property mise à jour.");
    }

    // Import ms_property_symptom à partir de property_symptom_title.csv
    private static void importPropertySymptomJoin(Connection conn) throws IOException, SQLException {
        Path csvPath = Paths.get(CSV_DIR, "property_symptom_title.csv");
        if (!Files.exists(csvPath)) {
            System.out.println("Fichier CSV manquant : " + csvPath);
            return;
        }
        try (BufferedReader reader = Files.newBufferedReader(csvPath)) {
            String header = reader.readLine(); // Ignore l'en-tête
            String line;
            String sql = "INSERT INTO ms_property_symptom (property_id, symptom_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                while ((line = reader.readLine()) != null) {
                    String[] values = line.split(";");
                    if (values.length < 2) {
                        continue;
                    }
                    String propertyTitle = values[0].trim();
                    String symptomTitle = values[1].trim();
                    UUID propertyId = getIdByTitle(conn, "ms_property", "title", propertyTitle);
                    UUID symptomId = getIdByTitle(conn, "ms_symptom", "title", symptomTitle);
                    if (propertyId != null && symptomId != null) {
                        pstmt.setObject(1, propertyId);
                        pstmt.setObject(2, symptomId);
                        pstmt.addBatch();
                    }
                }
                pstmt.executeBatch();
            }
        }
        System.out.println("Table ms_property_symptom mise à jour.");
    }

    // Utilitaire pour retrouver l'ID d'une entité par son titre
    private static UUID getIdByTitle(Connection conn, String table, String titleCol, String titleValue) throws SQLException {
        String sql = String.format("SELECT id FROM %s WHERE %s = ?", table, titleCol);
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, titleValue);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return (UUID) rs.getObject("id");
                }
            }
        }
        return null;
    }

    private static Connection connectDb() throws SQLException {
        String url = String.format("jdbc:postgresql://%s:%s/%s", DB_HOST, DB_PORT, DB_NAME);
        return DriverManager.getConnection(url, DB_USER, DB_PASS);
    }

    private static void createOrUpdateTable(Connection conn, String table, List<String> columns) throws SQLException {
        String colDefs = columns.stream().map(col -> col + " TEXT").collect(Collectors.joining(", "));
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(String.format("CREATE TABLE IF NOT EXISTS %s (%s);", table, colDefs));
            stmt.executeUpdate(String.format("DELETE FROM %s;", table)); // Vide la table avant import
        }
    }

    private static void importCsv(Connection conn, String table, List<String> columns, Path csvPath) throws IOException, SQLException {
        try (BufferedReader reader = Files.newBufferedReader(csvPath)) {
            String header = reader.readLine(); // Ignore l'en-tête
            String line;
            String placeholders = columns.stream().map(c -> "?").collect(Collectors.joining(", "));
            String sql = String.format("INSERT INTO %s (%s) VALUES (%s)", table, String.join(", ", columns), placeholders);
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                while ((line = reader.readLine()) != null) {
                    String[] values = line.split(",");
                    for (int i = 0; i < columns.size(); i++) {
                        pstmt.setString(i + 1, i < values.length ? values[i] : null);
                    }
                    pstmt.addBatch();
                }
                pstmt.executeBatch();
            }
        }
    }
}
