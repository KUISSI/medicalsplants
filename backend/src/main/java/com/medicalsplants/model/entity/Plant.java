package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.AdministrationMode;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

//  Entity representing a medicinal plant. 
//  Plants have properties and can be used in recipes.
@Entity
@Table(name = "ms_plant", indexes = {
    @Index(name = "idx_plant_title", columnList = "title"),
    @Index(name = "idx_plant_admin_mode", columnList = "administration_mode")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plant extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "administration_mode", nullable = false, length = 30)
    private AdministrationMode administrationMode;

    @Column(name = "consumed_part", length = 100)
    private String consumedPart;

    @Column(name = "image_url")
    private String imageUrl;

    // ========================================
    // RELATIONSHIPS
    // ========================================
    @ManyToMany
    @JoinTable(
            name = "ms_plant_property",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    @Builder.Default
    private Set<Property> properties = new HashSet<>();

    @ManyToMany(mappedBy = "plants")
    @Builder.Default
    private Set<Receipt> receipts = new HashSet<>();

    // ========================================
    // HELPER METHODS
    // ========================================
    // Adds a property to this plant.
    public void addProperty(Property property) {
        this.properties.add(property);
        property.getPlants().add(this);
    }

    //  Removes a property from this plant.
    public void removeProperty(Property property) {
        this.properties.remove(property);
        property.getPlants().remove(this);
    }

    // Gets the count of associated properties.
    public int getPropertyCount() {
        return properties != null ? properties.size() : 0;
    }

    //  Gets the count of associated recipes.
    public int getReceiptCount() {
        return receipts != null ? receipts.size() : 0;
    }
}
