package com.felix.QuizApp.controller;

 import com.felix.QuizApp.service.GeminiAIService;
 import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-quiz")
public class AIQuizController {

    @Autowired
    private GeminiAIService geminiAIService;


    @GetMapping("/generate")
    public String generateQuiz(
            @RequestParam String topic,
            @RequestParam String subtopic,
            @RequestParam String difficulty) {

        return geminiAIService.generateMCQs(topic, subtopic, difficulty,50);
    }

}
