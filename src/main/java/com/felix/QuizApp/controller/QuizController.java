package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuizDTO;
import com.felix.QuizApp.model.QuizEntity;
import com.felix.QuizApp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/create")
    public QuizDTO createQuiz(@RequestBody QuizDTO quiz) {
        return quizService.createQuiz(quiz);
    }

    @GetMapping("/{id}")
    public Optional<QuizEntity> getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @GetMapping("/getAll")
    public List<QuizDTO> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        return  quizService.deleteQuiz(id);
    }

    @PutMapping("/{id}")
    public QuizEntity updateQuiz(@PathVariable Long id, @RequestBody QuizEntity updatedQuiz) {
        return quizService.updateQuiz(id, updatedQuiz);
    }
}
