package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.InteractionType;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "mp_interaction",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "recipe_id", "type"}))
public class Interaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InteractionType type;

    // Utilisateur ayant interagi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Recette concernée
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // Constructors
    public Interaction() {
    }

    public Interaction(UUID id, InteractionType type, User user, Recipe recipe) {
        this.id = id;
        this.type = type;
        this.user = user;
        this.recipe = recipe;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public InteractionType getType() {
        return type;
    }

    public void setType(InteractionType type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    // Static factory methods
    public static Interaction like(User user, Recipe recipe) {
        return new Interaction(null, InteractionType.LIKE, user, recipe);
    }

    public static Interaction dislike(User user, Recipe recipe) {
        return new Interaction(null, InteractionType.DISLIKE, user, recipe);
    }

    public static Interaction bookmark(User user, Recipe recipe) {
        return new Interaction(null, InteractionType.BOOKMARK, user, recipe);
    }

    public static Interaction report(User user, Recipe recipe) {
        return new Interaction(null, InteractionType.REPORT, user, recipe);
    }

    // Utility methods
    public boolean isLike() {
        return this.type == InteractionType.LIKE;
    }

    public boolean isDislike() {
        return this.type == InteractionType.DISLIKE;
    }

    public boolean isBookmark() {
        return this.type == InteractionType.BOOKMARK;
    }

    public boolean isReport() {
        return this.type == InteractionType.REPORT;
    }
}
