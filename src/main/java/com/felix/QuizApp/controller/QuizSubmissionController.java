package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.QuizResultDTO;
import com.felix.QuizApp.DTO.SubmitQuizRequestDTO;
import com.felix.QuizApp.security.UserPrinciple;
import com.felix.QuizApp.service.QuizSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
 import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@Tag(name="Quiz Submission APIs")
public class QuizSubmissionController {

    private final QuizSubmissionService submissionService;

    @PostMapping("/submit")
    @Operation(summary = "quiz submission by user" )
    public ResponseEntity<QuizResultDTO> submitQuiz(
             @RequestBody SubmitQuizRequestDTO request,
            @AuthenticationPrincipal UserPrinciple user // <- get from security context
    ) {

        UUID userId = user.getId(); // 🎯 now this will work perfectly

        QuizResultDTO result = submissionService.submitQuiz(user.getId(), request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/submissions")
    @Operation(summary = "get quiz submissions of user" )
    public ResponseEntity<List<QuizResultDTO>> getSubmissionHistory(
            @AuthenticationPrincipal UserPrinciple user
    ) {
        List<QuizResultDTO> submissions = submissionService.getUserSubmissions(user.getId());
        return ResponseEntity.ok(submissions);
    }
}

