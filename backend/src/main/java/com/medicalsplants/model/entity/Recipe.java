package com.medicalsplants.model.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.medicalsplants.model.enums.RecipeStatus;
import com.medicalsplants.model.enums.RecipeType;

import jakarta.persistence.*;

@Entity
@Table(name = "mp_recipe")
public class Recipe extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RecipeType type;

    @Column(name = "servings")
    private Integer servings;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "preparation_time")
    private String preparationTime;

    @Column(length = 20)
    private String difficulty;

    @Column(columnDefinition = "JSONB")
    private String ingredients;

    @Column(columnDefinition = "JSONB")
    private String instructions;

    @Column(name = "is_premium", nullable = false)
    private Boolean premium = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RecipeStatus status = RecipeStatus.DRAFT;

    @Column(name = "published_at")
    private Instant publishedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToMany
    @JoinTable(
            name = "mp_recipe_plant",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "plant_id")
    )
    private Set<Plant> plants = new HashSet<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    public Recipe() {
    }

    public Recipe(UUID id, String title, RecipeType type, String description, User author) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.description = description;
        this.author = author;
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

    public RecipeType getType() {
        return type;
    }

    public void setType(RecipeType type) {
        this.type = type;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(String preparationTime) {
        this.preparationTime = preparationTime;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    // DRY: Getter retourne toujours un primitif
    public boolean premium() {
        return Boolean.TRUE.equals(premium);
    }

    // Setter force une valeur non nulle
    public void setPremium(Boolean premium) {
        this.premium = premium != null ? premium : false;
    }

    public RecipeStatus getStatus() {
        return status;
    }

    public void setStatus(RecipeStatus status) {
        this.status = status;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Set<Plant> getPlants() {
        return plants;
    }

    public void setPlants(Set<Plant> plants) {
        this.plants = plants;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    // Utility methods
    public void addPlant(Plant plant) {
        this.plants.add(plant);
        plant.getRecipes().add(this);
    }

    public void removePlant(Plant plant) {
        this.plants.remove(plant);
        plant.getRecipes().remove(this);
    }

    public void publish() {
        this.status = RecipeStatus.PUBLISHED;
        this.publishedAt = Instant.now();
    }

    public void archive() {
        this.status = RecipeStatus.ARCHIVED;
    }

    @Transient
    public Long getReviewCount() {
        return reviews != null ? (long) reviews.size() : 0L;
    }

    @Transient
    public Double getAverageRating() {
        if (reviews == null || reviews.isEmpty()) {
            return null;
        }
        return reviews.stream()
                .filter(r -> r.getRating() != null)
                .mapToInt(r -> r.getRating() != null ? r.getRating() : 0)
                .average()
                .orElse(0.0);
    }
}
