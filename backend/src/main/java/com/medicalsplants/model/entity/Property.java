package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_property")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property extends BaseEntity {

    @Id
    @Column(length = 26)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "property_family", nullable = false, length = 20)
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
    @Builder.Default
    private Set<Symptom> symptoms = new HashSet<>();

    // Relations Many-to-Many avec Plant (inverse)
    @ManyToMany(mappedBy = "properties")
    @Builder.Default
    private Set<Plant> plants = new HashSet<>();

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
