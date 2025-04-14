package com.felix.QuizApp.repository;

import com.felix.QuizApp.model.QuizEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<QuizEntity,Long> {
    List<QuizEntity> findByTopicId(Long topicId);
    List<QuizEntity> findBySubtopicId(Long subtopicId);
}
