FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /QuizApp-0.0.1-SNAPSHOT

# Copy Maven wrapper and pom.xml
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Set execute permission for the mvnw script
RUN chmod +x mvnw


# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the app (skip tests to save time)
RUN ./mvnw package -DskipTests

# ---------- Step 2: Run the app ----------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /QuizApp-0.0.1-SNAPSHOT



COPY --from=builder /QuizApp-0.0.1-SNAPSHOT/target/*.jar QuizApp-0.0.1-SNAPSHOT.jar


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "QuizApp-0.0.1-SNAPSHOT.jar"]
