package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.QuizResultDTO;
import com.felix.QuizApp.DTO.SubmitQuizRequestDTO;
import com.felix.QuizApp.model.*;
import com.felix.QuizApp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserRepository userRepository;

    public QuizResultDTO submitQuiz(UUID userId, SubmitQuizRequestDTO request) {
        QuizEntity quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        QuizSubmission submission = new QuizSubmission();
        submission.setQuiz(quiz);
        submission.setUser(user);

        int correctCount = 0;
        List<UserAnswer> userAnswers = new ArrayList<>();

        for (SubmitQuizRequestDTO.AnswerDTO ans : request.getAnswers()) {
            QuestionEntity question = questionRepository.findById(ans.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            AnswerOption selected = answerOptionRepository.findById(ans.getSelectedOptionId())
                    .orElseThrow(() -> new RuntimeException("Option not found"));

            boolean isCorrect = Boolean.TRUE.equals(selected.getIsAnswerCorrect());
            if (isCorrect) correctCount++;

            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setSubmission(submission);
            userAnswer.setQuestion(question);
            userAnswer.setSelectedOption(selected);
            userAnswer.setIsCorrect(isCorrect);
            userAnswers.add(userAnswer);
        }

        int totalQuestions = request.getAnswers().size();
        double percentage = totalQuestions > 0
                ? (correctCount * 100.0) / totalQuestions
                : 0.0;

        // ✅ Setting all computed values in submission entity
        submission.setCorrectAnswers(correctCount);
        submission.setTotalQuestions(totalQuestions);
        submission.setPercentage(percentage);
        submission.setScore(correctCount); // assuming 1 mark per correct question
        submission.setUserAnswers(userAnswers);

        quizSubmissionRepository.save(submission); // cascade saves answers too

        return mapToResultDto(submission); // returns final detailed result
    }

    private QuizResultDTO mapToResultDto(QuizSubmission submission) {
        QuizResultDTO dto = new QuizResultDTO();
        dto.setQuizId(submission.getQuiz().getId());
        dto.setQuizTitle(submission.getQuiz().getTitle());
        dto.setTotalQuestions(submission.getTotalQuestions());
        dto.setCorrectAnswers(submission.getCorrectAnswers());
        dto.setScore(submission.getScore());
        dto.setPercentage(submission.getPercentage());
        dto.setSubmittedAt(submission.getSubmittedAt()); // or whatever timestamp field you're using
        return dto;
    }


    public List<QuizResultDTO> getUserSubmissions(UUID userId) {
        return quizSubmissionRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResultDto)
                .collect(Collectors.toList());
    }

}

