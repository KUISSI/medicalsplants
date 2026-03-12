package com.medicalsplants.integration;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
public class PostgresContainerIT {

    @Container
    public static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Test
    public void testPostgresIsUp() throws Exception {
        String url = postgres.getJdbcUrl();
        String user = postgres.getUsername();
        String pass = postgres.getPassword();

        try (Connection c = DriverManager.getConnection(url, user, pass); Statement s = c.createStatement()) {
            s.execute("CREATE TABLE IF NOT EXISTS tmp_test(id INT PRIMARY KEY, name TEXT);");
            s.execute("INSERT INTO tmp_test(id,name) VALUES(1,'t1') ON CONFLICT DO NOTHING;");
            ResultSet rs = s.executeQuery("SELECT count(*) FROM tmp_test");
            rs.next();
            int cnt = rs.getInt(1);
            // we inserted 1 row
            assertThat(cnt).isEqualTo(1);
        }
    }
}
