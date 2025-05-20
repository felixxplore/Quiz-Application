package com.felix.QuizApp.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration(proxyBeanMethods=false)
@Profile("dev")
public class DotenvConfig {
    static {
        Dotenv.configure().ignoreIfMissing().load();
    }
}
