package com.felix.QuizApp.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Data
public class SubmitQuizRequestDTO {
    private Long quizId;
    private List<AnswerDTO> answers;

    @Getter
    @Setter
    public static class AnswerDTO {
        private Long questionId;
        private Long selectedOptionId;
    }
}

