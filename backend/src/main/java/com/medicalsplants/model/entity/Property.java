package com.medicalsplants.model.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_property")
public class Property extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "property_family", nullable = false, length = 100)
    private String propertyFamily;

    @Column(name = "property_detail", nullable = false, columnDefinition = "TEXT")
    private String propertyDetail;

    // Relations Many-to-Many avec Symptom
    @ManyToMany
    @JoinTable(
            name = "ms_property_symptom",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    private Set<Symptom> symptoms = new HashSet<>();

    // Relations Many-to-Many avec Plant (inverse)
    @ManyToMany(mappedBy = "properties")
    private Set<Plant> plants = new HashSet<>();

    public Property() {
    }

    public Property(java.util.UUID id, String title, String propertyFamily, String propertyDetail, Set<Symptom> symptoms, Set<Plant> plants) {
        this.id = id;
        this.title = title;
        this.propertyFamily = propertyFamily;
        this.propertyDetail = propertyDetail;
        this.symptoms = symptoms;
        this.plants = plants;
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPropertyFamily() {
        return propertyFamily;
    }

    public void setPropertyFamily(String propertyFamily) {
        this.propertyFamily = propertyFamily;
    }

    public String getPropertyDetail() {
        return propertyDetail;
    }

    public void setPropertyDetail(String propertyDetail) {
        this.propertyDetail = propertyDetail;
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

    // Méthodes utilitaires
    public void addSymptom(Symptom symptom) {
        this.symptoms.add(symptom);
        symptom.getProperties().add(this);
    }

    public void removeSymptom(Symptom symptom) {
        this.symptoms.remove(symptom);
        symptom.getProperties().remove(this);
    }
}
