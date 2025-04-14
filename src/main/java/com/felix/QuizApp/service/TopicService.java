package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.SubtopicResponse;
import com.felix.QuizApp.DTO.TopicResponse;
import com.felix.QuizApp.model.TopicEntity;
import com.felix.QuizApp.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {

    @Autowired
    private final TopicRepository topicRepository;

    public TopicResponse convertToDTO(TopicEntity topic) {
        List<SubtopicResponse> subtopics = topic.getSubtopics().stream()
                .map(subtopic -> new SubtopicResponse(subtopic.getId(), subtopic.getName()))
                .collect(Collectors.toList());
        return new TopicResponse(topic.getId(), topic.getName(), subtopics);
    }

    public TopicResponse createTopic(TopicEntity topic) {
         TopicEntity savedTopic =topicRepository.save(topic);
         return convertToDTO(savedTopic);
    }

    public List<TopicResponse> getAllTopics() {
        return topicRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList()); }
}
