package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.QuizDTO;
import com.felix.QuizApp.model.QuizEntity;
import com.felix.QuizApp.model.SubtopicEntity;
import com.felix.QuizApp.model.TopicEntity;
import com.felix.QuizApp.model.UserEntity;
import com.felix.QuizApp.repository.QuizRepository;
import com.felix.QuizApp.repository.SubtopicRepository;
import com.felix.QuizApp.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    @Autowired
    private final QuizRepository quizRepository;

    @Autowired
    private final TopicRepository topicRepository;

    @Autowired
    private final SubtopicRepository subtopicRepository;


    @Autowired
    private final AuthService authService;
    public QuizDTO createQuiz(QuizDTO quizDTO) {

        UserEntity currentUser = authService.getLoggedInUser();

        TopicEntity topic = topicRepository.findById(quizDTO.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        SubtopicEntity subtopic = subtopicRepository.findById(quizDTO.getSubtopicId())
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));

        QuizEntity quiz = new QuizEntity();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setDifficultyLevel(quizDTO.getDifficultyLevel());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setCreatedBy(currentUser.getName());
        quiz.setTopic(topic);
        quiz.setSubtopic(subtopic);



        QuizEntity savedQuiz= quizRepository.save(quiz);
        return new QuizDTO(
                savedQuiz.getId(),
                savedQuiz.getTitle(),
                savedQuiz.getDescription(),
                savedQuiz.getDifficultyLevel(),
                savedQuiz.getTimeLimit(),
                currentUser.getName(),
                savedQuiz.getTopic().getId(),
                savedQuiz.getSubtopic().getId(),
                savedQuiz.getTopic().getName(),
                savedQuiz.getSubtopic().getName()
        );
    }


    public Optional<QuizEntity> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream().map(quiz-> new QuizDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDifficultyLevel(),
                quiz.getTimeLimit(),
                quiz.getCreatedBy(),
                quiz.getTopic().getId(),
                quiz.getSubtopic().getId(),
                quiz.getTopic().getName(),
                quiz.getSubtopic().getName()
        )).collect(Collectors.toList());
    }

    public ResponseEntity<String> deleteQuiz(Long quizId) {
        if (quizRepository.existsById(quizId)) {
            quizRepository.deleteById(quizId);
            return ResponseEntity.ok("Quiz deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quiz not found with ID: " + quizId);
        }    }

    public QuizEntity updateQuiz(Long id, QuizEntity updatedQuiz) {
        return quizRepository.findById(id).map(quiz -> {
            // Update fields only if new values are provided
            if (updatedQuiz.getTitle() != null) {
                quiz.setTitle(updatedQuiz.getTitle());
            }
            if (updatedQuiz.getDescription() != null) {
                quiz.setDescription(updatedQuiz.getDescription());
            }
            if (updatedQuiz.getDifficultyLevel() != null) {
                quiz.setDifficultyLevel(updatedQuiz.getDifficultyLevel());
            }
            if (updatedQuiz.getTimeLimit() != null) {
                quiz.setTimeLimit(updatedQuiz.getTimeLimit());
            }
            if (updatedQuiz.getTopic() != null) {
                quiz.setTopic(updatedQuiz.getTopic());
            }
            if (updatedQuiz.getSubtopic() != null) {
                quiz.setSubtopic(updatedQuiz.getSubtopic());
            }
                quiz.setCreatedBy(updatedQuiz.getCreatedBy());
            return quizRepository.save(quiz);
        }).orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
    }
}

