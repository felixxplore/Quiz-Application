package com.felix.QuizApp.controller;


import com.felix.QuizApp.DTO.LoginRequest;
import com.felix.QuizApp.DTO.PasswordResetRequest;
import com.felix.QuizApp.DTO.SignupRequest;
import com.felix.QuizApp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.Map;

@RestController
    @RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

   @Autowired
   private AuthService authService;


    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("User registered successfully!  Check logs for verification link.");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login( @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }


    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
      return authService.verifyEmail(token);
     }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        authService.generatePasswordResetToken(email);
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @GetMapping("/reset-password")
    public ResponseEntity<Void> redirectToFrontend(@RequestParam("token") String token) {
        String frontendUrl = "http://locahost:5173/reset-password?token=" + token;
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(frontendUrl)).build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful.");
    }
}

