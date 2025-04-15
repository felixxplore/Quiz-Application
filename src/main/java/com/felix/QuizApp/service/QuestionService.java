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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
         question.setQuestionType(questionDTO.getQuestionType());
         question.setQuiz(quiz);

        QuestionEntity savedQuestion = questionRepository.save(question);

        // Save answer options
        List<AnswerOption> answerOptions = questionDTO.getOptions().stream().map(optionDTO -> {
            AnswerOption option = new AnswerOption();
            option.setQuestion(savedQuestion);
            option.setOptionText(optionDTO.getOptionText());
            option.setOptionIndex(optionDTO.getOptionIndex());
            option.setIsAnswerCorrect(optionDTO.getIsCorrect());
            return option;
        }).collect(Collectors.toList());

        answerOptionRepository.saveAll(answerOptions);

        return new QuestionDTO(
                savedQuestion.getId(),
                savedQuestion.getQuestionText(),
                 savedQuestion.getQuestionType(),
                 savedQuestion.getQuiz().getId(),
                answerOptions.stream().map(option -> new AnswerOptionDTO(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsAnswerCorrect(),
                        option.getOptionIndex(),
                        option.getQuestion().getId()
                )).collect(Collectors.toList())
        );
    }

    public List<QuestionDTO> getQuestionsByQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream().map(question -> new QuestionDTO(
                question.getId(),
                question.getQuestionText(),
                 question.getQuestionType(),
                 question.getQuiz().getId(),
                question.getOptions().stream().map(option -> new AnswerOptionDTO(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsAnswerCorrect(),
                        option.getOptionIndex(),
                       option.getQuestion().getId()
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }


    public QuestionDTO updateQuestion(Long questionId, QuestionDTO updatedQuestionDTO) {
        QuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));



        question.setQuestionText(updatedQuestionDTO.getQuestionText());
        question.setQuestionType(updatedQuestionDTO.getQuestionType());

        question.getOptions().clear();
        // First delete old options
//        answerOptionRepository.deleteAll(question.getOptions());

        // Add new options
//        List<AnswerOption> newOptions = updatedQuestionDTO.getOptions().stream().map(optionDTO -> {
//            AnswerOption option = new AnswerOption();
//            option.setQuestion(question);
//            option.setOptionText(optionDTO.getOptionText());
//            option.setIsAnswerCorrect(optionDTO.getIsCorrect());
//            option.setOptionIndex(optionDTO.getOptionIndex());
//            return option;
//        }).collect(Collectors.toList());

//        question.setOptions(newOptions);
//        QuestionEntity saved = questionRepository.save(question);
//        answerOptionRepository.saveAll(newOptions);

        // Add new options to existing list
        for (AnswerOptionDTO optionDTO : updatedQuestionDTO.getOptions()) {
            AnswerOption option = new AnswerOption();
            option.setQuestion(question); // maintain the relationship
            option.setOptionText(optionDTO.getOptionText());
            option.setIsAnswerCorrect(optionDTO.getIsCorrect());
            option.setOptionIndex(optionDTO.getOptionIndex());

            question.getOptions().add(option); // important: add to the same list
        }

        // Save the question (options will be handled by cascade)
        QuestionEntity saved = questionRepository.save(question);
        return new QuestionDTO(
                saved.getId(),
                saved.getQuestionText(),
                saved.getQuestionType(),
                saved.getQuiz().getId(),
                saved.getOptions().stream().map(opt -> new AnswerOptionDTO(
                        opt.getId(),
                        opt.getOptionText(),
                        opt.getIsAnswerCorrect(),
                        opt.getOptionIndex(),
                        opt.getQuestion().getId()
                )).collect(Collectors.toList())
        );
    }


    public ResponseEntity<String> deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");
        }

        questionRepository.deleteById(questionId);
        return ResponseEntity.ok("Question deleted successfully");
    }


}

