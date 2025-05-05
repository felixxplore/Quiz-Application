FROM eclipse-temurin:21-jdk-alpine

WORKDIR /QuizApp-0.0.1-SNAPSHOT

COPY target/*.jar QuizApp-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "QuizApp-0.0.1-SNAPSHOT.jar"]
