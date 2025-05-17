package com.felix.QuizApp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerSubmissionResponseDTO {
    private Long questionId;
    private String questionText;
    private String questionType;
    private Long selectedOptionId;
    private String selectedOptionText;
     private Boolean isCorrect;
    private String correctAnswer;
    private List<OptionDTO> options;

    @Data
    public static class OptionDTO {
        private Long optionId;
        private String optionText;
        private Boolean isCorrect;
    }
}
