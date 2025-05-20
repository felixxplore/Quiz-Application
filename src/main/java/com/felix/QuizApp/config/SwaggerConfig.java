package com.felix.QuizApp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
 import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${springdoc.api.servers.local}")
    private String localUrl;

    @Value("${springdoc.api.servers.production}")
    public String prodUrl;

    @Value("${portfolio.url}")
    public String portfolioUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url(localUrl).description("Local Development Server"))
                .addServersItem(new Server().url(prodUrl).description("Production Server"))
                .info(new Info()
                        .title("Quiz Application APIs")
                        .description("API documentation for the Quiz Application, providing endpoints for managing quizzes, questions, users, and results.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Felix")
                                .email("felixxplore08@gmail.com")
                                .url(portfolioUrl)))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }


}
