package com.felix.QuizApp.DTO;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerOptionDTO {
    private Long id;
    private String optionText;
    private Boolean isCorrect;
    private Integer optionIndex;
    private Long questionId;
}

