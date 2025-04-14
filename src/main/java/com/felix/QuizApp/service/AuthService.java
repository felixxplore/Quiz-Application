package com.felix.QuizApp.service;

import com.felix.QuizApp.DTO.LoginRequest;
import com.felix.QuizApp.DTO.SignupRequest;
import com.felix.QuizApp.config.JwtUtil;
import com.felix.QuizApp.enums.UserRole;
import com.felix.QuizApp.exceptions.EmailNotVerifiedException;
import com.felix.QuizApp.exceptions.InvalidJwtAuthenticationException;
import com.felix.QuizApp.exceptions.ResourceNotFoundException;
import com.felix.QuizApp.model.PasswordResetToken;
import com.felix.QuizApp.model.UserEntity;
import com.felix.QuizApp.model.VerificationToken;
import com.felix.QuizApp.repository.PasswordResetTokenRepository;
import com.felix.QuizApp.repository.UserRepository;
import com.felix.QuizApp.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private VerificationTokenService verificationTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    public void signup(SignupRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already in use");
        }

        UserEntity user= UserEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(false) // user is disabled until verification
                .build();


        userRepository.save(user);

        // Generate Verification Token
        String token=verificationTokenService.generateVerificationToken(user);

        sendVerificationEmail(user.getEmail(),token);

//        System.out.println("Verification link: http://localhost:8080/api/auth/verify-email?token="+token);
    }

    /**
     * 📧 Sends an email with a verification link containing a token.
     */
    public void sendVerificationEmail(String userEmail, String token) {
        String verificationUrl = "http://localhost:8080/api/auth/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("Verify Your Email - QuizApp");
        message.setText("Click the link below to verify your email: \n" + verificationUrl +
                "\n\nThis link will expire in 30 minutes.");

        mailSender.send(message);
    }

    public Map<String, Object> login(LoginRequest request){

       Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword())
        );

        // check user exist or not :
//        UserEntity user=userRepository.findByEmail(request.getEmail()).orElseThrow(()->
//                 new RuntimeException("User not found"));

        // check password valid or not :
//        if(!passwordEncoder.matches(request.getPassword(),user.getPasswordHash())){
//            throw new RuntimeException("Invalid credentials");
//        }

        // get authenticated user details
        UserDetails userDetails= (UserDetails) authentication.getPrincipal();

        // Fetch UserEntity again using email
        UserEntity user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ❌ Prevent login if email is not verified
        if (!user.isEnabled()) {
            throw new EmailNotVerifiedException("Email is not verified. Please check your email.");
        }

        String token=jwtUtil.generateToken(user);
        return Map.of("token",token,"user",user);
    }

    public ResponseEntity<String> verifyEmail(String token){
       VerificationToken verificationToken =verificationTokenService.getToken(token).orElseThrow(()-> new RuntimeException("Invalid Token"));

      UserEntity user =verificationToken.getUser();

        // Check if user is already verified
        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Email is already verified!");
        }

        // Activate User
        user.setEnabled(true);
        userRepository.save(user); // now email verify

        verificationTokenService.delete(verificationToken);
        return ResponseEntity.ok("Email verified successfully! You can now log in.");
    }

    public String resetPassword(String newPassword) {
        String hashedPassword = passwordEncoder.encode(newPassword);
        System.out.println("Encoded Password: " + hashedPassword);
        return hashedPassword;
    }

     @Transactional
     public void generatePasswordResetToken(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        System.out.println("Old Tokens: " + passwordResetTokenRepository.countByUserId(user.getId()));

        // ✅ Correctly deleting old tokens
        passwordResetTokenRepository.deleteByUserId(user.getId());

        System.out.println("After Deletion: " + passwordResetTokenRepository.countByUserId(user.getId()));

        // ✅ Generate a random token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30); // Token expires in 30 minutes

        // ✅ Directly assign user (no need to fetch again)
        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        // ✅ Send email
        sendPasswordResetEmail(user.getEmail(), token);
    }

    // 🔹 Send Email with Reset Link
     private void sendPasswordResetEmail(String email, String token) {
        String resetUrl = "http://localhost:8080/api/auth/reset-password?token=" + token;
        String subject = "Reset Your Password";
        String body = "Click the link to reset your password: " + resetUrl;

        emailService.sendEmail(email, subject, body);
    }

    // 🔹 Reset Password
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidJwtAuthenticationException("Invalid or expired token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidJwtAuthenticationException("Token has expired");
        }

        // 🔹 Update user password
        UserEntity user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 🔹 Delete the token after successful reset
        passwordResetTokenRepository.delete(resetToken);
    }

    public UserEntity getLoggedInUser() {
        // Get current authentication details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidJwtAuthenticationException("User not authenticated");
        }

        String username = authentication.getName();  // Extract username (email or username)
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }
}
