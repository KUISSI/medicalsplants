package com.medicalsplants.model.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_symptom")
public class Symptom extends BaseEntity {

    public Symptom() {
    }

    public Symptom(java.util.UUID id, String title, String symptomFamily, String symptomDetail, Set<Property> properties) {
        this.id = id;
        this.title = title;
        this.symptomFamily = symptomFamily;
        this.symptomDetail = symptomDetail;
        this.properties = properties;
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

    public String getSymptomFamily() {
        return symptomFamily;
    }

    public void setSymptomFamily(String symptomFamily) {
        this.symptomFamily = symptomFamily;
    }

    public String getSymptomDetail() {
        return symptomDetail;
    }

    public void setSymptomDetail(String symptomDetail) {
        this.symptomDetail = symptomDetail;
    }

    public Set<Property> getProperties() {
        return properties;
    }

    public void setProperties(Set<Property> properties) {
        this.properties = properties;
    }

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "symptom_family", nullable = false, length = 20)
    private String symptomFamily;

    @Column(name = "symptom_detail", nullable = false, columnDefinition = "TEXT")
    private String symptomDetail;

    // Relations Many-to-Many avec Property (inverse)
    @ManyToMany(mappedBy = "symptoms")
    private Set<Property> properties = new HashSet<>();
}
