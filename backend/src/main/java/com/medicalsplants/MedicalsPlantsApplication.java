package com.medicalsplants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for Medicals Plants API.
 *
 * @author KUISSI
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class MedicalsPlantsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalsPlantsApplication.class, args);
    }
}
