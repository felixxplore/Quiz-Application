package com.felix.QuizApp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "topics")
public class TopicEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String name;

        @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
         private List<SubtopicEntity> subtopics = new ArrayList<>();

}
