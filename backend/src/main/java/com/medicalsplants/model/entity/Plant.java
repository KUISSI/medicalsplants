package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_plant")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plant extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Relations Many-to-Many avec Property
    @ManyToMany
    @JoinTable(
            name = "ms_plant_property",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    @Builder.Default
    private Set<Property> properties = new HashSet<>();

    // Relations Many-to-Many avec Receipt (inverse)
    @ManyToMany(mappedBy = "plants")
    @Builder.Default
    private Set<Receipt> receipts = new HashSet<>();

    // Méthodes utilitaires
    public void addProperty(Property property) {
        this.properties.add(property);
        property.getPlants().add(this);
    }

    public void removeProperty(Property property) {
        this.properties.remove(property);
        property.getPlants().remove(this);
    }
}
