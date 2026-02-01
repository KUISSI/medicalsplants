package com.medicalsplants.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_plant")
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
    private Set<Property> properties = new HashSet<>();

    // Relations Many-to-Many avec Receipt (inverse)
    @ManyToMany(mappedBy = "plants")
    @JsonIgnore
    private Set<Receipt> receipts = new HashSet<>();

    public Plant() {
    }

    public Plant(java.util.UUID id, String title, String description, Set<Property> properties, Set<Receipt> receipts) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.properties = properties;
        this.receipts = receipts;
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

    public Set<Receipt> getReceipts() {
        return receipts;
    }

    public void setReceipts(Set<Receipt> receipts) {
        this.receipts = receipts;
    }

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
