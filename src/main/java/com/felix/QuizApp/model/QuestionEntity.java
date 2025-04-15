package com.felix.QuizApp.model;

import com.felix.QuizApp.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionType")
    private QuestionType questionType; // MCQ, True/False, etc.

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private QuizEntity quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AnswerOption> options = new ArrayList<>();

//    private int marks;
//    private String explanation;
}
