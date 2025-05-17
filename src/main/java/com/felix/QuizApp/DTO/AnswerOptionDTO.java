package com.felix.QuizApp.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerOptionDTO {
    private Long id;

    @NotBlank(message = "Option text is required")
    private String optionText;

    @NotNull(message = "isCorrect must be provided")
    private Boolean isCorrect;

    private Integer optionIndex;

     private Long questionId;
}

