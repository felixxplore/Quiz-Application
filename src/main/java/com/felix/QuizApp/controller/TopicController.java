package com.felix.QuizApp.controller;

import com.felix.QuizApp.DTO.TopicResponse;
import com.felix.QuizApp.model.TopicEntity;
import com.felix.QuizApp.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {
    private final TopicService topicService;

    @PostMapping("/create")
    public TopicResponse createTopic(@Valid @RequestBody TopicEntity topic) {
        return topicService.createTopic(topic);
    }

    @GetMapping("/getAll")
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics();
    }
}
