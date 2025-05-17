package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuizDTO;
import com.felix.QuizApp.model.QuizEntity;
import com.felix.QuizApp.service.QuizService;
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
public class QuizController {

    private final QuizService quizService;

//    @PreAuthorize("hasRole('ADMIN') or hasRole('QUIZ_CREATOR')")
    @PostMapping("/create")
    public QuizDTO createQuiz(@Valid @RequestBody QuizDTO quiz) {
        return quizService.createQuiz(quiz);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getAll")
    public List<QuizDTO> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        return  quizService.deleteQuiz(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizDTO updatedQuiz) {
        QuizDTO updated = quizService.updateQuiz(id, updatedQuiz);
        return ResponseEntity.ok(updated);
    }
}
