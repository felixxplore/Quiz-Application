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



}
