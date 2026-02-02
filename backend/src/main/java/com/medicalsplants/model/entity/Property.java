package com.medicalsplants.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "mp_property")
public class Property extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String family;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Relations Many-to-Many avec Symptom
    @ManyToMany
    @JoinTable(
            name = "mp_property_symptom",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    private Set<Symptom> symptoms = new HashSet<>();

    // Relations Many-to-Many avec Plant (inverse)
    @ManyToMany(mappedBy = "properties")
    @JsonIgnore
    private Set<Plant> plants = new HashSet<>();

    // Constructors
    public Property() {
    }

    public Property(UUID id, String title, String family, String description) {
        this.id = id;
        this.title = title;
        this.family = family;
        this.description = description;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Symptom> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(Set<Symptom> symptoms) {
        this.symptoms = symptoms;
    }

    public Set<Plant> getPlants() {
        return plants;
    }

    public void setPlants(Set<Plant> plants) {
        this.plants = plants;
    }

    // Utility methods
    public void addSymptom(Symptom symptom) {
        this.symptoms.add(symptom);
        symptom.getProperties().add(this);
    }

    public void removeSymptom(Symptom symptom) {
        this.symptoms.remove(symptom);
        symptom.getProperties().remove(this);
    }
}
