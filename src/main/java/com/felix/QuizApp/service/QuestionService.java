package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.AnswerOptionDTO;
import com.felix.QuizApp.DTO.QuestionDTO;
import com.felix.QuizApp.model.AnswerOption;
import com.felix.QuizApp.model.QuestionEntity;
import com.felix.QuizApp.model.QuizEntity;
import com.felix.QuizApp.repository.AnswerOptionRepository;
import com.felix.QuizApp.repository.QuestionRepository;
import com.felix.QuizApp.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    @Autowired
    private final QuestionRepository questionRepository;

    @Autowired
    private final QuizRepository quizRepository;

    @Autowired
    private final AnswerOptionRepository answerOptionRepository;

    public QuestionDTO addQuestionToQuiz(Long quizId, QuestionDTO questionDTO) {
        QuizEntity quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        QuestionEntity question = new QuestionEntity();
        question.setQuestionText(questionDTO.getQuestionText());
         question.setType(questionDTO.getType());
         question.setQuiz(quiz);

        QuestionEntity savedQuestion = questionRepository.save(question);

        // Save answer options
        List<AnswerOption> answerOptions = questionDTO.getOptions().stream().map(optionDTO -> {
            AnswerOption option = new AnswerOption();
            option.setQuestion(savedQuestion);
            option.setOptionText(optionDTO.getOptionText());
            option.setOptionIndex(optionDTO.getOptionIndex());
            option.setIsCorrect(optionDTO.getIsCorrect());
            return option;
        }).collect(Collectors.toList());

        answerOptionRepository.saveAll(answerOptions);

        return new QuestionDTO(
                savedQuestion.getId(),
                savedQuestion.getQuestionText(),
                 savedQuestion.getType(),
                 savedQuestion.getQuiz().getId(),
                answerOptions.stream().map(option -> new AnswerOptionDTO(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsCorrect(),
                        option.getOptionIndex(),
                        option.getQuestion().getId()
                )).collect(Collectors.toList())
        );
    }

    public List<QuestionDTO> getQuestionsByQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream().map(question -> new QuestionDTO(
                question.getId(),
                question.getQuestionText(),
                 question.getType(),
                 question.getQuiz().getId(),
                question.getOptions().stream().map(option -> new AnswerOptionDTO(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsCorrect(),
                        option.getOptionIndex(),
                       option.getQuestion().getId()
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }
}

