import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchQuizzes, fetchQuestionsByQuizId, submitQuiz } from '@/store/quizSlice';

interface Option {
  id: number;
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
}

interface Question {
  id: number;
  questionText: string;
  questionType: 'FILL_BLANK' | 'TRUE_FALSE' | 'MCQ';
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number;
  topicName: string;
  subtopicName: string;
}

interface SubmissionResult {
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  submittedAt: string;
}

const UserQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, questions, loading, error } = useSelector((state: RootState) => state.quiz);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);

  // Fetch quizzes on mount
  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  // Timer logic
  useEffect(() => {
    if (isQuizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isQuizStarted, timeLeft]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizStarted(true);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setAnswers({});
    setSubmissionResult(null);
    dispatch(fetchQuestionsByQuizId(quiz.id));
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;

    // Construct answers array
    const answersArray = questions
      .filter((q) => q.questionType === 'TRUE_FALSE' || q.questionType === 'MCQ')
      .map((question) => ({
        questionId: question.id,
        selectedOptionId: answers[question.id] || 0, // 0 for unanswered
      }));

    dispatch(
      submitQuiz({
        quizId: selectedQuiz.id,
        answers: answersArray,
      })
    ).then((result) => {
      if (submitQuiz.fulfilled.match(result)) {
        setSubmissionResult(result.payload);
        setIsQuizStarted(false);
        setSelectedQuiz(null);
        setTimeLeft(0);
        setAnswers({});
      }
    });
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (submissionResult) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
        <div className="p-4 border border-gray-200 rounded">
          <h2 className="text-xl font-semibold">{submissionResult.quizTitle}</h2>
          <p>Total Questions: {submissionResult.totalQuestions}</p>
          <p>Correct Answers: {submissionResult.correctAnswers}</p>
          <p>Score: {submissionResult.score}</p>
          <p>Percentage: {submissionResult.percentage}%</p>
          <p>Submitted At: {new Date(submissionResult.submittedAt).toLocaleString()}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setSubmissionResult(null)}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (isQuizStarted && selectedQuiz) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{selectedQuiz.title}</h1>
          <p className="text-lg font-medium">Time Left: {formatTime(timeLeft)}</p>
        </div>
        {loading && <p>Loading questions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded">
                <p className="font-medium mb-2">{question.questionText}</p>
                {question.questionType === 'FILL_BLANK' ? (
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled
                  />
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswerChange(question.id, option.id)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>{option.optionText}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <p>No questions available for this quiz.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Available Quizzes</h1>
      {loading && <p>Loading quizzes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-4 border border-gray-200 rounded">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-sm text-gray-600">{quiz.description}</p>
              <p className="text-sm text-gray-600">Difficulty: {quiz.difficultyLevel}</p>
              <p className="text-sm text-gray-600">Time Limit: {quiz.timeLimit} minutes</p>
              <p className="text-sm text-gray-600">Topic: {quiz.topicName}</p>
              <p className="text-sm text-gray-600">Subtopic: {quiz.subtopicName}</p>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleStartQuiz(quiz)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No quizzes available.</p>
      )}
    </div>
  );
};

export default UserQuiz;