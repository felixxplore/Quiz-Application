package com.felix.QuizApp.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    @Value("${gemini.api.endpoint}")
    private String apiUrl;

    private final WebClient webClient;

    public GeminiAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateMCQs(String topic, String subtopic, String difficulty, int count) {
        String prompt = "Generate " + count + " multiple-choice questions (MCQs) on '" + topic + "' - '" + subtopic +
                "' with '" + difficulty + "' difficulty. Each MCQ should have 4 options and a correct answer.";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
