package com.medicalsplants.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "mp_symptom")
public class Symptom extends BaseEntity {

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

    // Relations Many-to-Many avec Property (inverse)
    @ManyToMany(mappedBy = "symptoms")
    @JsonIgnore
    private Set<Property> properties = new HashSet<>();

    // Constructors
    public Symptom() {
    }

    public Symptom(UUID id, String title, String family, String description) {
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

    public Set<Property> getProperties() {
        return properties;
    }

    public void setProperties(Set<Property> properties) {
        this.properties = properties;
    }
}
