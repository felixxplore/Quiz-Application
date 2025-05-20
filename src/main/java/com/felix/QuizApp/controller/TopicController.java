package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.TopicResponse;
import com.felix.QuizApp.model.TopicEntity;
import com.felix.QuizApp.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name="Topic APIs")
public class TopicController {
    private final TopicService topicService;

    @PostMapping("/create")
    @Operation(summary ="create topic" )
    public TopicResponse createTopic(@Valid @RequestBody TopicEntity topic) {
        return topicService.createTopic(topic);
    }

    @GetMapping("/getAll")
    @Operation(summary ="get topics" )
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics();
    }
}
