package com.felix.QuizApp.repository;

import com.felix.QuizApp.model.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
}
