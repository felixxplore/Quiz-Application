package com.felix.QuizApp.repository;

import com.felix.QuizApp.model.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    List<QuizSubmission> findByUserId(UUID userId);
}
