package com.felix.QuizApp.controller;


import com.felix.QuizApp.DTO.LoginRequest;
import com.felix.QuizApp.DTO.PasswordResetRequest;
import com.felix.QuizApp.DTO.SignupRequest;
import com.felix.QuizApp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name="Auth APIs")
public class AuthController {

   @Autowired
   private AuthService authService;


    @PostMapping("/signup")
    @Operation(summary="user registration")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("User registered successfully!  Check logs for verification link.");
    }

    @PostMapping("/login")
    @Operation(summary="user login")
    public ResponseEntity<Map<String,Object>> login( @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }


    @GetMapping("/verify-email")
    @Operation(summary = "Verify email before login")
    public RedirectView verifyEmail(@RequestParam("token") String token) throws UnsupportedEncodingException {
        try {
            ResponseEntity<?> response = authService.verifyEmail(token);
            String message = response.getBody().toString();
            return new RedirectView("https://quiz-application-bw4x.onrender.com/verify-email?status=success&message=" +
                    java.net.URLEncoder.encode(message, "UTF-8"));
        } catch (Exception ex) {
            return new RedirectView("https://quiz-application-bw4x.onrender.com/verify-email?status=error&message=" +
                    java.net.URLEncoder.encode(ex.getMessage(), "UTF-8"));
        }
    }

    @PostMapping("/forgot-password")
    @Operation(summary="generate password reset token")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        authService.generatePasswordResetToken(email);
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @GetMapping("/reset-password")
    @Operation(summary="user get new token for reset password")
    public ResponseEntity<Void> redirectToFrontend(@RequestParam("token") String token) {
        String frontendUrl = "http://locahost:5173/reset-password?token=" + token;
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(frontendUrl)).build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "update password with new token")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful.");
    }
}

