package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.SubtopicResponse;
import com.felix.QuizApp.model.SubtopicEntity;
import com.felix.QuizApp.service.SubtopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
@RequiredArgsConstructor
@Tag(name="Subtopic APIs")
public class SubtopicController {
    private final SubtopicService subtopicService;

    @PostMapping("/create")
    @Operation(summary = "create subtopic")
    public SubtopicResponse createSubtopic(@Valid @RequestBody SubtopicEntity subtopic) {
        return subtopicService.createSubtopic(subtopic);
    }

    @GetMapping("/getAll")
    @Operation(summary = "get subtopics" )
    public List<SubtopicResponse> getAllSubtopics() {
        return subtopicService.getAllSubtopics();
    }
}

