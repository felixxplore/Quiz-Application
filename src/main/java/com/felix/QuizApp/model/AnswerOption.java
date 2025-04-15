package com.felix.QuizApp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String optionText;
    private Boolean isAnswerCorrect;
    private Integer optionIndex;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionEntity question;



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnswerOption that = (AnswerOption) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
