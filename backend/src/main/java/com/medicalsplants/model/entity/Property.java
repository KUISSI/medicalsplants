package com.medicalsplants.model.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_property")
public class Property extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 100)
    private String title;

    @Column(name = "property_family", nullable = false, length = 100)
    private String propertyFamily;

    @Column(name = "property_detail", columnDefinition = "TEXT")
    private String propertyDetail;

    @ManyToMany
    @JoinTable(
            name = "ms_property_symptom",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    private Set<Symptom> symptoms = new HashSet<>();

    @ManyToMany(mappedBy = "properties")
    private Set<Plant> plants = new HashSet<>();

    public Property() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
}
