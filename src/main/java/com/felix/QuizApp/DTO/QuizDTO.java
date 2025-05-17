package com.felix.QuizApp.DTO;

import com.felix.QuizApp.enums.DifficultyLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private DifficultyLevel difficultyLevel;

    @NotNull(message = "Time limit is required")
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;

    private String createdBy;

    @NotNull(message = "Topic ID is required")
    private Long topicId;

    @NotNull(message = "Subtopic ID is required")
    private Long subtopicId;
    private String topicName;
    private String subtopicName;
    private TopicDTO topic;

    public QuizDTO(Long id, String title, String description, DifficultyLevel difficultyLevel, Integer timeLimit, String createdBy,
                   Long topicId, Long subtopicId, String topicName, String subtopicName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficultyLevel = difficultyLevel;
        this.timeLimit = timeLimit;
        this.createdBy = createdBy;
        this.topicId = topicId;
        this.subtopicId = subtopicId;
        this.topicName = topicName;
        this.subtopicName = subtopicName;
    }


    @Data
    @AllArgsConstructor
    public static class TopicDTO {
        private Long id;

        @NotBlank(message = "Topic name is required")
        private String name;
    }

}
