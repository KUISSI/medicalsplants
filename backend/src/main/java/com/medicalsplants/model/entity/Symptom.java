package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_symptom")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Symptom {

    @Id
    @Column(length = 26)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "symptom_family", nullable = false, length = 20)
    private String symptomFamily;

    @Column(name = "symptom_detail", nullable = false, columnDefinition = "TEXT")
    private String symptomDetail;

    // Relations Many-to-Many avec Property (inverse)
    @ManyToMany(mappedBy = "symptoms")
    @Builder.Default
    private Set<Property> properties = new HashSet<>();
}
