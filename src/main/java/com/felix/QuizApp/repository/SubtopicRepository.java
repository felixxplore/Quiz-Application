package com.felix.QuizApp.repository;

import com.felix.QuizApp.model.SubtopicEntity;
import com.felix.QuizApp.model.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubtopicRepository extends JpaRepository<SubtopicEntity, Long> {
    Optional<SubtopicEntity> findByNameAndTopic(String name, TopicEntity topic);

}
