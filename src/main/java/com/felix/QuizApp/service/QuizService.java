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

//        UserEntity currentUser = authService.getLoggedInUser();

        TopicEntity topic = topicRepository.findById(quizDTO.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        SubtopicEntity subtopic = subtopicRepository.findById(quizDTO.getSubtopicId())
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));

        QuizEntity quiz = new QuizEntity();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setDifficultyLevel(quizDTO.getDifficultyLevel());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setCreatedBy("ADMIN");
        quiz.setTopic(topic);
        quiz.setSubtopic(subtopic);



        QuizEntity savedQuiz= quizRepository.save(quiz);

        QuizDTO.TopicDTO topicDTO = new QuizDTO.TopicDTO(topic.getId(), topic.getName());

        return new QuizDTO(
                savedQuiz.getId(),
                savedQuiz.getTitle(),
                savedQuiz.getDescription(),
                savedQuiz.getDifficultyLevel(),
                savedQuiz.getTimeLimit(),
//                currentUser.getName(),
                "ADMIN",
                savedQuiz.getTopic().getId(),
                savedQuiz.getSubtopic().getId(),
                savedQuiz.getTopic().getName(),
                savedQuiz.getSubtopic().getName(),
                topicDTO
        );
    }


    public Optional<QuizDTO> getQuizById(Long id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    QuizDTO.TopicDTO topicDTO = new QuizDTO.TopicDTO(
                            quiz.getTopic().getId(),
                            quiz.getTopic().getName()
                    );

                    return new QuizDTO(
                            quiz.getId(),
                            quiz.getTitle(),
                            quiz.getDescription(),
                            quiz.getDifficultyLevel(),
                            quiz.getTimeLimit(),
                            quiz.getCreatedBy(),
                            quiz.getTopic().getId(),
                            quiz.getSubtopic().getId(),
                            quiz.getTopic().getName(),
                            quiz.getSubtopic().getName(),
                            topicDTO
                    );
                });
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

    public QuizDTO updateQuiz(Long id, QuizDTO updatedQuizDTO) {
        return quizRepository.findById(id).map(quiz -> {

            // Update fields only if new values are provided in DTO
            if (updatedQuizDTO.getTitle() != null) {
                quiz.setTitle(updatedQuizDTO.getTitle());
            }
            if (updatedQuizDTO.getDescription() != null) {
                quiz.setDescription(updatedQuizDTO.getDescription());
            }
            if (updatedQuizDTO.getDifficultyLevel() != null) {
                quiz.setDifficultyLevel(updatedQuizDTO.getDifficultyLevel());
            }
            if (updatedQuizDTO.getTimeLimit() != null) {
                quiz.setTimeLimit(updatedQuizDTO.getTimeLimit());
            }
            if (updatedQuizDTO.getTopicId() != null) {
                topicRepository.findById(updatedQuizDTO.getTopicId()).ifPresent(quiz::setTopic);
            }
            if (updatedQuizDTO.getSubtopicId() != null) {
                subtopicRepository.findById(updatedQuizDTO.getSubtopicId()).ifPresent(quiz::setSubtopic);
            }

            if (updatedQuizDTO.getCreatedBy() != null) {
                quiz.setCreatedBy(updatedQuizDTO.getCreatedBy());
            }

            QuizEntity savedQuiz = quizRepository.save(quiz);

            // Convert back to DTO and return
            QuizDTO.TopicDTO topicDTO = new QuizDTO.TopicDTO(
                    savedQuiz.getTopic().getId(),
                    savedQuiz.getTopic().getName()
            );

            return new QuizDTO(
                    savedQuiz.getId(),
                    savedQuiz.getTitle(),
                    savedQuiz.getDescription(),
                    savedQuiz.getDifficultyLevel(),
                    savedQuiz.getTimeLimit(),
                    savedQuiz.getCreatedBy(),
                    savedQuiz.getTopic().getId(),
                    savedQuiz.getSubtopic().getId(),
                    savedQuiz.getTopic().getName(),
                    savedQuiz.getSubtopic().getName(),
                    topicDTO
            );

        }).orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
    }

}

