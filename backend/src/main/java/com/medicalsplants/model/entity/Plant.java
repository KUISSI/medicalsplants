package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.AdministrationMode;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_plant")
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

    @ManyToMany
    @JoinTable(
            name = "ms_plant_property",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private Set<Property> properties = new HashSet<>();

    @ManyToMany(mappedBy = "plants")
    private Set<Receipt> receipts = new HashSet<>();

    public Plant() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AdministrationMode getAdministrationMode() {
        return administrationMode;
    }

    public void setAdministrationMode(AdministrationMode administrationMode) {
        this.administrationMode = administrationMode;
    }

    public String getConsumedPart() {
        return consumedPart;
    }

    public void setConsumedPart(String consumedPart) {
        this.consumedPart = consumedPart;
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
}
