package com.felix.QuizApp.controller;

import com.felix.QuizApp.model.UserEntity;
import com.felix.QuizApp.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@Tag(name="User APIs")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    @Operation(summary = "get user profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String email = authentication.getName(); // Get authenticated user's email
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(user);
    }
}
