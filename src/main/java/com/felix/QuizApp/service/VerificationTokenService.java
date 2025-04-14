package com.felix.QuizApp.service;

import com.felix.QuizApp.model.UserEntity;
import com.felix.QuizApp.model.VerificationToken;
import com.felix.QuizApp.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationTokenService {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    public String generateVerificationToken(UserEntity user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                token,
                user,
                LocalDateTime.now().plusMinutes(15)  // Token expires in 15 minutes
        );
        verificationTokenRepository.save(verificationToken);


        // Log the verification link in the console
//        String verificationLink = "http://localhost:8080/api/auth/verify-email?token=" + token;
//        System.out.println("📧 Verification Link: " + verificationLink);
        return token;
    }


    public Optional<VerificationToken> getToken(String token){
     return verificationTokenRepository.findByToken(token);

    }

    public void delete(VerificationToken verificationToken) {
        verificationTokenRepository.delete(verificationToken);
    }
}
