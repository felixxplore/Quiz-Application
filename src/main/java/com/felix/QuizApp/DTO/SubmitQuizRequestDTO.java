package com.felix.QuizApp.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmitQuizRequestDTO {
    @Min(value = 1, message = "Quiz ID is required")
    private Long quizId;

    @Valid
    @NotEmpty(message="Answer list must not be empty")
    private List<AnswerDTO> answers;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AnswerDTO {
        @Min(value = 1, message = "Question ID is required")
        private Long questionId;

        @Min(value = 0, message = "Selected option ID must not be negative")
        private Long selectedOptionId;
    }
}

