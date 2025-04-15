package com.felix.QuizApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private QuizEntity quiz;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private Integer score;

    private Integer totalQuestions;
    private Integer correctAnswers;

    private LocalDateTime submittedAt;

    @Column(name = "percentage")
    private Double percentage;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAnswer> userAnswers = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.submittedAt = LocalDateTime.now();
    }
}

