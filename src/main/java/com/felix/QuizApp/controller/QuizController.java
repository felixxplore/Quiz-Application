package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuizDTO;
import com.felix.QuizApp.model.QuizEntity;
import com.felix.QuizApp.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@Tag(name="Quiz APIs", description = "create, get by id, update by id, get all quiz, delete by id ")
public class QuizController {

    private final QuizService quizService;

//    @PreAuthorize("hasRole('ADMIN') or hasRole('QUIZ_CREATOR')")
    @PostMapping("/create")
    @Operation(summary = "create quiz")
    public QuizDTO createQuiz(@Valid @RequestBody QuizDTO quiz) {
        return quizService.createQuiz(quiz);
    }

    @GetMapping("/{id}")
    @Operation(summary="get quiz by id")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @PreAuthorize("hasRole('USER')")
    @Operation(summary="get all quiz")
    @GetMapping("/getAll")
    public List<QuizDTO> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "delete quiz by id")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        return  quizService.deleteQuiz(id);
    }

    @PutMapping("/{id}")
    @Operation(summary="update quiz by id")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizDTO updatedQuiz) {
        QuizDTO updated = quizService.updateQuiz(id, updatedQuiz);
        return ResponseEntity.ok(updated);
    }
}
