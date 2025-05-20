package com.felix.QuizApp.controller;

import com.felix.QuizApp.model.PasswordResetToken;
import com.felix.QuizApp.model.UserEntity;
import com.felix.QuizApp.repository.PasswordResetTokenRepository;
import com.felix.QuizApp.repository.UserRepository;
import com.felix.QuizApp.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/pssword-reset")
@Tag(name="Password Reset APIs")
public class PasswordResetController {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        System.out.println("Reset Password Link: http://localhost:8080/api/auth/reset-password?token=" + token);
        return ResponseEntity.ok("Password reset link has been sent.");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        UserEntity user = resetToken.getUser();
        user.setPasswordHash(authService.resetPassword(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password successfully reset!");
    }

}

