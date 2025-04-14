package com.felix.QuizApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", referencedColumnName = "id",nullable = false)
    private UserEntity user;

    private LocalDateTime expiryDate;

    private boolean isUsed;

    public PasswordResetToken(String token, UserEntity user, LocalDateTime localDateTime) {
        this.token=token;
        this.user=user;
        this.expiryDate=localDateTime;
    }
}

