# Quizify - Quiz Application

## Overview
Quizify is a full-stack web application designed to create, manage, and take quizzes. It supports user authentication, quiz creation by admins, and quiz submissions by users, with features like email verification and password recovery. The application is deployed with a React-based frontend on Vercel and a Spring Boot backend on Render, using PostgreSQL for data storage.

## Features
- **User Authentication**:
  - Register a new user with automatic email verification link.
  - User login with JWT-based authentication.
  - Initiate password reset process.
  - Retrieve authenticated user's profile details.
  - Sends a verification link post-signup; clicking the link verifies the user automatically.

- **Admin Features**:
  - Create a new topic.
  - Create a subtopic under a topic.
  - Retrieve all topics.
  - Retrieve all subtopics for a specific topic.
  - Create a new quiz.
  - Add a question to a quiz.
  - Update an existing quiz.
  - Edit an existing question.
  - Delete a quiz by ID.
  - Delete a question by ID.

- **User Features**:
  - Retrieve all available quizzes.
  - Retrieve details of a specific quiz by ID.
  - Retrieve all questions for a specific quiz.
  - Submit quiz answers.
  - Retrieve user's submission history.

## Tech Stack
### Frontend
- **React.js**: UI library for building interactive components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: Component library for consistent UI elements.
- **Redux Toolkit**: State management for predictable state handling.

### Backend
- **Spring Boot**: Framework for building robust Java applications.
- **Spring Security**: Security framework for authentication and authorization.
- **Spring Data JPA**: ORM for database interactions.
- **Java 21**: Programming language version.
- **PostgreSQL**: Relational database for persistent storage.
- **JWT**: JSON Web Tokens for secure authentication.
- **Spring Boot Validation**: Input validation for API endpoints.
- **Spring Boot Starter Mail**: Email sending for verification and password reset.

### Deployment
- **Frontend**: Hosted on Vercel.
- **Backend**: Hosted on Render.

## Prerequisites
- **Node.js** (v18 or higher) for frontend development.
- **Java 21** for backend development.
- **PostgreSQL** (v14 or higher) for database.
- **Maven** for dependency management and building the backend.
- **NPM** or **Yarn** for frontend dependency management.
- **SMTP Server** (e.g., Gmail) for email verification.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/felixxplore/Quiz-Application.git
   cd quizify
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Configure the database and email settings in `application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/quizify
     spring.datasource.username=your-username
     spring.datasource.password=your-password
     spring.mail.host=smtp.gmail.com
     spring.mail.port=587
     spring.mail.username=your-email@gmail.com
     spring.mail.password=your-app-password
     ``` 
   - Build and run the backend:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure environment variables in `.env`:
     ```env
     VITE_API_BASE_URL=https://your-backend-url
     ```
   - Run the frontend:
     ```bash
     npm run dev
     ```

<!-- ## API Documentation
API documentation is being developed using **Swagger**. Once completed, it will be accessible at:
```
https://your-backend-url/swagger-ui/index.html
``` -->

## Testing
Testing is planned using the following tools:
- **Backend**: JUnit and Mockito for unit and integration tests.
- **Frontend**: Jest and React Testing Library for component and integration tests.
- Tests will cover API endpoints, authentication flows, and UI interactions.

<!-- ## Demo
A demo video showcasing the application's features will be added soon. It will include:
- User signup and email verification.
- Quiz creation and management by admins.
- Quiz taking and submission history for users. -->

## Contact
For any inquiries, reach out to [satyampawar0070@gmail.com](mailto:satyampawar0070@gmail.com).
 
