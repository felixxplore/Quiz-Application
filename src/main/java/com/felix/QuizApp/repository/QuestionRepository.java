package com.felix.QuizApp.repository;

import com.felix.QuizApp.DTO.QuestionDTO;
import com.felix.QuizApp.model.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity,Long> {
    List<QuestionEntity> findByQuizId(Long quizId);
}
