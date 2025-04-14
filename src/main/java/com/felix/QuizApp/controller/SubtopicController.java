package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.SubtopicResponse;
import com.felix.QuizApp.model.SubtopicEntity;
import com.felix.QuizApp.service.SubtopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
@RequiredArgsConstructor
public class SubtopicController {
    private final SubtopicService subtopicService;

    @PostMapping("/create")
    public SubtopicResponse createSubtopic(@RequestBody SubtopicEntity subtopic) {
        return subtopicService.createSubtopic(subtopic);
    }

    @GetMapping("/getAll")
    public List<SubtopicResponse> getAllSubtopics() {
        return subtopicService.getAllSubtopics();
    }
}

