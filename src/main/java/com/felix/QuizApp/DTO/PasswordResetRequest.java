package com.felix.QuizApp.DTO;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
public class PasswordResetRequest {
    private String token;
    private String newPassword;
}
