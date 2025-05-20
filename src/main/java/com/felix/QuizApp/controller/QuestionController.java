package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuestionDTO;
import com.felix.QuizApp.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name="Question APIs")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/add/{quizId}")
    @Operation(summary ="add question to quiz by quiz id" )
    public ResponseEntity<QuestionDTO> addQuestionToQuiz(
            @PathVariable Long quizId,
           @Valid @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionService.addQuestionToQuiz(quizId, questionDTO));
    }

    @GetMapping("/{quizId}")
    @Operation(summary = "get questions by quiz id" )
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuiz(quizId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "update question by question id")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id,@Valid @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionService.updateQuestion(id, questionDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "delete question by question Id" )
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        return questionService.deleteQuestion(id);
    }

}

