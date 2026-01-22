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
    private static final String CSV_DIR = Paths.get("database", "csv").toString();

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
            System.out.println("Import terminé.");
        } catch (Exception e) {
            e.printStackTrace();
        }
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
