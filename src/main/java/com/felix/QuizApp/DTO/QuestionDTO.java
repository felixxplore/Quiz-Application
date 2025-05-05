package com.felix.QuizApp.DTO;


import com.felix.QuizApp.enums.QuestionType;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;
    private String questionText;
    private QuestionType questionType;  // MCQ, True/False, etc.
    private Long quizId;
    private List<AnswerOptionDTO> options; // Store answer options

}

