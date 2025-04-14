package com.felix.QuizApp.DTO;



import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String name;
    private List<SubtopicResponse> subtopics;
}


