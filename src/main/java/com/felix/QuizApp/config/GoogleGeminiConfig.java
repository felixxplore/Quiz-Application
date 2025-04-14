package com.felix.QuizApp.config;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class GoogleGeminiConfig {


    @Value("${gemini.credentials.path}")
    private String credentialsPath;

    @Bean
    public GoogleCredentials googleCredentials() throws IOException {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("gemini-service-account.json");
        if (inputStream == null) {
            throw new IOException("Google Gemini credentials file not found!");
        }
        return GoogleCredentials.fromStream(inputStream);
    }
}

