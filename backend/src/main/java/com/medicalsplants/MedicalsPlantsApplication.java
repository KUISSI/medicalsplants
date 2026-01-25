package com.medicalsplants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableJpaAuditing
public class MedicalsPlantsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalsPlantsApplication.class, args);
    }
}
