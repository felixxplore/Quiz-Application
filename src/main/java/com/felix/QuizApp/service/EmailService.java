package com.felix.QuizApp.service;


import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;


    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.email.from}")
    private String fromEmail;


    /**
     * Generic method to send any type of email (text or HTML).
     * @param to Recipient's email address
     * @param subject Email subject
     * @param body Email content (text or HTML)
     * @param isHtml Whether the body is HTML (true) or plain text (false)
     */
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        try {
            Email from = new Email(fromEmail); // Sender email, verified in SendGrid
            Email toEmail = new Email(to);
            Content content = new Content(isHtml ? "text/html" : "text/plain", body);
//            Mail mail = new Mail(from, subject, toEmail, content);

            // Add BCC to sender's email
//            mail.getPersonalization(0).addBcc(new Email(fromEmail));

            // Create Mail object
            Mail mail = new Mail();

            // Create and configure Personalization
            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);
            personalization.addBcc(new Email(fromEmail)); // BCC to sender
            personalization.setSubject(subject);
            mail.addPersonalization(personalization);
            mail.addContent(content);
            mail.setFrom(from);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("Email sent successfully: " + response.getStatusCode());
            } else {
                throw new RuntimeException("Failed to send email: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Email sending failed"+ e.getMessage());
        }
    }

    /**
     * Specific method for sending verification emails.
     * @param userEmail Recipient's email address
     * @param token Verification token
     */
    public void sendVerificationEmail(String userEmail, String token) {
        String subject = "Verify Your Email - QuizApp";
        String body = "<p>Hi,</p>" +
                "<p>Please verify your QuizApp account by clicking the link below:</p>" +
                "<p><a href=\"" + baseUrl + "/api/auth/verify-email?token=" + token + "\">Verify Email</a></p>" +
                "<p>This link will expire in 30 minutes.</p>" +
                "<p>Thanks,<br>QuizApp Team</p>";
        sendEmail(userEmail, subject, body, true); // HTML email
    }
}