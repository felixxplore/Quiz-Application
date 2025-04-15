package com.felix.QuizApp.DTO;

import com.felix.QuizApp.enums.DifficultyLevel;
import com.felix.QuizApp.model.UserEntity;
import lombok.*;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private DifficultyLevel difficultyLevel;
    private Integer timeLimit;
    private String createdBy;
    private Long topicId;
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
        private String name;
    }

}
