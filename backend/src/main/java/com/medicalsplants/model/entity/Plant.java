package com.medicalsplants.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "mp_plant")
public class Plant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String history;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    // Relations Many-to-Many avec Property
    @ManyToMany
    @JoinTable(
            name = "mp_plant_property",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private Set<Property> properties = new HashSet<>();

    // Relations Many-to-Many avec Recipe (inverse)
    @ManyToMany(mappedBy = "plants")
    @JsonIgnore
    private Set<Recipe> recipes = new HashSet<>();

    // Constructors
    public Plant() {
    }

    public Plant(UUID id, String title, String description, String history, String imageUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.history = history;
        this.imageUrl = imageUrl;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<Property> getProperties() {
        return properties;
    }

    public void setProperties(Set<Property> properties) {
        this.properties = properties;
    }

    public Set<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(Set<Recipe> recipes) {
        this.recipes = recipes;
    }

    // Utility methods
    public void addProperty(Property property) {
        this.properties.add(property);
        property.getPlants().add(this);
    }

    public void removeProperty(Property property) {
        this.properties.remove(property);
        property.getPlants().remove(this);
    }
}
