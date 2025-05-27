FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

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
RUN ./mvnw clean package -DskipTests

# ---------- Step 2: Run the app ----------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app



COPY --from=builder /app/target/*.jar app.jar


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
