package com.felix.QuizApp.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizResultDTO {
    private Long submissionId;
    private Long quizId;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer score;
    private double percentage;
    private LocalDateTime submittedAt;
    private List<AnswerSubmissionResponseDTO> answers; // Add answer details
 }

