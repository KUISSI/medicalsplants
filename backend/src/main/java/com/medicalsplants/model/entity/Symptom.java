package com.medicalsplants.model.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_symptom")
public class Symptom extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 100)
    private String title;

    @Column(name = "symptom_family", nullable = false, length = 100)
    private String symptomFamily;

    @Column(name = "symptom_detail", columnDefinition = "TEXT")
    private String symptomDetail;

    @ManyToMany(mappedBy = "symptoms")
    private Set<Property> properties = new HashSet<>();

    public Symptom() {
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
}
