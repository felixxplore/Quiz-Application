package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.SubtopicResponse;
import com.felix.QuizApp.model.SubtopicEntity;
import com.felix.QuizApp.repository.SubtopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubtopicService {
    @Autowired
    private final SubtopicRepository subtopicRepository;

    public SubtopicResponse createSubtopic(SubtopicEntity subtopic) {
        SubtopicEntity savedSubtopic= subtopicRepository.save(subtopic);
        return new SubtopicResponse(savedSubtopic.getId(),savedSubtopic.getName());
    }

    public List<SubtopicResponse> getAllSubtopics() {
        return subtopicRepository.findAll().stream()
                .map(subtopic -> new SubtopicResponse(subtopic.getId(), subtopic.getName()))
                .collect(Collectors.toList());
    }
}
