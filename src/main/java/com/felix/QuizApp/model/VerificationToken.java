package com.felix.QuizApp.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "verification_token")
public class VerificationToken {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String token;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name="user_id",referencedColumnName = "id",nullable = false)
    private UserEntity user;

    private LocalDateTime expiryDate;


    public VerificationToken(String token, UserEntity user, LocalDateTime expiryDate) {
        this.token=token;
        this.user=user;
        this.expiryDate=expiryDate;
    }
}

