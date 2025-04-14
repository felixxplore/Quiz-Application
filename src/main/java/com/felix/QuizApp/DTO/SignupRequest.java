package com.felix.QuizApp.DTO;


import com.felix.QuizApp.enums.UserRole;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    private String email;
    private String name;
    private String password;
    private UserRole role;
}
