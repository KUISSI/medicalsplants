package com.medicalsplants.model.entity;

import jakarta. persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util. Set;

/**
 * Entity representing a medicinal property.
 * Properties link symptoms to plants. 
 */
@Entity
@Table(name = "ms_property", indexes = {
    @Index(name = "idx_property_title", columnList = "title"),
    @Index(name = "idx_property_family", columnList = "property_family")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    // ========================================
    // RELATIONSHIPS
    // ========================================

    @ManyToMany
    @JoinTable(
        name = "ms_property_symptom",
        joinColumns = @JoinColumn(name = "property_id"),
        inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    @Builder.Default
    private Set<Symptom> symptoms = new HashSet<>();

    @ManyToMany(mappedBy = "properties")
    @Builder.Default
    private Set<Plant> plants = new HashSet<>();

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Adds a symptom to this property.
     */
    public void addSymptom(Symptom symptom) {
        this.symptoms.add(symptom);
        symptom.getProperties().add(this);
    }

    /**
     * Removes a symptom from this property. 
     */
    public void removeSymptom(Symptom symptom) {
        this.symptoms.remove(symptom);
        symptom.getProperties().remove(this);
    }
}
