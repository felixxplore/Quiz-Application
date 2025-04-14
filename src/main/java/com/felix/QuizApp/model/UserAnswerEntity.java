package com.felix.QuizApp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswerEntity {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private UserQuizResultEntity attempt;

    @ManyToOne
    private QuestionEntity question;

    private Integer selectedOptionIndex;
    private Boolean isCorrect;

}
