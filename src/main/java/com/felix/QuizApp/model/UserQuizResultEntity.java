package com.felix.QuizApp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserQuizResultEntity {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private UserEntity user;

    @ManyToOne
    private QuizEntity quiz;

    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private LocalDateTime attemptedAt;

}
