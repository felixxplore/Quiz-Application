package com.felix.QuizApp.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @Email(message="Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message="Password is required")
    private String password;
}
