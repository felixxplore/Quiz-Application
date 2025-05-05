package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuestionDTO;
import com.felix.QuizApp.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/add/{quizId}")
    public ResponseEntity<QuestionDTO> addQuestionToQuiz(
            @PathVariable Long quizId,
            @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionService.addQuestionToQuiz(quizId, questionDTO));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuiz(quizId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionService.updateQuestion(id, questionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        return questionService.deleteQuestion(id);
    }

}

