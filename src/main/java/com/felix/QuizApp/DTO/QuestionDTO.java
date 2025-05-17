package com.felix.QuizApp.DTO;


import com.felix.QuizApp.enums.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;

    @NotBlank( message = "Question text is required")
    private String questionText;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;  // MCQ, True/False, etc.

    @NotNull(message="Quiz ID Is required")
    private Long quizId;

    @Valid
    @NotNull(message = "Answer options are required")
    private List<AnswerOptionDTO> options; // Store answer options

}

